'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { courseContent, Slide } from '../lib/courseContent'
import { CourseIntroduction } from './CourseIntroduction'
import { CourseQuestionnaire } from './CourseQuestionnaire'
import { saveCourseData, testFirebaseConnection } from '../lib/firestore'

export default function PointsCourse() {
  const [currentSlide, setCurrentSlide] = useState(-1)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [points, setPoints] = useState(0)
  const [maxPoints, setMaxPoints] = useState(0)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [error, setError] = useState<string | null>(null)
  

  useEffect(() => {
    const questionCount = courseContent.filter(slide => slide.type === 'question').length
    setTotalQuestions(questionCount)
    setMaxPoints(questionCount * 10)
  }, [])

  const handleStart = () => {
    setCurrentSlide(0)
  }

  const handleNext = () => {
    if (currentSlide < courseContent.length - 1) {
      setCurrentSlide(currentSlide + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setAnsweredCorrectly(false)
    } else {
      setCourseCompleted(true)
    }
  }

  const handleSubmit = () => {
    setShowResult(true)
    if (selectedAnswer === currentSlideContent.correctAnswer) {
      setAnsweredCorrectly(true)
      setCorrectAnswers(prev => prev + 1)
      setPoints(prev => prev + 10)
    }
  }

  const handleQuestionnaireComplete = async (answers: Record<string, string | number>) => {
    try {
      console.log('Questionnaire completed. Attempting to save data...');
      await saveCourseData('points', points, answers);
      console.log('Data saved successfully');
      setShowQuestionnaire(false);
      setCurrentSlide(-2); 
    } catch (e) {
      console.error('Error in handleQuestionnaireComplete:', e);
      setError('An error occurred while saving your data. Please try again.');
    }
  };

  const currentSlideContent = courseContent[currentSlide] || { type: 'info', content: '' }

  if (currentSlide === -2) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Thank you for completing the course and providing your feedback. The course is now over.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSlide === -1) {
    return (
      <CourseIntroduction
      title="Welcome to the Artificial Intelligence Course with Points"
      instructions={[
        "You'll go through a series of information slides and questions.",
        "For each question, select an answer and click 'Submit Answer'.",
        "After submitting, you'll see if your answer was correct or not.",
        "Click 'Next' to proceed to the next slide.",
        "You can earn points for your achievements throughout the course, so try your best to collect them all!.",
        "You can't go back to previous slides or restart the course.",
        "At the end, you'll see your final score and earned points.",
        "After the course, please fill out the short questionnaire at the end"
      ]}
        onStart={handleStart}
      />
    )
  }

  if (courseCompleted) {
    if (showQuestionnaire) {
      return (
        <div className="container mx-auto py-10">
          <CourseQuestionnaire
            courseType="points"
            userPerformance={points}
            onComplete={handleQuestionnaireComplete}
          />
        </div>
      )
    }

    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Course Completed!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">Congratulations on completing the AI!</p>
            <p className="text-lg">You answered {correctAnswers} out of {totalQuestions} questions correctly.</p>
            <p className="text-lg mt-4">Your score: {Math.round((correctAnswers / totalQuestions) * 100)}%</p>
            <div className="mt-6">
              <p className="text-2xl font-bold">Total points earned: {points}</p>
              <Progress value={(points / maxPoints) * 100} className="mt-2" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => setShowQuestionnaire(true)} 
              className="w-full max-w-md py-6 text-lg font-semibold"
            >
              Take Questionnaire
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI Course</CardTitle>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">Progress: {currentSlide + 1} / {courseContent.length} slides</p>
            <Progress value={((currentSlide + 1) / courseContent.length) * 100} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          {currentSlideContent.type === 'info' ? (
            <p className="text-lg">{currentSlideContent.content}</p>
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-semibold">{currentSlideContent.question}</p>
              <RadioGroup 
                onValueChange={(value) => !showResult && setSelectedAnswer(parseInt(value))}
                value={selectedAnswer?.toString()}
              >
                {currentSlideContent.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`} 
                      disabled={showResult}
                    />
                    <Label htmlFor={`option-${index}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
              {showResult && (
                <p className={`font-semibold ${answeredCorrectly ? 'text-green-600' : 'text-red-600'}`}>
                  {answeredCorrectly ? 'Correct!' : 'Incorrect. The correct answer was: ' + currentSlideContent.options?.[currentSlideContent.correctAnswer || 0]}
                </p>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          {currentSlideContent.type === 'question' && !showResult && (
            <Button 
              onClick={handleSubmit} 
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          )}
          {(currentSlideContent.type === 'info' || showResult) && (
            <Button 
              onClick={handleNext}
            >
              {currentSlide === courseContent.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
        </CardFooter>
      </Card>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold">Current Points: {points}</h2>
            <p className="text-lg">{points} / {maxPoints}</p>
          </div>
          <Progress value={(points / maxPoints) * 100} className="h-4" />
        </CardContent>
      </Card>
    </div>
  )
}