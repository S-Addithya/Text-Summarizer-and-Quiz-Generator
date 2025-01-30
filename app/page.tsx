"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { TextSummarizer } from "./components/text-summarizer"
import { QuizGenerator } from "./components/quiz-generator"

export default function Home() {
  return (
    <div className="min-h-screen bg-nude-100 text-black">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-nude-900">Text Summarizer and Quiz Generator</h1>
        <Tabs defaultValue="summarizer" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 bg-nude-200">
            <TabsTrigger value="summarizer" className="data-[state=active]:bg-nude-300">
              Text Summarizer
            </TabsTrigger>
            <TabsTrigger value="quiz" className="data-[state=active]:bg-nude-300">
              Quiz Generator
            </TabsTrigger>
          </TabsList>
          <TabsContent value="summarizer">
            <Card className="p-6 bg-white border-nude-300">
              <TextSummarizer />
            </Card>
          </TabsContent>
          <TabsContent value="quiz">
            <Card className="p-6 bg-white border-nude-300">
              <QuizGenerator />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

