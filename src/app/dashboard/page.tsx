'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import ProductSelector from '@/components/ProductSelector'
import ChartDisplay from '@/components/ChartDisplay'
import ExcelUpload from '@/components/ExcelUpload'
import { Product, ProductDetail } from '@/types/product'

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = () => {
    setLoading(true)
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedIds.length === 0) {
      setProductDetails([])
      return
    }

    Promise.all(
      selectedIds.map((id) =>
        fetch(`/api/products/${id}`).then((res) => res.json())
      )
    ).then((details) => {
      setProductDetails(details)
    })
  }, [selectedIds])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Data Visualization Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Analyze procurement, sales, and inventory history
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <ExcelUpload
            onUploadSuccess={() => {
              fetchProducts()
              setSelectedIds([])
            }}
          />
          <ProductSelector
            products={products}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
          <ChartDisplay products={productDetails} />
        </div>
      </main>
    </div>
  )
}

