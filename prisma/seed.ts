import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ProductRow {
  id: string
  name: string
  openingInventory: number
  procurementQty: number[]
  procurementPrice: number[]
  salesQty: number[]
  salesPrice: number[]
}

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[$,\s]/g, '')) || 0
}

function parseCsv(content: string): ProductRow[] {
  const lines = content.trim().split('\n')
  const products: ProductRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const values = line.split(',')

    if (values.length < 14) continue

    const product: ProductRow = {
      id: values[0].trim(),
      name: values[1].trim(),
      openingInventory: parseInt(values[2]) || 0,
      procurementQty: [
        parseInt(values[3]) || 0,
        parseInt(values[5]) || 0,
        parseInt(values[7]) || 0
      ],
      procurementPrice: [
        parsePrice(values[4]),
        parsePrice(values[6]),
        parsePrice(values[8])
      ],
      salesQty: [
        parseInt(values[9]) || 0,
        parseInt(values[11]) || 0,
        parseInt(values[13]) || 0
      ],
      salesPrice: [
        parsePrice(values[10]),
        parsePrice(values[12]),
        parsePrice(values[14])
      ]
    }

    products.push(product)
  }

  return products
}

async function main() {
  console.log('Starting seed...')

  await prisma.dailyRecord.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  const csvPath = path.join(process.cwd(), 'ProductData.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const products = parseCsv(csvContent)

  console.log(`Found ${products.length} products`)

  for (const product of products) {
    let currentInventory = product.openingInventory

    const dailyRecords = []

    for (let day = 1; day <= 3; day++) {
      const idx = day - 1
      currentInventory = currentInventory + product.procurementQty[idx] - product.salesQty[idx]

      dailyRecords.push({
        day,
        procurementQty: product.procurementQty[idx],
        procurementPrice: product.procurementPrice[idx],
        salesQty: product.salesQty[idx],
        salesPrice: product.salesPrice[idx],
        inventory: currentInventory
      })
    }

    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        openingInventory: product.openingInventory,
        dailyRecords: {
          create: dailyRecords
        }
      }
    })

    console.log(`Created product: ${product.name}`)
  }

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123'
    }
  })

  console.log('Seed completed successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

