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
      onSelectionChange([...selectedIds, id])
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(products.map((p) => p.id))
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Select Products</h2>
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          {selectedIds.length === products.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {products.map((product) => (
          <label
            key={product.id}
            className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(product.id)}
              onChange={() => handleToggle(product.id)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-sm text-gray-700">{product.name}</span>
          </label>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-500">
        {selectedIds.length} of {products.length} products selected
      </div>
    </div>
  )
}

