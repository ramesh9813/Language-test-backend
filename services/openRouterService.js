import { createEvaluationPrompt, getFallbackEvaluation } from '../utils/promptTemplates.js';
import {
  AI_MODELS,
  RECOMMENDED_FOR_WRITING,
  MODEL_CATEGORIES,
  getModelInfo
} from '../config/aiModels.js';

// Check if API key is provided
if (!process.env.OPENROUTER_API_KEY) {
  console.error('OPENROUTER_API_KEY is not set in environment variables');
  process.exit(1);
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const parsePositiveInt = (value, fallback) => {
  const parsed = parseInt(value, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return fallback;
};

// Fast defaults; all can be overridden in .env
const REQUEST_TIMEOUT_MS = parsePositiveInt(process.env.OPENROUTER_TIMEOUT_MS, 20000);
const MAX_RETRIES = parsePositiveInt(process.env.OPENROUTER_MAX_RETRIES, 1);
const MAX_TOKENS = parsePositiveInt(process.env.OPENROUTER_MAX_TOKENS, 1400);
const RETRY_DELAY_MS = parsePositiveInt(process.env.OPENROUTER_RETRY_DELAY_MS, 600);
const USE_JSON_MODE = (process.env.OPENROUTER_JSON_MODE || 'false').toLowerCase() === 'true';

const isRetryableStatus = (message = '') => {
  return ['429', '502', '503', '504'].some((code) => message.includes(code));
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Current model to use - you can easily change this with OPENROUTER_MODEL
let CURRENT_MODEL = process.env.OPENROUTER_MODEL || AI_MODELS.OPENAI.GPT4O_MINI;
const modelInfo = getModelInfo(CURRENT_MODEL);
console.log(
  `Using default model: ${modelInfo ? `${modelInfo.name} (${CURRENT_MODEL})` : CURRENT_MODEL}`
);

export const getWritingEvaluation = async (message) => {
  const evaluationPrompt = createEvaluationPrompt(message);
  let result;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    const requestStartedAt = Date.now();

    try {
      const requestBody = {
        model: CURRENT_MODEL,
        messages: [
          {
            role: 'user',
            content: evaluationPrompt
          }
        ],
        temperature: 0.1,
        max_tokens: MAX_TOKENS,
        ...(USE_JSON_MODE && CURRENT_MODEL.startsWith('openai/')
          ? { response_format: { type: 'json_object' } }
          : {})
      };

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.SITE_NAME || 'Writing Evaluator',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      result = await response.json();
      const duration = Date.now() - requestStartedAt;
      console.log(`OpenRouter response received in ${duration}ms with model ${CURRENT_MODEL}`);
      break;
    } catch (apiError) {
      if (apiError.name === 'AbortError') {
        const error = new Error(`OpenRouter request timed out after ${REQUEST_TIMEOUT_MS}ms`);
        error.type = 'API_TIMEOUT';
        throw error;
      }

      const isLastAttempt = attempt >= MAX_RETRIES;
      console.log(
        `OpenRouter API error (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`,
        apiError.message
      );

      if (apiError.message?.includes('401') || apiError.message?.includes('Invalid API key')) {
        const error = new Error('Invalid OpenRouter API key');
        error.type = 'API_KEY_ERROR';
        throw error;
      }

      if (apiError.message?.includes('429') && isLastAttempt) {
        const error = new Error('API rate limit exceeded');
        error.type = 'QUOTA_EXCEEDED';
        throw error;
      }

      if (isRetryableStatus(apiError.message) && !isLastAttempt) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }

      if (isLastAttempt) {
        throw apiError;
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // If we exhausted retries due to temporary provider issues, return fallback
  if (!result) {
    const error = new Error('API temporarily unavailable after retries');
    error.type = 'API_OVERLOADED';
    error.fallbackData = getFallbackEvaluation();
    throw error;
  }

  // Extract the AI response
  const aiResponse = result.choices?.[0]?.message?.content;

  if (!aiResponse) {
    console.error('No content in OpenRouter response:', result);
    const error = new Error('No content received from OpenRouter API');
    error.type = 'API_ERROR';
    throw error;
  }

  // Try to parse the response as JSON
  try {
    const evaluationResult = JSON.parse(aiResponse.trim());
    return {
      success: true,
      data: evaluationResult,
      model: CURRENT_MODEL
    };
  } catch (parseError) {
    console.error('Failed to parse JSON response:', parseError);
    return {
      success: false,
      rawResponse: aiResponse,
      model: CURRENT_MODEL
    };
  }
};

// Utility functions for model management
export const setModel = (modelId) => {
  const info = getModelInfo(modelId);
  if (info) {
    CURRENT_MODEL = modelId;
    console.log(`Model changed to: ${info.company} ${info.name} (${CURRENT_MODEL})`);
    return true;
  }

  console.error(`Invalid model ID: ${modelId}`);
  return false;
};

// Set model by company and name
export const setModelByCompany = (company, modelName) => {
  const models = AI_MODELS[company.toUpperCase()];
  if (models && models[modelName.toUpperCase()]) {
    CURRENT_MODEL = models[modelName.toUpperCase()];
    console.log(`Model changed to: ${company} ${modelName} (${CURRENT_MODEL})`);
    return true;
  }

  console.error(`Invalid model: ${company}/${modelName}`);
  return false;
};

// Quick preset functions
export const useRecommendedModel = (preset) => {
  if (RECOMMENDED_FOR_WRITING[preset.toUpperCase()]) {
    CURRENT_MODEL = RECOMMENDED_FOR_WRITING[preset.toUpperCase()];
    const info = getModelInfo(CURRENT_MODEL);
    console.log(`Using ${preset} model: ${info?.company} ${info?.name}`);
    return true;
  }
  return false;
};

// Get current model info
export const getCurrentModel = () => {
  const info = getModelInfo(CURRENT_MODEL);
  return {
    current: CURRENT_MODEL,
    info,
    recommended: RECOMMENDED_FOR_WRITING,
    categories: MODEL_CATEGORIES
  };
};

// Get available models
export const getAvailableModels = () => {
  return {
    byCompany: AI_MODELS,
    recommended: RECOMMENDED_FOR_WRITING,
    categories: MODEL_CATEGORIES
  };
};
