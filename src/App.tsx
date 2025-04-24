import React, { useState, useEffect } from 'react'

import leetCode from '@/assets/leetcode.png'

import { Button } from '@/components/ui/button'
import Show from '@/components/Show'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { VALID_MODELS, type ValidModel } from './constants/valid_modals'
import { HideApiKey } from '@/components/ui/input'
import { useChromeStorage } from './hooks/useChromeStorage'

const Popup: React.FC = () => {
  const [apikey, setApikey] = React.useState<string>('')
  const [model, setModel] = React.useState<ValidModel | null>(null)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)
  const [isloading, setIsloading] = useState<boolean>(false)
  const [submitMessage, setSubmitMessage] = useState<{
    state: 'error' | 'success'
    message: string
  } | null>(null)

  const selectedModelConfig = VALID_MODELS.find(m => m.name === model)

  const updatestorage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsloading(true)
      const { setKeyModel } = useChromeStorage()
      
      if (!model) {
        throw new Error('Please select a model')
      }

      if (!apikey) {
        throw new Error('Please enter an API key')
      }

      await setKeyModel(apikey, model)

      setSubmitMessage({
        state: 'success',
        message: 'Configuration saved successfully',
      })

      // Validate the entire configuration
      const { validateConfiguration } = useChromeStorage()
      await validateConfiguration()

    } catch (error: any) {
      setSubmitMessage({
        state: 'error',
        message: error.message || 'Failed to save configuration',
      })
    } finally {
      setIsloading(false)
    }
  }

  useEffect(() => {
    const loadChromeStorage = async () => {
      try {
        const { initializeStorage, getKeyModel } = useChromeStorage()
        const { selectedModel } = await initializeStorage()
        
        setModel(selectedModel)
        const keyData = await getKeyModel(selectedModel)
        setApikey(keyData.apiKey || '')
        
        setIsLoaded(true)
      } catch (error) {
        console.error('Failed to load configuration:', error)
        setIsLoaded(true)
      }
    }

    loadChromeStorage()
  }, [])

  const handleModelChange = async (newModel: ValidModel) => {
    try {
      const { setSelectModel, getKeyModel } = useChromeStorage()
      await setSelectModel(newModel)
      setModel(newModel)
      
      const keyData = await getKeyModel(newModel)
      setApikey(keyData.apiKey || '')
    } catch (error) {
      console.error('Failed to change model:', error)
    }
  }

  return (
    <div className="relative p-4 w-[350px] bg-background">
      <Show show={isLoaded}>
        <div className="">
          <div className="w-full h-20 overflow-hidden">
            <img
              className="mx-auto h-20 w-auto"
              src={leetCode}
              width={150}
              height={150}
              alt="LeetCode Whisper Logo"
            />
          </div>
          <div className="text-center">
            <h1 className="font-bold text-3xl text-white">
              CodeSmart <span className="text-whisperOrange">Bot</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your AI Companion for LeetCode!
            </p>
          </div>
          <form
            onSubmit={updatestorage}
            className="mt-10 flex flex-col gap-2 w-full"
          >
            <div className="space-y-2">
              <label htmlFor="model" className="text-xs text-muted-foreground">
                Select AI Model
              </label>
              <Select
                value={model || undefined}
                onValueChange={(v: ValidModel) => handleModelChange(v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Models</SelectLabel>
                    <SelectSeparator />
                    {VALID_MODELS.map((modelOption) => (
                      <SelectItem
                        key={modelOption.name}
                        value={modelOption.name}
                      >
                        {modelOption.display}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="apikey" className="text-xs text-muted-foreground">
                API Key {selectedModelConfig ? `for ${selectedModelConfig.display}` : ''}
              </label>
              <HideApiKey
                id="apikey"
                value={apikey}
                onChange={(e) => setApikey(e.target.value)}
                placeholder={selectedModelConfig?.placeholder || 'Select a model first'}
                disabled={!model}
                required
              />
              {selectedModelConfig && (
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedModelConfig.placeholder}
                </p>
              )}
            </div>
            <Button
              disabled={isloading || !model}
              type="submit"
              className="w-full mt-2"
            >
              {isloading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </form>
          {submitMessage && (
            <div
              className={`mt-2 text-center text-sm p-2 rounded-sm ${
                submitMessage.state === 'error'
                  ? 'text-red-500 border border-red-500 bg-red-50'
                  : 'text-green-500 border border-green-500 bg-green-50'
              }`}
            >
              {submitMessage.message}
            </div>
          )}
          <div className="mt-7 flex items-center justify-center">
            <p className="text-sm">
              Need help?&nbsp;
              <a
                href="https://github.com/piyushgarg-dev/leetcode-whisper-chrome-extension/issues/new"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report an issue
              </a>
            </p>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default Popup
