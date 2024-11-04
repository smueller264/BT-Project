import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CourseIntroductionProps {
  title: string
  instructions: string[]
  onStart: () => void
}

export function CourseIntroduction({ title, instructions, onStart }: CourseIntroductionProps) {
  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">Here's how the course works:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            {instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
          <p className="text-lg font-semibold">Are you ready to begin?</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={onStart} size="lg">
            Start Course
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}