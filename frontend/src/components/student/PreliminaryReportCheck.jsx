import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { FileCheck, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import studentApi from '../../services/studentApi'

const PreliminaryReportCheck = () => {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await studentApi.reports.getPreliminaryStatus()
        setStatus(data.status)
      } catch (err) {
        setError('Failed to load preliminary report status')
        toast.error('Failed to load preliminary report status')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await studentApi.reports.submitPreliminary({
        // Add any necessary data here
      })
      toast.success('Preliminary report submitted successfully')
      // Refresh status
      const newStatus = await studentApi.reports.getPreliminaryStatus()
      setStatus(newStatus.status)
    } catch (err) {
      toast.error('Failed to submit preliminary report')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="rounded-lg bg-blue-500/10 p-2 w-fit">
          <FileCheck className="h-6 w-6 text-blue-500" />
        </div>
        <CardTitle className="mt-4">Preliminary Report Check</CardTitle>
        <CardDescription>Check and submit your preliminary report</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Current Status</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
                {status || 'Not Submitted'}
              </span>
            </div>

            {status !== 'approved' && (
              <Button
                variant="secondary"
                className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-500"
                onClick={handleSubmit}
                disabled={submitting || status === 'pending'}
                loading={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Preliminary Report'}
              </Button>
            )}

            {status === 'rejected' && (
              <div className="p-3 bg-red-50 rounded-md">
                <p className="text-sm text-red-600">
                  Your preliminary report was rejected. Please review the feedback and submit again.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PreliminaryReportCheck