import { NextResponse } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * POST /api/ai/insights
 * Generate AI insights from product data
 */
export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'No product data provided' },
        { status: 400 }
      )
    }

    // Prepare data summary for AI
    const dataSummary = products.map((product: any) => {
      const totalSales = product.history.reduce((sum: number, day: any) => sum + day.salesAmount, 0)
      const totalProcurement = product.history.reduce((sum: number, day: any) => sum + day.procurementAmount, 0)
      const inventoryTrend = product.history.map((day: any) => day.inventory)
      
      return {
        name: product.name,
        id: product.id,
        openingInventory: product.openingInventory,
        finalInventory: inventoryTrend[inventoryTrend.length - 1],
        totalSales: totalSales.toFixed(2),
        totalProcurement: totalProcurement.toFixed(2),
        inventoryTrend,
        salesTrend: product.history.map((day: any) => day.salesAmount),
        procurementTrend: product.history.map((day: any) => day.procurementAmount),
      }
    })

    // Create prompt for AI
    const prompt = `You are a retail business analyst. Analyze the following product data and provide concise, actionable insights.

Product Data:
${JSON.stringify(dataSummary, null, 2)}

Please provide:
1. Key trends and patterns (2-3 bullet points)
2. Notable findings or anomalies (1-2 bullet points)
3. Business recommendations (2-3 bullet points)

Keep the response professional, concise, and under 200 words. Use bullet points for clarity.`

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional retail business analyst specializing in inventory and sales analysis. Provide clear, actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const insights = completion.choices[0]?.message?.content || 'Unable to generate insights.'

    return NextResponse.json({
      insights,
      tokensUsed: completion.usage?.total_tokens || 0,
    })
  } catch (error: any) {
    console.error('AI insights error:', error)
    
    // Handle specific OpenAI errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your configuration.' },
        { status: 500 }
      )
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'API rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

