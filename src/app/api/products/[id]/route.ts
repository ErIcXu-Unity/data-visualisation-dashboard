import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const product = await prisma.product.findFirst({
      where: { 
        id,
        userId: session.user.id
      },
      include: {
        dailyRecords: {
          orderBy: {
            day: 'asc'
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const formattedData = {
      id: product.id,
      name: product.name,
      openingInventory: product.openingInventory,
      history: product.dailyRecords.map(record => ({
        day: record.day,
        inventory: record.inventory,
        procurementAmount: record.procurementQty * record.procurementPrice,
        salesAmount: record.salesQty * record.salesPrice,
        procurementQty: record.procurementQty,
        procurementPrice: record.procurementPrice,
        salesQty: record.salesQty,
        salesPrice: record.salesPrice
      }))
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error('Failed to fetch product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

