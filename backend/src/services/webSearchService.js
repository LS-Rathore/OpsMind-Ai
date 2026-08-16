import { tavily } from '@tavily/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Performs a live web search using the Tavily API.
 * Returns an array of search result objects with title, url, and content.
 *
 * On failure, returns an empty array so callers can handle gracefully.
 */
export const searchWeb = async (query, maxResults = 5) => {
  try {
    const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

    const response = await client.search(query, {
      maxResults,
      searchDepth: 'basic',
      includeAnswer: false,
    });

    const results = (response.results || []).map((r) => ({
      title: r.title || 'Untitled',
      url: r.url || '',
      content: r.content || '',
    }));

    console.log(`[WebSearch] Found ${results.length} results for: "${query}"`);
    return results;
  } catch (error) {
    console.error('[WebSearch] Search failed:', error.message);
    return [];
  }
};

/**
 * Streams a Gemini-generated response based on web search results.
 * Uses the same SSE event protocol as all other response functions
 * (token → sources → metadata → done) so the frontend handles it identically.
 *
 * Sources are clearly labelled as coming from web search (not internal docs).
 */
export const streamWebSearchResponse = async (query, res) => {
  const startTime = Date.now();
  let tokenCount = 0;
  let fullText = '';

  try {
    // --- Step 1: Perform web search ---
    const searchResults = await searchWeb(query);

    if (searchResults.length === 0) {
      // No web results either — inform the user
      const noResultsMsg =
        "I wasn't able to find relevant information in your uploaded documents or from a live web search. " +
        "Please try rephrasing your question, or ensure the relevant document has been uploaded.";

      res.write(`data: ${JSON.stringify({ type: 'token', content: noResultsMsg })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'sources', sources: [] })}\n\n`);
      res.write(
        `data: ${JSON.stringify({
          type: 'metadata',
          tokenCount: noResultsMsg.split(/\s+/).filter(Boolean).length,
          responseTimeMs: Date.now() - startTime,
          isHallucination: false,
        })}\n\n`
      );
      res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
      return {
        tokenCount: noResultsMsg.split(/\s+/).filter(Boolean).length,
        responseTimeMs: Date.now() - startTime,
        isHallucination: false,
      };
    }

    // --- Step 2: Build context from search results ---
    const webContext = searchResults
      .map(
        (r, i) =>
          `[Web Source ${i + 1}] ${r.title}\nURL: ${r.url}\n${r.content}\n`
      )
      .join('\n');

    // --- Step 3: Generate with Gemini, citing web sources ---
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt =
      "You are OpsMind AI, an enterprise knowledge assistant. " +
      "The user's question could not be answered from internal documents, so a live web search was performed. " +
      "Answer the question using ONLY the provided web search results. " +
      "IMPORTANT: Clearly indicate that this answer comes from a web search, not from the organization's internal documents. " +
      "Start your response with: '🌐 **Web Search Result:**\\n\\n' to make it obvious. " +
      "Cite your web sources using this exact markdown link format: [Source Title](URL). " +
      "If the web results don't adequately answer the question, say so honestly. " +
      "Keep your response concise, accurate, and professional.";

    const result = await model.generateContentStream(
      `${systemPrompt}\n\nWeb Search Results:\n${webContext}\n\nQuestion: ${query}`
    );

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      tokenCount += chunkText.split(/\s+/).filter(Boolean).length;
      res.write(
        `data: ${JSON.stringify({ type: 'token', content: chunkText })}\n\n`
      );
    }

    const responseTimeMs = Date.now() - startTime;

    // --- Step 4: Emit sources (web search results) ---
    res.write(
      `data: ${JSON.stringify({
        type: 'sources',
        sources: searchResults.map((r) => ({
          filename: `🌐 ${r.title}`,
          pageNumber: 0,
          text: r.url,
          isWebSource: true,
        })),
      })}\n\n`
    );

    res.write(
      `data: ${JSON.stringify({
        type: 'metadata',
        tokenCount,
        responseTimeMs,
        isHallucination: false,
      })}\n\n`
    );

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);

    return { tokenCount, responseTimeMs, isHallucination: false };
  } catch (error) {
    res.write(
      `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`
    );
    return {
      tokenCount: 0,
      responseTimeMs: Date.now() - startTime,
      isHallucination: false,
    };
  }
};
