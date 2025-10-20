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
      onUploadSuccess()
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('')
      }, 3000)
    } catch (err) {
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
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}
      </div>
    </div>
  )
}

