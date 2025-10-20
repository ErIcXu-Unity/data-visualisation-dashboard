import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* Responsive container with padding */}
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AIBUILD Analytics
          </h1>
          <p className="text-gray-600 mt-4">
            Analyze procurement, sales, and inventory history for retail management
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Create Account
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Features</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Interactive data visualization with multi-product comparison</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Track inventory, procurement, and sales trends</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Import data from Excel files</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
