"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { generateQuiz } from "@/utils/gemini"

interface Question {
  question: string
  options: string[]
  correctAnswer: string
}

export function QuizGenerator() {
  const [text, setText] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setQuestions([])
    setUserAnswers({})
    setShowResults(false)

    const result = await generateQuiz(text)

    if (result.error) {
      setError(result.error)
    } else {
      try {
        const parsedQuestions = JSON.parse(result.text)
        if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
          throw new Error("Invalid quiz format received")
        }
        setQuestions(parsedQuestions)
      } catch (e) {
        console.error("Error parsing quiz questions:", e)
        setError("Failed to parse quiz questions. Please try again.")
      }
    }

    setLoading(false)
  }

  function handleCheckAnswers() {
    setShowResults(true)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-nude-800">Enter your text:</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here to generate quiz questions..."
            className="min-h-[200px] bg-nude-100 border-nude-300 placeholder-nude-400 text-black"
            required
          />
        </div>
        <Button type="submit" disabled={loading || !text} className="bg-nude-600 hover:bg-nude-700 text-white">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Quiz
        </Button>
      </form>

      {error && (
        <Alert variant="destructive" className="bg-red-100 border-red-300 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="space-y-4 bg-nude-200 p-4 rounded-lg">
              <h3 className="font-medium text-nude-900">
                Question {index + 1}: {q.question}
              </h3>
              <RadioGroup
                value={userAnswers[index]}
                onValueChange={(value) => {
                  setUserAnswers((prev) => ({ ...prev, [index]: value }))
                }}
              >
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`q${index}-${optionIndex}`}
                      className="border-nude-400 text-nude-600"
                    />
                    <Label htmlFor={`q${index}-${optionIndex}`} className="text-nude-800">
                      {option}
                    </Label>
                    {showResults && (
                      <span
                        className={
                          option === q.correctAnswer
                            ? "text-green-600 ml-2"
                            : userAnswers[index] === option
                              ? "text-red-600 ml-2"
                              : ""
                        }
                      >
                        {option === q.correctAnswer && "✓"}
                        {userAnswers[index] === option && option !== q.correctAnswer && "✗"}
                      </span>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <Button
            onClick={handleCheckAnswers}
            disabled={Object.keys(userAnswers).length !== questions.length}
            className="bg-nude-600 hover:bg-nude-700 text-white"
          >
            Check Answers
          </Button>
        </div>
      )}
    </div>
  )
}

