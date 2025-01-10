import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { GraduationCap, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'
import studentApi from '../../services/studentApi'

const ViewTeacherEvaluation = () => {
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvaluation = async () => {
      try {
        const data = await studentApi.evaluations.getTeacherEvaluation()
        setEvaluation(data)
      } catch (err) {
        setError('Failed to load teacher evaluation')
        toast.error('Failed to load teacher evaluation')
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluation()
  }, [])

  const renderStars = (score) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < score
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-yellow-500/10 p-2 w-fit">
          <GraduationCap className="h-6 w-6 text-yellow-500" />
        </div>
        <CardTitle className="mt-4">Teacher's Evaluation</CardTitle>
        <CardDescription>View feedback from your teacher</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : evaluation ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Grade</p>
              <div className="flex items-center space-x-1">
                {renderStars(evaluation.grade)}
                <span className="ml-2 text-sm font-medium">
                  {evaluation.grade}/5
                </span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Comments</p>
              <p className="text-sm">{evaluation.comments}</p>
            </div>

            {evaluation.recommendations && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Recommendations</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {evaluation.recommendations.map((rec, index) => (
                    <li key={index} className="text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {evaluation.improvements && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Areas for Improvement</p>
                <div className="flex flex-wrap gap-2">
                  {evaluation.improvements.map((area, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-full text-xs"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No evaluation available yet.</p>
        )}
        
        <Button
          variant="secondary"
          className="w-full mt-4 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500"
          disabled={!evaluation}
        >
          View Full Evaluation
        </Button>
      </CardContent>
    </Card>
  )
}

export default ViewTeacherEvaluation