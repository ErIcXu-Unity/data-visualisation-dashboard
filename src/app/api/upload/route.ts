import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { Prisma } from '@prisma/client'
export const runtime = 'nodejs'
export const maxDuration = 60

interface ProductRow {
  id: string
  name: string
  openingInventory: number
  procurementQty: number[]
  procurementPrice: number[]
  salesQty: number[]
  salesPrice: number[]
}

// Parse price strings removing currency symbols and commas
function parsePrice(value: string | number): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    return parseFloat(value.replace(/[$,\s]/g, '')) || 0
  }
  return 0
}

function parseNumber(value: string | number): number {
  if (typeof value === 'number') return value
  return parseInt(String(value)) || 0
}

// Extract product data from Excel worksheet
function parseExcelData(worksheet: XLSX.WorkSheet): ProductRow[] {
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as (string | number)[][]
  const products: ProductRow[] = []

  for (let i = 1; i < data.length; i++) {
    const row = data[i]
    if (!row || row.length < 14) continue

    const product: ProductRow = {
      id: String(row[0] || '').trim(),
      name: String(row[1] || '').trim(),
      openingInventory: parseNumber(row[2]),
      procurementQty: [
        parseNumber(row[3]),
        parseNumber(row[5]),
        parseNumber(row[7]),
      ],
      procurementPrice: [
        parsePrice(row[4]),
        parsePrice(row[6]),
        parsePrice(row[8]),
      ],
      salesQty: [
        parseNumber(row[9]),
        parseNumber(row[11]),
        parseNumber(row[13]),
      ],
      salesPrice: [
        parsePrice(row[10]),
        parsePrice(row[12]),
        parsePrice(row[14]),
      ],
    }

    if (product.id && product.name) {
      products.push(product)
    }
  }

  return products
}

function toErrorString(e: unknown): string {
  if (e instanceof Error) return `${e.name}: ${e.message}`
  return String(e)
}

export async function POST(request: Request) {
  try {
    let session
    try {
      session = await auth()
    } catch (e: unknown) {
      return NextResponse.json({ where: 'auth()', error: toErrorString(e) }, { status: 500 })
    }

    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

    let products
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      const wb = XLSX.read(buffer, { type: 'buffer' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      products = parseExcelData(ws)
    } catch (e: unknown) {
      return NextResponse.json({ where: 'xlsx', error: toErrorString(e) }, { status: 500 })
    }

    if (!products?.length) return NextResponse.json({ error: 'No valid products' }, { status: 400 })

    try {
      await prisma.$transaction(async (tx) => {
        // … 你的 upsert 逻辑 …
      }, { maxWait: 10000, timeout: 15000 })
    } catch (e: unknown) {
      return NextResponse.json({ where: 'prisma', error: toErrorString(e) }, { status: 500 })
    }

    return NextResponse.json({ success: true, productsCount: products.length })
  } catch (e: unknown) {
    return NextResponse.json({ where: 'outer', error: toErrorString(e) }, { status: 500 })
  }
}

