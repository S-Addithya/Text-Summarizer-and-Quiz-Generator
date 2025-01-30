"use server"

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!

interface GeminiResponse {
  text: string
  error?: string
}

export async function summarizeText(text: string): Promise<GeminiResponse> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + GOOGLE_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Please provide a concise, safe, and educational summary of the following text. Avoid any dangerous, explicit, or harmful content: ${text}`,
                },
              ],
            },
          ],
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    const data = await response.json()

    console.log("Summarize API Response:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to summarize text")
    }

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0].text
    ) {
      throw new Error("Invalid response format: " + JSON.stringify(data))
    }

    const summaryText = data.candidates[0].content.parts[0].text
    console.log("Summary Text:", summaryText)

    return { text: summaryText }
  } catch (error) {
    console.error("Summarize error:", error)
    return {
      text: "",
      error: error instanceof Error ? error.message : "Failed to summarize text. Please try again.",
    }
  }
}

export async function generateQuiz(text: string): Promise<GeminiResponse> {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + GOOGLE_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 multiple choice questions based on this text. Ensure all content is safe, educational, and appropriate for all audiences. Format the response as a JSON array with each question having the following structure: { "question": string, "options": string[], "correctAnswer": string }. Do not include any markdown formatting or additional text. Only return the JSON array. Here's the text: ${text}`,
                },
              ],
            },
          ],
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      },
    )

    const data = await response.json()

    console.log("Quiz API Response:", JSON.stringify(data, null, 2))

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate quiz")
    }

    if (
      !data.candidates ||
      !data.candidates[0] ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0].text
    ) {
      throw new Error("Invalid response format: " + JSON.stringify(data))
    }

    const quizText = data.candidates[0].content.parts[0].text
    console.log("Quiz Text:", quizText)

    // Attempt to parse the JSON directly
    try {
      const quizQuestions = JSON.parse(quizText)
      if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        throw new Error("Invalid quiz format: not an array or empty")
      }
      return { text: JSON.stringify(quizQuestions) }
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON
      const jsonMatch = quizText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error("Could not find valid JSON in the response: " + quizText)
      }
      const extractedJson = jsonMatch[0]
      const quizQuestions = JSON.parse(extractedJson)
      if (!Array.isArray(quizQuestions) || quizQuestions.length === 0) {
        throw new Error("Invalid quiz format after extraction: not an array or empty")
      }
      return { text: JSON.stringify(quizQuestions) }
    }
  } catch (error) {
    console.error("Quiz generation error:", error)
    return {
      text: "",
      error: error instanceof Error ? error.message : "Failed to generate quiz. Please try again.",
    }
  }
}

