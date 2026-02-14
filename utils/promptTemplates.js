export const createEvaluationPrompt = (message) => {
  return `
Analyze the English text and return a writing evaluation.
Return ONLY valid JSON with this exact schema (no markdown, no extra text):

{
  "Grammatical": number,
  "ContextAwareness": number,
  "Coherence": number,
  "Cohesion": number,
  "Clarity": number,
  "Conciseness": number,
  "Style": number,
  "Tone": number,
  "Spelling": number,
  "Punctuation": number,
  "Vocabulary": number,
  "WordChoice": number,
  "Readability": number,
  "Flow": number,
  "Formatting": number,
  "Structure": number,
  "Consistency": number,
  "Accuracy": number,
  "Overall": number,
  "feedback": string,
  "strengths": [string, string],
  "improvements": [string, string],
  "improvedVersion": string,
  "rewrittenVersion": string
}

Rules:
- Every score must be between 0 and 9.
- feedback: max 2 short sentences.
- strengths and improvements: exactly 2 concise items each.
- improvedVersion: fix grammar/spelling only, preserve meaning and language.
- rewrittenVersion: better structure/style, preserve meaning and language.
- Keep improvedVersion and rewrittenVersion concise. Avoid long expansions.
- Output JSON only.

Text to analyze: "${message}"`;
};

export const getFallbackEvaluation = () => {
  return {
    "Grammatical": 7.7,
    "ContextAwareness": 7.2,
    "Coherence": 7.4,
    "Cohesion": 7.0,
    "Clarity": 7.9,
    "Conciseness": 7.6,
    "Style": 7.1,
    "Tone": 7.4,
    "Spelling": 8.1,
    "Punctuation": 7.9,
    "Vocabulary": 7.5,
    "WordChoice": 7.7,
    "Readability": 7.7,
    "Flow": 7.8,
    "Formatting": 7.3,
    "Structure": 7.6,
    "Consistency": 7.8,
    "Accuracy": 8.0,
    "Overall": 7.6,
    "feedback": "API temporarily unavailable - this is a sample evaluation",
    "strengths": [
      "Sample evaluation generated while the provider was overloaded",
      "Core writing dimensions are still scored for continuity"
    ],
    "improvements": [
      "Retry shortly for a full model-generated evaluation",
      "Use the latest run as the authoritative score"
    ],
    "improvedVersion": "Fallback response - original text unchanged",
    "rewrittenVersion": "Fallback response - original text unchanged"
  };
};
