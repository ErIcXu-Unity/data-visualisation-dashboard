'use client'

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Select Products</h2>
        <p className="text-sm text-gray-500 mt-1">Choose up to 4 products to compare</p>
      </div>
      
      {/* Responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {products.map((product) => (
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
        ))}
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

