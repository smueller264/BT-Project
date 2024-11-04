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

interface Badge {
  id: string
  name: string
  description: string
  earned: boolean
}

const initialBadges: Badge[] = [
  {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Answered the first three questions correctly',
    earned: false
  },
  {
    id: 'mid-course-master',
    name: 'Mid-Course Master',
    description: 'Reached the halfway point of the course',
    earned: false
  },
  {
    id: 'consistency-champion',
    name: 'Consistency Champion',
    description: 'Answered two consecutive questions correctly',
    earned: false
  },
  {
    id: 'completion-hero',
    name: 'Completion Hero',
    description: 'Completed the entire course',
    earned: false
  },
  {
    id: 'high-five',
    name: 'High Five',
    description: 'Answered five questions correctly',
    earned: false
  },
  {
    id: 'perfect-score',
    name: 'Perfect Score',
    description: 'Answered all questions correctly',
    earned: false
  }
]

export default function BadgeCourse() {
  const [currentSlide, setCurrentSlide] = useState(-1)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [consecutiveCorrectAnswers, setConsecutiveCorrectAnswers] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [badges, setBadges] = useState<Badge[]>(initialBadges)
  const [newBadge, setNewBadge] = useState<Badge | null>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [error, setError] = useState('')

  const handleStart = () => {
    setCurrentSlide(0)
  }

  const handleNext = () => {
    if (currentSlide >= courseContent.length - 1) {
      setCourseCompleted(true)
      earnBadge('completion-hero')
      if (correctAnswers === totalAnswered) {
        earnBadge('perfect-score')
      }
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
      const newConsecutiveCorrectAnswers = consecutiveCorrectAnswers + 1
      setConsecutiveCorrectAnswers(newConsecutiveCorrectAnswers)
      
      if (newTotalAnswered <= 3 && newCorrectAnswers === 3) {
        earnBadge('quick-learner')
      }
      
      if (newConsecutiveCorrectAnswers === 2) {
        earnBadge('consistency-champion')
      }

      if (newCorrectAnswers === 5) {
        earnBadge('high-five')
      }
    } else {
      setConsecutiveCorrectAnswers(0)
    }
    
    const totalQuestionSlides = courseContent.filter(slide => slide.type === 'question').length
    if (newTotalAnswered === Math.ceil(totalQuestionSlides / 2)) {
      earnBadge('mid-course-master')
    }
  }

  const earnBadge = (badgeId: string) => {
    console.log(`Attempting to earn badge: ${badgeId}`)
    setBadges(prevBadges => {
      const newBadges = prevBadges.map(badge => 
        badge.id === badgeId && !badge.earned ? { ...badge, earned: true } : badge
      )
      console.log('Updated badges:', newBadges.map(b => `${b.name}: ${b.earned}`))
      return newBadges
    })
    const earnedBadge = badges.find(b => b.id === badgeId)
    if (earnedBadge) {
      setNewBadge(earnedBadge)
      setTimeout(() => setNewBadge(null), 3000)
    }
  }

  const handleQuestionnaireComplete = async (answers: Record<string, string | number>) => {
    try {
      console.log('Questionnaire completed. Attempting to save data...');
      const totalQuestions = courseContent.filter(slide => slide.type === 'question').length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      await saveCourseData('badge', score, answers); 
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

  useEffect(() => {
    console.log('Current state:', {
      currentSlide,
      totalAnswered,
      correctAnswers,
      consecutiveCorrectAnswers,
      badges: badges.map(b => `${b.name}: ${b.earned}`)
    })
  }, [currentSlide, totalAnswered, correctAnswers, consecutiveCorrectAnswers, badges])

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
        title="Welcome to the Artificial Intelligence Course with Badges"
        instructions={[
          "You'll go through a series of information slides and questions.",
          "For each question, select an answer and click 'Submit Answer'.",
          "After submitting, you'll see if your answer was correct or not.",
          "Click 'Next' to proceed to the next slide.",
          "You can earn badges for your achievements throughout the course, so try your best to collect them all!.",
          "You can't go back to previous slides or restart the course.",
          "At the end, you'll see your final score and earned badges.",
          "After the course, please fill out the short questionnaire at the end"
        ]}
        onStart={handleStart}
      />
    )
  }

  if (courseCompleted && currentSlide !== -2) {
    if (showQuestionnaire) {
      return (
        <div className="container mx-auto py-10">
          <CourseQuestionnaire
            courseType="badges"
            userPerformance={Math.round((correctAnswers / courseContent.filter(slide => slide.type === 'question').length) * 100)}
            onComplete={handleQuestionnaireComplete}
          />
        </div>
      )
    }

    if (!showQuestionnaire) {
      const totalQuestions = courseContent.filter(slide => slide.type === 'question').length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      return (
        <div className="container mx-auto py-10">
          <Card className="w-full max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Course Completed!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">You answered {correctAnswers} out of {totalQuestions} questions correctly.</p>
              <p className="text-lg mt-4">Your score: {score}%</p>
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Your Badges</h3>
                <div className="grid grid-cols-2 gap-4">
                  {badges.map(badge => (
                    <div key={badge.id} className={`p-4 border rounded-lg ${badge.earned ? 'bg-primary/10' : 'bg-muted/50'}`}>
                      <div className="flex flex-col items-center">
                        <img src="/assets/badge.svg" alt={badge.name} className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium text-center">{badge.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{badge.description}</p>
                      {badge.earned ? (
                        <p className="text-green-600 font-semibold mt-2 text-center">Earned!</p>
                      ) : (
                        <p className="text-red-600 font-semibold mt-2 text-center">Not earned</p>
                      )}
                    </div>
                  ))}
                </div>
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
          <footer className="text-center text-xs text-gray-400 py-2 mt-auto">
        badge designed by freepik
      </footer>
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">AI Course</CardTitle>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-1">Progress: {currentSlideProgress} / {totalSlides} slides</p>
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
        <CardFooter className="flex flex-col items-start">
          <div className="w-full flex justify-end mb-4">
            <Button 
              onClick={handleNext}
              disabled={currentSlideContent.type === 'question' && !showResult && selectedAnswer === null}
            >
              {currentSlideContent.type === 'question' && !showResult ? 'Submit Answer' : 'Next'}
            </Button>
          </div>
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2">Earned Badges:</h3>
            <div className="flex flex-wrap gap-2">
              {badges.filter(badge => badge.earned).map(badge => (
                <div key={badge.id} className="flex flex-col items-center bg-primary/10 rounded-lg px-3 py-2">
                  <img src="/assets/badge.svg" alt={badge.name} className="w-6 h-6 mb-1" />
                  <span className="text-xs font-medium text-center">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
        {newBadge && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
            <p className="font-bold">New Badge Earned!</p>
            <p>{newBadge.name}</p>
          </div>
        )}
      </Card>
     
    </div>
    
  )
}