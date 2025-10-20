'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { ProductDetail } from '@/types/product'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface ChartDisplayProps {
  products: ProductDetail[]
  loading?: boolean
  lineTypes?: {
    inventory: boolean
    procurement: boolean
    sales: boolean
  }
  onLineTypesChange?: (types: { inventory: boolean; procurement: boolean; sales: boolean }) => void
}

// Color scheme for different product lines
const COLORS = [
  { inventory: '#3b82f6', procurement: '#10b981', sales: '#ef4444' },
  { inventory: '#8b5cf6', procurement: '#f59e0b', sales: '#ec4899' },
  { inventory: '#06b6d4', procurement: '#84cc16', sales: '#f43f5e' },
  { inventory: '#6366f1', procurement: '#14b8a6', sales: '#d946ef' },
  { inventory: '#0ea5e9', procurement: '#eab308', sales: '#e11d48' },
]

// Custom Tooltip component for better data display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
      <p className="font-semibold text-gray-900 mb-2">Day {label}</p>
      <div className="space-y-1">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-medium text-gray-900">{entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ChartDisplay({ 
  products, 
  loading = false,
  lineTypes = { inventory: true, procurement: true, sales: true },
  onLineTypesChange
}: ChartDisplayProps) {
  const [insights, setInsights] = useState<string>('')
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [insightsError, setInsightsError] = useState<string>('')
  const [showInsights, setShowInsights] = useState(false)

  // Generate AI insights
  const generateInsights = async () => {
    setInsightsLoading(true)
    setInsightsError('')
    
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate insights')
      }

      setInsights(data.insights)
      setShowInsights(true)
    } catch (error: any) {
      setInsightsError(error.message)
    } finally {
      setInsightsLoading(false)
    }
  }

  const toggleType = (type: 'inventory' | 'procurement' | 'sales') => {
    onLineTypesChange?.({
      ...lineTypes,
      [type]: !lineTypes[type],
    })
  }
  // Loading state
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg">Select products to view data visualization</p>
        <p className="text-gray-400 text-sm mt-2">Choose one or more products from the list above</p>
      </div>
    )
  }

  // Transform product data into chart-ready format
  const chartData = [1, 2, 3].map((day) => {
    const dataPoint: Record<string, number> = { day }
    
    products.forEach((product) => {
      const record = product.history.find((r) => r.day === day)
      if (record) {
        dataPoint[`${product.name}_inventory`] = record.inventory
        dataPoint[`${product.name}_procurement`] = record.procurementAmount
        dataPoint[`${product.name}_sales`] = record.salesAmount
      }
    })

    return dataPoint
  })

  // Generate dynamic title based on selected products
  const productNames = products.map(p => p.name)
  const dynamicTitle = productNames.length === 1
    ? productNames[0]
    : productNames.length === 2
    ? `${productNames[0]} vs ${productNames[1]}`
    : `${productNames.length} Products Comparison`

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{dynamicTitle}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {productNames.length === 1 ? 'Daily' : 'Comparative'} analysis over 3 days
          </p>
        </div>
        
        {/* Type selector buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleType('inventory')}
            className={`px-3 py-2 rounded-md border-2 transition-all text-xs font-medium ${
              lineTypes.inventory
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
            title="Toggle Inventory"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Inventory</span>
            </div>
          </button>
          
          <button
            onClick={() => toggleType('procurement')}
            className={`px-3 py-2 rounded-md border-2 transition-all text-xs font-medium ${
              lineTypes.procurement
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
            title="Toggle Procurement"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Procurement</span>
            </div>
          </button>
          
          <button
            onClick={() => toggleType('sales')}
            className={`px-3 py-2 rounded-md border-2 transition-all text-xs font-medium ${
              lineTypes.sales
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
            title="Toggle Sales"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Sales</span>
            </div>
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={600}>
        <LineChart data={chartData} margin={{ top: 5, right: 60, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          
          <XAxis
            dataKey="day"
            label={{ value: 'Day', position: 'insideBottom', offset: -10 }}
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
          />
          
          {/* Left Y-axis for Inventory (quantity in units) */}
          <YAxis
            yAxisId="left"
            label={{ value: 'Inventory (units)', angle: -90, position: 'insideLeft' }}
            stroke="#3b82f6"
            tick={{ fill: '#6b7280' }}
          />
          
          {/* Right Y-axis for Amount (currency) */}
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Amount ($)', angle: 90, position: 'insideRight' }}
            stroke="#10b981"
            tick={{ fill: '#6b7280' }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          
          {products.map((product, index) => {
            const colorSet = COLORS[index % COLORS.length]
            return (
              <React.Fragment key={product.id}>
                {/* Inventory line uses left Y-axis */}
                {lineTypes.inventory && (
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey={`${product.name}_inventory`}
                    stroke={colorSet.inventory}
                    strokeWidth={2.5}
                    name={`${product.name} - Inventory`}
                    dot={{ r: 5, strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {/* Procurement and Sales lines use right Y-axis */}
                {lineTypes.procurement && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={`${product.name}_procurement`}
                    stroke={colorSet.procurement}
                    strokeWidth={2.5}
                    name={`${product.name} - Procurement Amount`}
                    dot={{ r: 5, strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                )}
                {lineTypes.sales && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey={`${product.name}_sales`}
                    stroke={colorSet.sales}
                    strokeWidth={2.5}
                    name={`${product.name} - Sales Amount`}
                    dot={{ r: 5, strokeWidth: 2 }}
                    activeDot={{ r: 7 }}
                  />
                )}
              </React.Fragment>
            )
          })}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Note:</span> Inventory (left axis) shows quantity in units. 
          Procurement and Sales Amounts (right axis) show monetary values in dollars.
        </p>
      </div>

      {/* AI Insights Section */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900">AI Data Insights</h3>
          </div>
          
          <button
            onClick={generateInsights}
            disabled={insightsLoading || products.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            {insightsLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Insights</span>
              </>
            )}
          </button>
        </div>

        {/* Error Message */}
        {insightsError && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-800 font-medium">{insightsError}</p>
            </div>
          </div>
        )}

        {/* Insights Display */}
        {showInsights && insights && (
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Analysis Results</h4>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <ReactMarkdown
                    components={{
                      // Style headings
                      h1: ({ children }: any) => <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2">{children}</h1>,
                      h2: ({ children }: any) => <h2 className="text-lg font-bold text-gray-900 mt-3 mb-2">{children}</h2>,
                      h3: ({ children }: any) => <h3 className="text-base font-bold text-gray-900 mt-2 mb-1">{children}</h3>,
                      // Style paragraphs
                      p: ({ children }: any) => <p className="mb-3 text-gray-700 leading-relaxed">{children}</p>,
                      // Style lists
                      ul: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-3">{children}</ul>,
                      ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-3">{children}</ol>,
                      li: ({ children }: any) => <li className="text-gray-700 ml-2">{children}</li>,
                      // Style strong/bold text
                      strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
                      // Style emphasis/italic
                      em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
                      // Style code
                      code: ({ children }: any) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-blue-600">{children}</code>,
                    }}
                  >
                    {insights}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!showInsights && !insightsError && products.length > 0 && (
          <div className="text-center py-8 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No insights generated yet</h3>
            <p className="mt-1 text-sm text-gray-500">Click &quot;Generate Insights&quot; to get AI-powered analysis of your data</p>
          </div>
        )}
      </div>
    </div>
  )
}

