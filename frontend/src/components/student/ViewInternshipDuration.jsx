import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Calendar } from 'lucide-react'
import { toast } from 'react-hot-toast'
import studentApi from '../../services/studentApi'

const ViewInternshipDuration = () => {
  const [duration, setDuration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDuration = async () => {
      try {
        const data = await studentApi.internships.getDuration()
        setDuration(data)
      } catch (err) {
        setError('Failed to load internship duration')
        toast.error('Failed to load internship duration')
      } finally {
        setLoading(false)
      }
    }

    fetchDuration()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-orange-500/10 p-2 w-fit">
          <Calendar className="h-6 w-6 text-orange-500" />
        </div>
        <CardTitle className="mt-4">Internship Duration</CardTitle>
        <CardDescription>View your internship timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : duration ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Start Date</span>
              <span className="font-semibold">{formatDate(duration.startDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">End Date</span>
              <span className="font-semibold">{formatDate(duration.endDate)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Duration</span>
              <span className="font-semibold">{duration.totalDays} days</span>
            </div>
            {duration.remainingDays && (
              <div className="mt-4 p-2 bg-orange-50 rounded-md">
                <p className="text-sm text-orange-600">
                  {duration.remainingDays} days remaining
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No internship duration available.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default ViewInternshipDuration