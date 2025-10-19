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
}

const COLORS = [
  { inventory: '#3b82f6', procurement: '#10b981', sales: '#ef4444' },
  { inventory: '#8b5cf6', procurement: '#f59e0b', sales: '#ec4899' },
  { inventory: '#06b6d4', procurement: '#84cc16', sales: '#f43f5e' },
  { inventory: '#6366f1', procurement: '#14b8a6', sales: '#d946ef' },
  { inventory: '#0ea5e9', procurement: '#eab308', sales: '#e11d48' },
]

export default function ChartDisplay({ products }: ChartDisplayProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-500 text-lg">Select products to view data visualization</p>
      </div>
    )
  }

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Data Visualization</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="day"
            label={{ value: 'Day', position: 'insideBottom', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis
            label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {products.map((product, index) => {
            const colorSet = COLORS[index % COLORS.length]
            return (
              <React.Fragment key={product.id}>
                <Line
                  type="monotone"
                  dataKey={`${product.name}_inventory`}
                  stroke={colorSet.inventory}
                  strokeWidth={2}
                  name={`${product.name} - Inventory`}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey={`${product.name}_procurement`}
                  stroke={colorSet.procurement}
                  strokeWidth={2}
                  name={`${product.name} - Procurement Amount`}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey={`${product.name}_sales`}
                  stroke={colorSet.sales}
                  strokeWidth={2}
                  name={`${product.name} - Sales Amount`}
                  dot={{ r: 4 }}
                />
              </React.Fragment>
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

