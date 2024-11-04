'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { courseContent, Slide } from '../lib/courseContent'
import { CourseIntroduction } from './CourseIntroduction'
import { CourseQuestionnaire } from './CourseQuestionnaire'
import { saveCourseData } from '@/lib/firestore'

interface LeaderboardEntry {
  id: string
  score: number
}

const generateRealisticScore = (): number => {
  const possibleScores = [30, 40, 50, 60, 60, 60, 70, 80, 90, 100]
  return possibleScores[Math.floor(Math.random() * possibleScores.length)]
}

export default function LeaderboardCourse() {
  const [currentSlide, setCurrentSlide] = useState(-1)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [userId] = useState(`User${Math.floor(Math.random() * 1000)}`)
  const leaderboardRef = useRef<HTMLDivElement>(null)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const [error, setError] = useState('')
  const [dummyLeaderboard, setDummyLeaderboard] = useState<LeaderboardEntry[]>([])

  const totalQuestions = courseContent.filter(slide => slide.type === 'question').length

  useEffect(() => {
    const newDummyLeaderboard: LeaderboardEntry[] = Array.from({ length: 19 }, (_, i) => ({
      id: `User${i + 1}`,
      score: generateRealisticScore()
    })).sort((a, b) => b.score - a.score)
    setDummyLeaderboard(newDummyLeaderboard)
  }, [])

  const handleStart = () => {
    setCurrentSlide(0)
  }

  const handleNext = () => {
    if (showLeaderboard) {
      moveToNextSlide()
    } else if (showResult) {
      if (totalAnswered % 2 === 0) {
        setShowLeaderboard(true)
      } else {
        moveToNextSlide()
      }
    } else {
      moveToNextSlide()
    }
  }

  const moveToNextSlide = () => {
    if (currentSlide < courseContent.length - 1) {
      setCurrentSlide(currentSlide + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setAnsweredCorrectly(false)
      setShowLeaderboard(false)
    } else {
      setCourseCompleted(true)
    }
  }

  const handleSubmit = () => {
    setShowResult(true)
    if (selectedAnswer === currentSlideContent.correctAnswer) {
      setAnsweredCorrectly(true)
      setCorrectAnswers(prev => prev + 1)
    }
    setTotalAnswered(prev => prev + 1)
  }

  const handleQuestionnaireComplete = async (answers: Record<string, string | number>) => {
    try {
      console.log('Questionnaire completed. Attempting to save data...')
      const score = Math.round((correctAnswers / totalQuestions) * 100)
      await saveCourseData('leaderboard', score, answers)
      console.log('Data saved successfully')
      setShowQuestionnaire(false)
      setCurrentSlide(-2)
    } catch (e) {
      console.error('Error in handleQuestionnaireComplete:', e)
      setError('An error occurred while saving your data. Please try again.')
    }
  }

  const currentSlideContent = courseContent[currentSlide] || { type: 'info', content: '' }

  const getUserScore = () => {
    if (totalAnswered === 0) return 0
    return Math.round((correctAnswers / totalAnswered) * 100)
  }

  const getUpdatedLeaderboard = () => {
    const userScore = getUserScore()
    const leaderboard = [...dummyLeaderboard]
    const userEntry = { id: userId, score: userScore }
    
   
    const userPosition = leaderboard.findIndex(entry => entry.score <= userScore)
    
    if (userPosition === -1) {
      leaderboard.push(userEntry)
    } else {
      leaderboard.splice(userPosition, 0, userEntry)
    }
    
    return leaderboard.slice(0, 20)
  }

  const updatedLeaderboard = getUpdatedLeaderboard()

  const totalSlides = courseContent.length
  const currentSlideProgress = currentSlide + 1
  const slideProgressPercentage = (currentSlideProgress / totalSlides) * 100

  useEffect(() => {
    if (showLeaderboard && leaderboardRef.current) {
      const userRow = leaderboardRef.current.querySelector(`[data-user-id="${userId}"]`)
      if (userRow) {
        userRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [showLeaderboard, userId])

  const renderLeaderboard = (leaderboard: LeaderboardEntry[]) => (
    <div ref={leaderboardRef} className="max-h-96 overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaderboard.map((entry, index) => (
            <TableRow 
              key={entry.id}
              className={entry.id === userId ? "bg-primary/10 font-semibold" : ""}
              data-user-id={entry.id}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{entry.id === userId ? "You" : `Anonymous ${index + 1}`}</TableCell>
              <TableCell>{entry.score}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (currentSlide === -2) {
    return (
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Thank you for completing the course and providing your feedback. The course is now over.</p>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentSlide === -1) {
    return (
      <CourseIntroduction
      title="Welcome to the Artificial Intelligence Course with Leaderboard"
      instructions={[
        "You'll go through a series of information slides and questions.",
        "For each question, select an answer and click 'Submit Answer'.",
        "After submitting, you'll see if your answer was correct or not.",
        "Click 'Next' to proceed to the next slide.",
        "After every two questions, a leaderboard will show you how you rank against the other people who have finished the course already",
        "You can't go back to previous slides or restart the course.",
        "At the end, you'll see your final score and leaderboard position",
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
            courseType="leaderboard"
            userPerformance={getUserScore()}
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
            <p className="text-lg mb-4">Congratulations on completing the AI course!</p>
            <p className="text-lg">You answered {correctAnswers} out of {totalQuestions} questions correctly.</p>
            <p className="text-lg mt-4">Your score: {getUserScore()}%</p>
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Final Leaderboard</h3>
              {renderLeaderboard(updatedLeaderboard)}
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
            <p className="text-sm text-muted-foreground mb-1">Progress: {currentSlideProgress} / {totalSlides} slides</p>
            <Progress value={slideProgressPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          {showLeaderboard ? (
            <div>
              <h3 className="text-xl font-bold mb-4">Current Leaderboard</h3>
              {renderLeaderboard(updatedLeaderboard)}
            </div>
          ) : currentSlideContent.type === 'info' ? (
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
          {(currentSlideContent.type === 'info' || showResult || showLeaderboard) && (
            <Button onClick={handleNext}>
              {currentSlide === courseContent.length - 1 ? 'Finish' : 'Next'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}