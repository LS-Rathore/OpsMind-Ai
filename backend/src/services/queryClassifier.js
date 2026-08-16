import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Classifies a user query into one of three routes:
 *   - "index"   → requires vector retrieval from indexed documents
 *   - "general" → conversational / meta / general-knowledge (skip retrieval)
 *   - "search"  → requires live web search (current events, external facts, etc.)
 *
 * Uses a single lightweight Gemini call with a structured prompt.
 * On any failure, defaults to "index" to preserve existing behaviour.
 */
export const classifyQuery = async (query) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const classificationPrompt = `You are a query router for an enterprise knowledge assistant called OpsMind AI.
Your job is to classify the user's query into exactly one of three categories:

1. "index" — The query asks about information that would be found in the organization's uploaded documents (SOPs, policies, procedures, manuals, reports, etc.). This includes any question about company processes, rules, guidelines, technical documentation, or anything that requires looking up specific organizational knowledge.

2. "general" — The query is conversational, a greeting, a meta-question about the assistant itself, or something answerable from common sense without needing to look up any documents or search the web. Examples: "hello", "hi", "what can you do?", "who are you?", "thanks", "how are you?", "tell me a joke".

3. "search" — The query asks about current events, recent news, real-time information, external facts, public knowledge that is NOT likely in internal company documents, or anything that would benefit from a live web search. Examples: "what is the latest news about AI?", "what's the current stock price of Google?", "who won the World Cup?", "what is Kubernetes?", "latest cybersecurity vulnerabilities".

Respond with ONLY valid JSON in this exact format, no extra text:
{"route": "index"}
or
{"route": "general"}
or
{"route": "search"}

User query: "${query}"`;

    const result = await model.generateContent(classificationPrompt);
    const responseText = result.response.text().trim();

    // Extract JSON from the response — handle potential markdown code fences
    const jsonMatch = responseText.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      console.warn('[QueryClassifier] Could not parse JSON from response, defaulting to "index". Raw:', responseText);
      return 'index';
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validRoutes = ['index', 'general', 'search'];

    if (validRoutes.includes(parsed.route)) {
      return parsed.route;
    }

    console.warn('[QueryClassifier] Unexpected route value, defaulting to "index". Parsed:', parsed);
    return 'index';
  } catch (error) {
    console.error('[QueryClassifier] Classification failed, defaulting to "index". Error:', error.message);
    return 'index';
  }
};
