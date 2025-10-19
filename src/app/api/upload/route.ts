import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

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
function parsePrice(value: any): number {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    return parseFloat(value.replace(/[$,\s]/g, '')) || 0
  }
  return 0
}

function parseNumber(value: any): number {
  return parseInt(value) || 0
}

// Extract product data from Excel worksheet
function parseExcelData(worksheet: XLSX.WorkSheet): ProductRow[] {
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[]
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

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const products = parseExcelData(worksheet)

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No valid products found in file' },
        { status: 400 }
      )
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      for (const product of products) {
        let currentInventory = product.openingInventory

        // Calculate inventory for each day
        const dailyRecords = []
        for (let day = 1; day <= 3; day++) {
          const idx = day - 1
          // Inventory = Previous Inventory + Procurement - Sales
          currentInventory =
            currentInventory + product.procurementQty[idx] - product.salesQty[idx]

          dailyRecords.push({
            day,
            procurementQty: product.procurementQty[idx],
            procurementPrice: product.procurementPrice[idx],
            salesQty: product.salesQty[idx],
            salesPrice: product.salesPrice[idx],
            inventory: currentInventory,
          })
        }

        // Upsert: update if exists, create if not
        await tx.product.upsert({
          where: { 
            userId_id: {
              userId: session.user.id,
              id: product.id
            }
          },
          update: {
            name: product.name,
            openingInventory: product.openingInventory,
            dailyRecords: {
              deleteMany: {},
              create: dailyRecords,
            },
          },
          create: {
            id: product.id,
            name: product.name,
            openingInventory: product.openingInventory,
            userId: session.user.id,
            dailyRecords: {
              create: dailyRecords,
            },
          },
        })
      }
    })

    return NextResponse.json({
      success: true,
      productsCount: products.length,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    )
  }
}

