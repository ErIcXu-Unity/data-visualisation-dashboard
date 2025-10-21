'use client'

import { useState } from 'react'

interface ExcelUploadProps {
  onUploadSuccess: () => void
}

export default function ExcelUpload({ onUploadSuccess }: ExcelUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ]

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/)) {
      setError('Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) file')
      return
    }

    setUploading(true)
    setError('')
    setSuccess('')

    // Upload file to server
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Upload failed')
        return
      }

      setSuccess(`Successfully imported ${data.productsCount} products`)
      
      // Show success message for 2 seconds before refreshing
      setTimeout(() => {
        setSuccess('')
        onUploadSuccess()
      }, 2000)
    } catch {
      setError('An error occurred during upload')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Import Data</h2>
        <p className="text-sm text-gray-500 mt-1">Upload Excel or CSV file to update products</p>
      </div>
      
      <div className="space-y-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
        
        <p className="text-sm text-gray-500">
          Supported formats: Excel (.xlsx, .xls) or CSV (.csv)
        </p>

        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-semibold text-green-800">Upload Successfully! {success}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

