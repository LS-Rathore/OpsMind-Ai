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
      "You are OpsMind AI, an enterprise knowledge assistant. Answer questions ONLY using the provided SOP context. Always cite sources as: 'According to [filename], Page [pageNumber]'. If the answer is not in the context, respond with exactly: 'I couldn't find a direct answer to your question in the uploaded SOPs. Could you please rephrase your question, or ensure the relevant document has been uploaded?' Never fabricate or infer beyond the provided context.";

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
          text: c.text.slice(0, 150),
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