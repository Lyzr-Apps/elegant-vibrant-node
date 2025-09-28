import React, { useState } from 'react'
import parseLLMJson from './utils/jsonParser'

interface FortuneResponse {
  result: {
    fortune: string
    theme: 'red' | 'blue'
    metadata: {
      length: number
      timestamp: string
    }
  }
  confidence: number
  metadata: {
    processing_time: string
    model: string
  }
}

function App() {
  const [selectedPill, setSelectedPill] = useState<'red' | 'blue' | null>(null)
  const [fortune, setFortune] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [showFortune, setShowFortune] = useState(false)

  const generateRandomId = () => Math.random().toString(36).substring(7)

  const getFortune = async (pillColor: 'red' | 'blue') => {
    setIsLoading(true)
    setSelectedPill(pillColor)

    const userId = `${generateRandomId()}@test.com`
    const sessionId = `68d99393eee05a60c7647461-${generateRandomId()}`

    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-obhGvAo6gG9YT9tu6ChjyXLqnw7TxSGY'
        },
        body: JSON.stringify({
          user_id: userId,
          agent_id: '68d99393eee05a60c7647461',
          session_id: sessionId,
          message: `Generate a ${pillColor === 'red' ? 'truth/awakening' : 'comfort/bliss'} themed fortune, 2-3 sentences, 50-150 characters total.`
        })
      })

      const data = await response.text()
      const parsedResponse = parseLLMJson(data) as FortuneResponse

      if (parsedResponse?.result?.fortune) {
        setFortune(parsedResponse.result.fortune)
        setTimeout(() => {
          setShowFortune(true)
        }, 1000)
      }
    } catch (error) {
      console.error('Error getting fortune:', error)
      setFortune(pillColor === 'red'
        ? 'The truth illuminates your path forward.'
        : 'Comfort embraces you in this moment of peace.'
      )
      setTimeout(() => {
        setShowFortune(true)
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePillClick = (pillColor: 'red' | 'blue') => {
    if (!isLoading) {
      getFortune(pillColor)
    }
  }

  const handleTryAgain = () => {
    setShowFortune(false)
    setFortune('')
    setSelectedPill(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300/50 to-pink-500/50" />

      {!showFortune ? (
        <div className="relative z-10 flex flex-col items-center justify-center space-y-16">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-800 mb-4 font-sans">
              Choose Your Path
            </h1>
            <p className="text-gray-700 text-lg max-w-md">
              Red reveals truth, blue offers comfort. Which will you choose?
            </p>
          </div>

          <div className="flex items-center space-x-12">
            <button
              onClick={() => handlePillClick('red')}
              disabled={isLoading}
              className={`
                relative w-40 h-20 rounded-full bg-[#D7263D]
                transform transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-2xl hover:shadow-[#D7263D]/30
                active:scale-95 disabled:opacity-50
                ${selectedPill === 'red' && isLoading ? 'animate-pulse' : ''}
                before:content-[''] before:absolute before:inset-0 before:rounded-full
                before:bg-[#D7263D]/20 before:blur-xl
              `}
            >
              <span className="relative z-10 text-white text-lg font-medium">
                Red Pill
              </span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D7263D] to-[#FF3C38] opacity-80" />

              {selectedPill === 'red' && isLoading && (
                <div className="absolute inset-0 rounded-full border-2 border-[#D7263D] animate-ping" />
              )}
            </button>

            <button
              onClick={() => handlePillClick('blue')}
              disabled={isLoading}
              className={`
                relative w-40 h-20 rounded-full bg-[#2364AA]
                transform transition-all duration-300 ease-out
                hover:scale-105 hover:shadow-2xl hover:shadow-[#2364AA]/30
                active:scale-95 disabled:opacity-50
                ${selectedPill === 'blue' && isLoading ? 'animate-pulse' : ''}
                before:content-[''] before:absolute before:inset-0 before:rounded-full
                before:bg-[#2364AA]/20 before:blur-xl
              `}
            >
              <span className="relative z-10 text-white text-lg font-medium">
                Blue Pill
              </span>
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2364AA] to-[#00B7C2] opacity-80" />

              {selectedPill === 'blue' && isLoading && (
                <div className="absolute inset-0 rounded-full border-2 border-[#2364AA] animate-ping" />
              )}
            </button>
          </div>

          {isLoading && (
            <div className="text-gray-600 text-sm">
              The oracle contemplates your choice...
            </div>
          )}
        </div>
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
          <div
            className={`
              relative p-8 rounded-2xl max-w-md text-center
              ${selectedPill === 'red'
                ? 'bg-gradient-to-br from-[#0F1923] to-[#1A2634] border border-[#D7263D]/30'
                : 'bg-gradient-to-br from-[#0F1923] to-[#1A2634] border border-[#2364AA]/30'
              }
            `}
          >
            <div
              className={`
                absolute -inset-1 rounded-2xl opacity-50 blur-sm
                ${selectedPill === 'red'
                  ? 'bg-[#D7263D]/20 animate-pulse'
                  : 'bg-[#2364AA]/20 animate-pulse'
                }
              `}
            />

            <div className="relative z-10">
              <div className="mb-4">
                <span
                  className={`
                    text-2xl ${selectedPill === 'red' ? 'text-[#D7263D]' : 'text-[#2364AA]'}
                  `}
                >
                  {selectedPill === 'red' ? '🔴' : '🔵'}
                </span>
              </div>

              <p className="text-gray-800 text-lg leading-relaxed mb-6 font-sans">
                {fortune}
              </p>

              <button
                onClick={handleTryAgain}
                className={`
                  px-6 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 ease-out
                  ${selectedPill === 'red'
                    ? 'bg-[#D7263D]/20 text-[#D7263D] hover:bg-[#D7263D]/30'
                    : 'bg-[#2364AA]/20 text-[#2364AA] hover:bg-[#2364AA]/30'
                  }
                  hover:scale-105 active:scale-95
                `}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App