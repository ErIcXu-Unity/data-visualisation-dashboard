'use client'

import React from 'react'
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

export default function ChartDisplay({ products, loading = false }: ChartDisplayProps) {
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
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{dynamicTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {productNames.length === 1 ? 'Daily' : 'Comparative'} analysis over 3 days
        </p>
      </div>

      <ResponsiveContainer width="100%" height={500}>
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
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey={`${product.name}_inventory`}
                  stroke={colorSet.inventory}
                  strokeWidth={2}
                  name={`${product.name} - Inventory`}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                {/* Procurement and Sales lines use right Y-axis */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={`${product.name}_procurement`}
                  stroke={colorSet.procurement}
                  strokeWidth={2}
                  name={`${product.name} - Procurement Amount`}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey={`${product.name}_sales`}
                  stroke={colorSet.sales}
                  strokeWidth={2}
                  name={`${product.name} - Sales Amount`}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
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
    </div>
  )
}

