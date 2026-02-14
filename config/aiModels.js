/**
 * AI Models Configuration for OpenRouter
 * Organized by company with pricing and capabilities info
 * Updated as of August 2025
 */

export const AI_MODELS = {
  // OpenAI Models
  OPENAI: {
    // GPT-4 Family
    GPT5: 'openai/gpt-5',
    GPT5_MINI: 'openai/gpt-5-mini',
    GPT4O: 'openai/gpt-4o',
    GPT4O_MINI: 'openai/gpt-4o-mini',
    GPT4_TURBO: 'openai/gpt-4-turbo',
    GPT4_TURBO_PREVIEW: 'openai/gpt-4-turbo-preview',
    GPT4_VISION: 'openai/gpt-4-vision-preview',
    GPT4: 'openai/gpt-4',
    GPT4_32K: 'openai/gpt-4-32k',
    
    // GPT-3.5 Family
    GPT35_TURBO: 'openai/gpt-3.5-turbo',
    GPT35_TURBO_16K: 'openai/gpt-3.5-turbo-16k',
    GPT35_TURBO_INSTRUCT: 'openai/gpt-3.5-turbo-instruct',
  },

  // Anthropic Models
  ANTHROPIC: {
    // Claude 3.5 Family
    CLAUDE_35_SONNET: 'anthropic/claude-3.5-sonnet',
    CLAUDE_35_SONNET_BETA: 'anthropic/claude-3.5-sonnet:beta',
    CLAUDE_35_HAIKU: 'anthropic/claude-3.5-haiku',
    
    // Claude 3 Family
    CLAUDE_3_OPUS: 'anthropic/claude-3-opus',
    CLAUDE_3_SONNET: 'anthropic/claude-3-sonnet',
    CLAUDE_3_HAIKU: 'anthropic/claude-3-haiku',
    
    // Claude 2 Family
    CLAUDE_2_1: 'anthropic/claude-2.1',
    CLAUDE_2: 'anthropic/claude-2',
    CLAUDE_INSTANT: 'anthropic/claude-instant-1.2',
  },

  // Google Models
  GOOGLE: {
    // Gemini Pro Family
    GEMINI_PRO: 'google/gemini-pro',
    GEMINI_PRO_VISION: 'google/gemini-pro-vision',
    GEMINI_PRO_15: 'google/gemini-pro-1.5',
    GEMINI_FLASH: 'google/gemini-flash-1.5',
    
    // PaLM Family
    PALM_2: 'google/palm-2-chat-bison',
    PALM_2_32K: 'google/palm-2-chat-bison-32k',
  },

  // Meta Models
  META: {
    // Llama 3.1 Family
    LLAMA_31_405B: 'meta-llama/llama-3.1-405b-instruct',
    LLAMA_31_70B: 'meta-llama/llama-3.1-70b-instruct',
    LLAMA_31_8B: 'meta-llama/llama-3.1-8b-instruct',
    
    // Llama 3 Family
    LLAMA_3_70B: 'meta-llama/llama-3-70b-instruct',
    LLAMA_3_8B: 'meta-llama/llama-3-8b-instruct',
    
    // Llama 2 Family
    LLAMA_2_70B: 'meta-llama/llama-2-70b-chat',
    LLAMA_2_13B: 'meta-llama/llama-2-13b-chat',
    LLAMA_2_7B: 'meta-llama/llama-2-7b-chat',
  },

  // DeepSeek Models
  DEEPSEEK: {
    DEEPSEEK_CHAT: 'deepseek/deepseek-chat',
    DEEPSEEK_CODER: 'deepseek/deepseek-coder',
    DEEPSEEK_R1_0528: 'deepseek/deepseek-r1-0528',
    DEEPSEEK_V3: 'deepseek/deepseek-v3',
  },

  // Qwen Models
  QWEN: {
    // Qwen 3 Family
    QWEN3_235B:"qwen/qwen3-235b-a22b-2507",
    QWEN3_30B: 'qwen/qwen3-30b-a3b-instruct-2507',
    QWEN2_72B: 'qwen/qwen-2-72b-instruct',
    QWEN2_7B: 'qwen/qwen-2-7b-instruct',
    QWEN15_110B: 'qwen/qwen-1.5-110b-chat',
    QWEN15_72B: 'qwen/qwen-1.5-72b-chat',
    QWEN15_32B: 'qwen/qwen-1.5-32b-chat',
    QWEN15_14B: 'qwen/qwen-1.5-14b-chat',
    QWEN15_7B: 'qwen/qwen-1.5-7b-chat',
  },

  // Microsoft Models
  MICROSOFT: {
    WIZARDLM_2_8X22B: 'microsoft/wizardlm-2-8x22b',
    WIZARDLM_2_7B: 'microsoft/wizardlm-2-7b',
  },

  // Mistral Models
  MISTRAL: {
    MISTRAL_LARGE: 'mistralai/mistral-large',
    MISTRAL_MEDIUM: 'mistralai/mistral-medium',
    MISTRAL_SMALL: 'mistralai/mistral-small',
    MISTRAL_7B: 'mistralai/mistral-7b-instruct',
    MIXTRAL_8X7B: 'mistralai/mixtral-8x7b-instruct',
    MIXTRAL_8X22B: 'mistralai/mixtral-8x22b-instruct',
  },

  // Cohere Models
  COHERE: {
    COMMAND_R_PLUS: 'cohere/command-r-plus',
    COMMAND_R: 'cohere/command-r',
    COMMAND: 'cohere/command',
    COMMAND_LIGHT: 'cohere/command-light',
  },

  // Other Notable Models
  OTHER: {
    // Perplexity
    PERPLEXITY_LLAMA_70B: 'perplexity/llama-3.1-sonar-large-128k-online',
    PERPLEXITY_LLAMA_8B: 'perplexity/llama-3.1-sonar-small-128k-online',
    
    // Nous Research
    NOUS_HERMES_405B: 'nousresearch/nous-hermes-2-mixtral-8x7b-dpo',
    NOUS_HERMES_70B: 'nousresearch/nous-hermes-llama2-70b',
    
    // 01-ai
    YI_LARGE: '01-ai/yi-large',
    YI_34B: '01-ai/yi-34b-chat',
    
    // Databricks
    DBRX_INSTRUCT: 'databricks/dbrx-instruct',
    
    // Hugging Face
    ZEPHYR_7B: 'huggingfaceh4/zephyr-7b-beta',
  }
};

// Model Categories by Use Case
export const MODEL_CATEGORIES = {
  // Best for Writing & Analysis
  WRITING_EXPERTS: [
    AI_MODELS.ANTHROPIC.CLAUDE_35_SONNET,
    AI_MODELS.OPENAI.GPT4O,
    AI_MODELS.OPENAI.GPT4_TURBO,
    AI_MODELS.ANTHROPIC.CLAUDE_3_OPUS,
  ],

  // Cost-Effective Options
  BUDGET_FRIENDLY: [
    AI_MODELS.OPENAI.GPT35_TURBO,
    AI_MODELS.ANTHROPIC.CLAUDE_3_HAIKU,
    AI_MODELS.GOOGLE.GEMINI_FLASH,
    AI_MODELS.META.LLAMA_31_8B,
  ],

  // High Performance
  FLAGSHIP_MODELS: [
    AI_MODELS.OPENAI.GPT4O,
    AI_MODELS.ANTHROPIC.CLAUDE_35_SONNET,
    AI_MODELS.META.LLAMA_31_405B,
    AI_MODELS.QWEN.QWEN2_72B,
  ],

  // Fast Response
  SPEED_OPTIMIZED: [
    AI_MODELS.OPENAI.GPT4O_MINI,
    AI_MODELS.ANTHROPIC.CLAUDE_35_HAIKU,
    AI_MODELS.GOOGLE.GEMINI_FLASH,
    AI_MODELS.META.LLAMA_31_8B,
  ],

  // Large Context Window
  LONG_CONTEXT: [
    AI_MODELS.ANTHROPIC.CLAUDE_35_SONNET, // 200k tokens
    AI_MODELS.GOOGLE.GEMINI_PRO_15,       // 2M tokens
    AI_MODELS.OPENAI.GPT4_TURBO,          // 128k tokens
  ],
};

// Recommended models for writing evaluation
export const RECOMMENDED_FOR_WRITING = {
  // Best Overall (Premium)
  PREMIUM: AI_MODELS.ANTHROPIC.CLAUDE_35_SONNET,
  
  // Best OpenAI
  OPENAI_BEST: AI_MODELS.OPENAI.GPT4O,
  
  // Best Value
  VALUE: AI_MODELS.ANTHROPIC.CLAUDE_3_HAIKU,
  
  // Best Open Source
  OPEN_SOURCE: AI_MODELS.META.LLAMA_31_70B,
  
  // Best Chinese Language Support
  MULTILINGUAL: AI_MODELS.QWEN.QWEN2_72B,
};

// Default model (currently set to Claude 3.5 Sonnet - excellent for writing)
export const DEFAULT_MODEL = RECOMMENDED_FOR_WRITING.MULTILINGUAL;

// Helper function to get all models as flat list
export const getAllModels = () => {
  const allModels = {};
  Object.entries(AI_MODELS).forEach(([company, models]) => {
    Object.entries(models).forEach(([name, id]) => {
      allModels[`${company}_${name}`] = id;
    });
  });
  return allModels;
};

// Helper function to get models by company
export const getModelsByCompany = (company) => {
  return AI_MODELS[company.toUpperCase()] || {};
};

// Helper function to get model info
export const getModelInfo = (modelId) => {
  for (const [company, models] of Object.entries(AI_MODELS)) {
    for (const [name, id] of Object.entries(models)) {
      if (id === modelId) {
        return { company, name, id };
      }
    }
  }
  return null;
};