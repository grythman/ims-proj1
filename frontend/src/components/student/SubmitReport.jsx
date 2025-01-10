import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../UI/Card'
import { Button } from '../UI/Button'
import { ClipboardEdit, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import studentApi from '../../services/studentApi'

const SubmitReport = () => {
  const [submitting, setSubmitting] = useState(false)
  const [files, setFiles] = useState([])
  const [reportType, setReportType] = useState('weekly')
  const [description, setDescription] = useState('')

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    
    // Validate file size
    const invalidFiles = selectedFiles.filter(file => file.size > MAX_FILE_SIZE)
    if (invalidFiles.length > 0) {
      toast.error(`Some files exceed the 10MB limit: ${invalidFiles.map(f => f.name).join(', ')}`)
      return
    }

    setFiles(selectedFiles)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('type', reportType)
      formData.append('description', description)

      await studentApi.reports.submitReport(formData)
      toast.success('Report submitted successfully')
      
      // Reset form
      setFiles([])
      setDescription('')
    } catch (err) {
      toast.error('Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="rounded-lg bg-emerald-500/10 p-2 w-fit">
          <ClipboardEdit className="h-6 w-6 text-emerald-500" />
        </div>
        <CardTitle>Submit Report</CardTitle>
        <CardDescription>Upload your internship report documents</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            >
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="final">Final Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
              placeholder="Provide a brief description of your report..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Files
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer rounded-md font-medium text-emerald-600 hover:text-emerald-500">
                    <span>Upload files</span>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOC, DOCX up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {files.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700">Selected Files:</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {files.map((file, index) => (
                  <li key={index} className="py-2 flex items-center justify-between">
                    <span className="text-sm text-gray-500">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={submitting || files.length === 0}
            loading={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default SubmitReport