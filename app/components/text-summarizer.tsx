"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { summarizeText } from "@/utils/gemini"

export function TextSummarizer() {
  const [text, setText] = useState("")
  const [summary, setSummary] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSummary("")

    const result = await summarizeText(text)

    if (result.error) {
      setError(result.error)
    } else {
      setSummary(result.text)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-nude-800">Enter your text:</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your text here..."
          className="min-h-[200px] bg-nude-100 border-nude-300 placeholder-nude-400 text-black"
          required
        />
      </div>
      <Button type="submit" disabled={loading || !text} className="bg-nude-600 hover:bg-nude-700 text-white">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Summarize
      </Button>
      {error && (
        <Alert variant="destructive" className="bg-red-100 border-red-300 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {summary && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-nude-800">Summary:</h3>
          <div className="rounded-lg bg-nude-200 p-4 text-black">{summary}</div>
        </div>
      )}
    </form>
  )
}

