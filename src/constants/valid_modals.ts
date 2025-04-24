/**
 * List of valid models that can be used in the application.
 */
export const VALID_MODELS = [
  {
    model: 'gpt-3.5-turbo',
    name: 'openai_3.5_turbo',
    display: 'GPT-3.5 Turbo',
    isDefault: true,
    apiKeyPattern: /^sk-[A-Za-z0-9]{32,}$/,
    placeholder: 'Enter OpenAI API Key (starts with sk-)'
  },
  {
    model: 'gpt-4',
    name: 'openai_4o',
    display: 'GPT-4 Optimized',
    isDefault: false,
    apiKeyPattern: /^sk-[A-Za-z0-9]{32,}$/,
    placeholder: 'Enter OpenAI API Key (starts with sk-)'
  },
  {
    model: 'gemini-1.5-pro-latest',
    name: 'gemini_1.5_pro',
    display: 'Gemini 1.5 Pro (Latest)',
    isDefault: false,
    apiKeyPattern: /^[A-Za-z0-9-_]{39}$/,
    placeholder: 'Enter Google API Key'
  },
]

/**
 * Type of valid models that can be used in the application.
 */
export type ValidModel = 'openai_3.5_turbo' | 'openai_4o' | 'gemini_1.5_pro'

/**
 * Get model configuration by name
 */
export const getModelConfig = (modelName: ValidModel) => {
  return VALID_MODELS.find(m => m.name === modelName)
}

/**
 * Get default model
 */
export const getDefaultModel = (): ValidModel => {
  const defaultModel = VALID_MODELS.find(m => m.isDefault)
  return defaultModel?.name as ValidModel
}
