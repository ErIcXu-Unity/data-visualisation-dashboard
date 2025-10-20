'use client'

import { useState, useMemo } from 'react'
import { Product } from '@/types/product'

interface ProductSelectorProps {
  products: Product[]
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export default function ProductSelector({
  products,
  selectedIds,
  onSelectionChange,
}: ProductSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id))
    } else {
      if (selectedIds.length >= 4) {
        alert('Maximum 4 products can be selected for comparison')
        return
      }
      onSelectionChange([...selectedIds, id])
    }
  }

  // Sort products alphabetically and filter by search query
  const filteredProducts = useMemo(() => {
    return products
      .sort((a, b) => a.name.localeCompare(b.name)) // Alphabetical order
      .filter((product) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
  }, [products, searchQuery])

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Header with search */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Select Products</h2>
          
          {/* Search box */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <svg 
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <p className="text-sm text-gray-500">Choose up to 4 products to compare</p>
      </div>
      
      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No products found matching &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredProducts.map((product) => (
          <label
            key={product.id}
            className={`flex items-center p-3 border border-gray-200 rounded-md transition-colors ${
              selectedIds.includes(product.id) || selectedIds.length < 4
                ? 'hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(product.id)}
              onChange={() => handleToggle(product.id)}
              disabled={!selectedIds.includes(product.id) && selectedIds.length >= 4}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
            />
            <span className="ml-3 text-sm text-gray-700">{product.name}</span>
          </label>
          ))
        )}
      </div>
      <div className="mt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">
            {selectedIds.length} / 4 products selected
          </span>
          {selectedIds.length > 0 && (
            <button
              onClick={() => onSelectionChange([])}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

