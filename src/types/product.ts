export interface Product {
  id: string
  name: string
}

export interface DailyRecord {
  day: number
  inventory: number
  procurementAmount: number
  salesAmount: number
  procurementQty: number
  procurementPrice: number
  salesQty: number
  salesPrice: number
}

export interface ProductDetail {
  id: string
  name: string
  openingInventory: number
  history: DailyRecord[]
}

