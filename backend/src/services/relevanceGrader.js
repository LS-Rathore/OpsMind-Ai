import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Grades a batch of retrieved chunks for relevance against the user's query.
 * Uses a single lightweight Gemini call that evaluates ALL chunks at once
 * (not one call per chunk) to keep latency low.
 *
 * Returns an array of booleans parallel to the input chunks array,
 * where true = relevant, false = not relevant.
 *
 * On failure, defaults to marking all chunks as relevant (fail-open)
 * so existing behaviour is preserved.
 */
export const gradeChunks = async (query, chunks) => {
  if (!chunks || chunks.length === 0) return [];

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const chunkSummaries = chunks.map((c, i) => (
      `[Chunk ${i}] (${c.filename}, Page ${c.pageNumber}): ${c.text.replace(/\s+/g, ' ').trim().slice(0, 300)}`
    )).join('\n\n');

    const gradingPrompt = `You are a relevance grader for an enterprise RAG system.
Given the user's query and ${chunks.length} retrieved document chunks, determine whether EACH chunk contains information that is relevant and useful for answering the query.

A chunk is "relevant" if it contains facts, procedures, policies, or context that directly helps answer the query. A chunk is "not relevant" if it is off-topic, unrelated, or only tangentially connected.

User query: "${query}"

Retrieved chunks:
${chunkSummaries}

Respond with ONLY valid JSON — an array of objects, one per chunk, in order:
[{"index": 0, "relevant": true}, {"index": 1, "relevant": false}, ...]

JSON response:`;

    const result = await model.generateContent(gradingPrompt);
    const responseText = result.response.text().trim();

    // Extract JSON array from the response — handle potential markdown code fences
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('[RelevanceGrader] Could not parse JSON array, marking all as relevant. Raw:', responseText);
      return chunks.map(() => true);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Build a boolean array parallel to the input chunks
    const grades = chunks.map((_, i) => {
      const grade = parsed.find(g => g.index === i);
      // If a grade entry is missing for a chunk, default to relevant (fail-open)
      return grade ? grade.relevant === true : true;
    });

    const relevantCount = grades.filter(Boolean).length;
    console.log(`[RelevanceGrader] ${relevantCount}/${chunks.length} chunks graded relevant for query: "${query}"`);

    return grades;
  } catch (error) {
    console.error('[RelevanceGrader] Grading failed, marking all as relevant. Error:', error.message);
    return chunks.map(() => true);
  }
};

/**
 * Rewrites the user's query for better retrieval results.
 * Used when the first retrieval attempt returns no relevant chunks.
 *
 * Returns the rewritten query string, or the original query on failure.
 */
export const rewriteQuery = async (originalQuery) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const rewritePrompt = `You are a query rewriting assistant for an enterprise knowledge search system.
The user's original query did not retrieve relevant results from the document database.
Rewrite the query to be more specific, use alternative keywords, or rephrase it to improve retrieval.

Original query: "${originalQuery}"

Respond with ONLY valid JSON in this exact format, no extra text:
{"rewritten_query": "your improved query here"}`;

    const result = await model.generateContent(rewritePrompt);
    const responseText = result.response.text().trim();

    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      console.warn('[QueryRewriter] Could not parse JSON, using original query. Raw:', responseText);
      return originalQuery;
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const rewritten = parsed.rewritten_query || originalQuery;

    console.log(`[QueryRewriter] Original: "${originalQuery}" → Rewritten: "${rewritten}"`);
    return rewritten;
  } catch (error) {
    console.error('[QueryRewriter] Rewrite failed, using original query. Error:', error.message);
    return originalQuery;
  }
};

/**
 * Full relevance-grading pipeline:
 *   1. Grade retrieved chunks for relevance
 *   2. If relevant chunks found → return them
 *   3. If none relevant → rewrite query, re-retrieve, re-grade
 *   4. If still none → return { chunks: [], noRelevantContent: true }
 *
 * @param {string} query - The user's original query
 * @param {Array} chunks - Initially retrieved chunks
 * @param {Function} retrieveFn - The retrieval function to call on retry: (query, topK, userId) => chunks
 * @param {number} topK - Number of chunks to retrieve
 * @param {string} userId - The user's ID for visibility filtering
 * @returns {{ chunks: Array, noRelevantContent: boolean, rewrittenQuery: string|null }}
 */
export const gradeAndFilterChunks = async (query, chunks, retrieveFn, topK, userId) => {
  // --- First pass: grade the initially retrieved chunks ---
  const grades = await gradeChunks(query, chunks);
  const relevantChunks = chunks.filter((_, i) => grades[i]);

  if (relevantChunks.length > 0) {
    console.log(`[RelevanceGrader] First pass: ${relevantChunks.length} relevant chunks — proceeding to generation`);
    return { chunks: relevantChunks, noRelevantContent: false, rewrittenQuery: null };
  }

  // --- No relevant chunks: attempt query rewrite + one retry ---
  console.log('[RelevanceGrader] First pass: 0 relevant chunks — attempting query rewrite...');
  const rewrittenQuery = await rewriteQuery(query);

  // Re-retrieve with the rewritten query
  const retryChunks = await retrieveFn(rewrittenQuery, topK, userId);
  const retryGrades = await gradeChunks(rewrittenQuery, retryChunks);
  const retryRelevantChunks = retryChunks.filter((_, i) => retryGrades[i]);

  if (retryRelevantChunks.length > 0) {
    console.log(`[RelevanceGrader] Retry pass: ${retryRelevantChunks.length} relevant chunks after rewrite — proceeding`);
    return { chunks: retryRelevantChunks, noRelevantContent: false, rewrittenQuery };
  }

  // --- Still nothing relevant after retry ---
  console.log('[RelevanceGrader] Retry pass: still 0 relevant chunks — will inform user');
  return { chunks: [], noRelevantContent: true, rewrittenQuery };
};
