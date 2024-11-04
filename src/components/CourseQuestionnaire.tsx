'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Question {
  id: string
  text: string
  type: 'quantitative' | 'qualitative'
}

interface QuestionnaireProps {
  courseType: 'non-gamified' | 'points' | 'badges' | 'leaderboard'
  userPerformance: number
  onComplete: (answers: Record<string, string | number>) => void
}

const nonGamifiedQuestions: Question[] = [
  { id: 'engagement', text: 'How engaging did you find the course overall? 1 (Not at all) to 5 (Very engaging)', type: 'quantitative' },
  { id: 'motivation', text: 'How motivated were you to complete the course? 1 (Not at all) to 5 (Very motivated)', type: 'quantitative' },
  { id: 'distraciton', text: 'Did you feel focussed on the content of the course? 1 (Not at all) to 5 (Very focussed)', type: 'quantitative' },
  { id: 'retention', text: 'How much information do you feel you retained from the course? 1 (Nothing) to 5 (Everything)', type: 'quantitative' },
  { id: 'redo motivation', text: 'If given the opportunity, would you be motivated to retake this course in order to improve your score? 1 (Not at all) to 5 (Very Motivated)', type: 'quantitative' },
]

const gamifiedQuestions: Question[] = [
  { id: 'engagement', text: 'How engaging did you find the course overall? 1 (Not at all) to 5 (Very engaging)', type: 'quantitative' },
  { id: 'motivation', text: 'How motivated were you to complete the course? 1 (Not at all) to 5 (Very motivated)', type: 'quantitative' },
  { id: 'distraction', text: 'Did you feel focussed on the content of the course? 1 (Not at all) to 5 (Very focussed)', type: 'quantitative' },
  { id: 'retention', text: 'How much information do you feel you retained from the course? 1 (Nothing) to 5 (Everything)', type: 'quantitative' },
  //{ id: 'perception of gamification', text: 'Did you find the [ELEMENT] meaningful as a reward/motiavation for your effor? 1 (Not at all) to 5 (Very meaningful)', type: 'quantitative' },
  //{ id: 'gamification focus', text: 'How often did you think about the [ELEMENT] during the course? 1 (Not at all) to 5 (constantly)', type: 'quantitative' },
  { id: 'redo motivation', text: 'If given the opportunity, would you be motivated to retake this course in order to improve your score? 1 (Not at all) to 5 (Very Motivated)', type: 'quantitative' },
]

export function CourseQuestionnaire({ courseType, userPerformance, onComplete }: QuestionnaireProps) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({})

  const questions = courseType === 'non-gamified' ? nonGamifiedQuestions : gamifiedQuestions
  const gamificationElement = courseType === 'points' ? 'points' : courseType === 'badges' ? 'badges' : 'leaderboard'

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = () => {
    onComplete({ ...answers, userPerformance })
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Course Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map(question => {
            const questionText = courseType === 'non-gamified' 
              ? question.text 
              : question.text.replace('[ELEMENT]', gamificationElement)

            return (
              <div key={question.id} className="space-y-2">
                <p className="text-lg font-semibold">{questionText}</p>
                {question.type === 'quantitative' ? (
                  <RadioGroup
                    onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
                    value={answers[question.id]?.toString()}
                  >
                    <div className="flex justify-between">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div key={value} className="flex flex-col items-center">
                          <RadioGroupItem value={value.toString()} id={`${question.id}-${value}`} />
                          <Label htmlFor={`${question.id}-${value}`}>{value}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={answers[question.id]?.toString() || ''}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    placeholder="Your answer..."
                  />
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length}>
          Submit Feedback
        </Button>
      </CardFooter>
    </Card>
  )
}