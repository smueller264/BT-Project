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
import { saveCourseData } from '@/lib/firestore'

export default function NonGamifiedCourse() {
  const [currentSlide, setCurrentSlide] = useState(-1)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [error, setError] = useState(''); 

  const handleStart = () => {
    setCurrentSlide(0)
  }

  const handleNext = () => {
    if (currentSlide >= courseContent.length - 1) {
      setCourseCompleted(true)
      return
    }

    if (currentSlideContent.type === 'info' || showResult) {
      setCurrentSlide(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setAnsweredCorrectly(false)
    } else if (currentSlideContent.type === 'question' && !showResult) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    setShowResult(true)
    const newTotalAnswered = totalAnswered + 1
    setTotalAnswered(newTotalAnswered)
    
    const isCorrect = selectedAnswer === currentSlideContent.correctAnswer
    setAnsweredCorrectly(isCorrect)
    
    if (isCorrect) {
      const newCorrectAnswers = correctAnswers + 1
      setCorrectAnswers(newCorrectAnswers)
    }
  }

  const handleQuestionnaireComplete = async (answers: Record<string, string | number>) => {
    try {
      console.log('Questionnaire completed. Attempting to save data...');
      const totalQuestions = courseContent.filter(slide => slide.type === 'question').length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      await saveCourseData('non-gamified', score, answers); 
      console.log('Data saved successfully');
      setShowQuestionnaire(false);
      setCurrentSlide(-2); 
    } catch (e) {
      console.error('Error in handleQuestionnaireComplete:', e);
      setError('An error occurred while saving your data. Please try again.');
    }
  };

  const currentSlideContent = courseContent[currentSlide] || { type: 'info', content: '' }

  const totalSlides = courseContent.length
  const currentSlideProgress = currentSlide + 1
  const slideProgressPercentage = (currentSlideProgress / totalSlides) * 100

  if (currentSlide === -2) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Thank you for completing the course and providing your feedback. The course is now over.</p>
            {error && <p className="text-red-600">{error}</p>} {/* Display error message */}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSlide === -1) {
    return (
      <CourseIntroduction
      title="Welcome to the Artificial Intelligence Course"
      instructions={[
        "You'll go through a series of information slides and questions.",
        "For each question, select an answer and click 'Submit Answer'.",
        "After submitting, you'll see if your answer was correct or not.",
        "Click 'Next' to proceed to the next slide.",
        "You can't go back to previous slides or restart the course.",
        "At the end, you'll see your final score.",
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
            courseType="non-gamified"
            userPerformance={(correctAnswers / courseContent.filter(slide => slide.type === 'question').length) * 100}
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
            <p className="text-lg mb-4">Congratulations on completing the AI Course!</p>
            <p className="text-lg">You answered {correctAnswers} out of {courseContent.filter(slide => slide.type === 'question').length} questions correctly.</p>
            <p className="text-lg mt-4">Your score: {Math.round((correctAnswers / courseContent.filter(slide => slide.type === 'question').length) * 100)}%</p>
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
            <p className="text-sm text-muted-foreground mb-1">Progress: {currentSlideProgress} / {totalSlides} 
 slides</p>
            <Progress value={slideProgressPercentage} className="h-2" />
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
          <Button 
            onClick={handleNext}
            disabled={currentSlideContent.type === 'question' && !showResult && selectedAnswer === null}
          >
            {currentSlideContent.type === 'question' && !showResult ? 'Submit Answer' : 'Next'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
