import { ValidModel, getDefaultModel, getModelConfig } from '@/constants/valid_modals'

export const useChromeStorage = () => {
  const setKeyModel = async (apiKey: string, model: ValidModel): Promise<void> => {
    try {
      await chrome.storage.sync.set({
        [model]: {
          apiKey,
          model,
        },
      })
    } catch (error) {
      console.error('Error setting key model:', error);
      throw new Error('Failed to save configuration');
    }
  }

  const getKeyModel = async (model: ValidModel) => {
    try {
      const result = await chrome.storage.sync.get(model)
      return result[model] || { apiKey: null, model: null }
    } catch (error) {
      console.error('Error getting key model:', error);
      return { apiKey: null, model: null }
    }
  }

  const setSelectModel = async (model: ValidModel): Promise<void> => {
    try {
      await chrome.storage.sync.set({
        selectedModel: model,
      })
    } catch (error) {
      console.error('Error setting selected model:', error);
      throw new Error('Failed to save selected model');
    }
  }

  const selectModel = async (): Promise<ValidModel | undefined> => {
    try {
      const result = await chrome.storage.sync.get('selectedModel')
      return result.selectedModel
    } catch (error) {
      console.error('Error getting selected model:', error);
      return undefined;
    }
  }

  const validateConfiguration = async (): Promise<boolean> => {
    try {
      const selectedModel = await selectModel()
      if (!selectedModel) return false
      
      const { apiKey } = await getKeyModel(selectedModel)
      return !!apiKey
    } catch (error) {
      console.error('Error validating configuration:', error);
      return false;
    }
  }

  return {
    setKeyModel,
    getKeyModel,
    setSelectModel,
    selectModel,
    validateConfiguration,
  }
}
