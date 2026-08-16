import { GoogleGenerativeAI } from '@google/generative-ai';

const HALLUCINATION_PHRASE = "I couldn't find a direct answer to your question in the uploaded SOPs. Could you please rephrase your question, or ensure the relevant document has been uploaded?";

export const streamChatResponse = async (query, chunks, res) => {
  const startTime = Date.now();
  let tokenCount = 0;
  let fullText = '';

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const context = chunks
      .map((c) => `Source: [${c.filename}] | Page ${c.pageNumber}\n${c.text}\n`)
      .join('\n');

    const systemPrompt =
      "You are OpsMind AI, an enterprise knowledge assistant. Answer questions ONLY using the provided SOP context. Always cite your sources precisely using this exact markdown link format: `[filename, Page N](cite:filename:N)`. Example: `[Employee_Handbook.pdf, Page 3](cite:Employee_Handbook.pdf:3)`. If the answer is not in the context, respond with exactly: 'I couldn't find a direct answer to your question in the uploaded SOPs. Could you please rephrase your question, or ensure the relevant document has been uploaded?' Never fabricate or infer beyond the provided context.";

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContentStream(
      `${systemPrompt}\n\nContext:\n${context}\n\nQuestion: ${query}`
    );

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      tokenCount += chunkText.split(/\s+/).filter(Boolean).length;
      res.write(`data: ${JSON.stringify({ type: 'token', content: chunkText })}\n\n`);
    }

    const responseTimeMs = Date.now() - startTime;
    const isHallucination = fullText.trim().includes(HALLUCINATION_PHRASE);

    res.write(
      `data: ${JSON.stringify({
        type: 'sources',
        sources: isHallucination ? [] : chunks.map((c) => ({
          filename: c.filename,
          pageNumber: c.pageNumber,
          text: c.text.replace(/\s+/g, ' ').trim().slice(0, 150),
        })),
      })}\n\n`
    );

    res.write(
      `data: ${JSON.stringify({
        type: 'metadata',
        tokenCount,
        responseTimeMs,
        isHallucination,
      })}\n\n`
    );

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);

    return { tokenCount, responseTimeMs, isHallucination };
  } catch (error) {
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    return { tokenCount: 0, responseTimeMs: Date.now() - startTime, isHallucination: false };
  }
};

/**
 * Streams a response for "general" queries (greetings, meta-questions, etc.)
 * that don't require document retrieval.
 * Uses the same SSE event protocol as streamChatResponse so the frontend
 * handles both paths identically.
 */
export const streamGeneralResponse = async (query, res) => {
  const startTime = Date.now();
  let tokenCount = 0;
  let fullText = '';

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt =
      "You are OpsMind AI, a friendly and helpful enterprise knowledge assistant. " +
      "The user's message is conversational or a general question that does not require " +
      "looking up any uploaded documents. Respond naturally and helpfully. " +
      "If the user greets you, greet them back warmly and briefly explain what you can do " +
      "(help them search and understand their organization's SOPs and documents). " +
      "Keep responses concise and professional.";

    const result = await model.generateContentStream(
      `${systemPrompt}\n\nUser: ${query}`
    );

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      tokenCount += chunkText.split(/\s+/).filter(Boolean).length;
      res.write(`data: ${JSON.stringify({ type: 'token', content: chunkText })}\n\n`);
    }

    const responseTimeMs = Date.now() - startTime;

    // No sources for general queries
    res.write(`data: ${JSON.stringify({ type: 'sources', sources: [] })}\n\n`);

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
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    return { tokenCount: 0, responseTimeMs: Date.now() - startTime, isHallucination: false };
  }
};

/**
 * Streams a response when the relevance grader determines that no indexed
 * documents contain relevant information for the user's query.
 * Prevents hallucination by NOT passing irrelevant chunks to the model.
 * Uses the same SSE event protocol as the other response functions.
 */
export const streamNoRelevantContentResponse = async (query, res) => {
  const startTime = Date.now();
  let tokenCount = 0;
  let fullText = '';

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const systemPrompt =
      "You are OpsMind AI, an enterprise knowledge assistant. " +
      "The user asked a question that requires information from their organization's uploaded documents, " +
      "but after searching, none of the indexed documents contain relevant information for this query. " +
      "Politely inform the user that you could not find relevant information in their uploaded documents. " +
      "Suggest they check if the relevant document has been uploaded, or try rephrasing their question. " +
      "Do NOT make up an answer. Do NOT use any external knowledge to answer the question. " +
      "Keep your response concise, helpful, and professional.";

    const result = await model.generateContentStream(
      `${systemPrompt}\n\nUser's question: ${query}`
    );

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      tokenCount += chunkText.split(/\s+/).filter(Boolean).length;
      res.write(`data: ${JSON.stringify({ type: 'token', content: chunkText })}\n\n`);
    }

    const responseTimeMs = Date.now() - startTime;

    // No sources — nothing was relevant
    res.write(`data: ${JSON.stringify({ type: 'sources', sources: [] })}\n\n`);

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
    res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
    return { tokenCount: 0, responseTimeMs: Date.now() - startTime, isHallucination: false };
  }
};