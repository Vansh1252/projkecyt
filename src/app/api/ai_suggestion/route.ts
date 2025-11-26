import { NextResponse } from 'next/server'
import { OpenAI } from 'openai'

// GET /api/ai_suggestion
export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  const { userInput } = payload
  if (!userInput) {
    return NextResponse.json(
      {
        ok: false,
        message: 'User input is required',
      },
      { status: 400 }
    )
  }
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  const prompt = `You are a financial advisor at Sanay, a UK-based financial services provider specializing in bookkeeping, VAT returns, payroll, management accounts, credit control, budgeting & forecasting, financial analysis, and CFO advisory.

Your role:  
We take business details from the user and send them to you. Your job is to analyse their current setup, workload, turnover, and staff — then recommend the most relevant Sanay services. You must give a business-specific summary, pick 2–4 services, and provide a short explanation.

BUSINESS PROFILE:
- Company: ${userInput.company_name || 'Not specified'}
- Industry: ${userInput.industry || 'Not specified'}
- Annual Turnover Band: ${userInput.annual_turnover_band || 'Not specified'}
- Number of Staff: ${userInput.number_of_staff || 'Not specified'}
- Monthly Transactions: ${userInput.monthly_transactions || 'Not specified'}
- Current Setup: ${userInput.current_setup || 'Not specified'}
- Reporting Frequency: ${userInput.reporting_frequency || 'Not specified'}

-------------------------------------
SERVICE IDs (use ONLY these values):
- "vat-returns"
- "payroll"
- "management-accounts"
- "credit-control"
- "budgeting-forecasting"
- "financial-analysis"
- "CFO Advisory"
-------------------------------------

SERVICE SELECTION RULES:
Choose 2–4 services based on the following logic:

- If monthly_transactions > 150 → include "management-accounts"
- If number_of_staff > 3 → include "payroll"
- If industry includes retail or e-commerce → include "vat-returns"
- If client struggles with late payments / cashflow → include "credit-control"
- If turnover band is £500k–£5m → consider "budgeting-forecasting"
- If turnover > £1m or they want deeper insights → include "financial-analysis"
- If turnover > £2m or they need strategic guidance → include "CFO Advisory"
- If current_setup is manual, messy, or not scalable → prioritise forecasting + analysis

NEVER copy the example values for suggested_services.  
You MUST generate a fresh, context-based recommendation for every user.

-------------------------------------
OUTPUT REQUIREMENTS:
You MUST respond with **valid JSON only**.  
No markdown, no comments, no surrounding backticks.  
Only return the JSON object.

JSON STRUCTURE (values dynamically generated):
{
  "summary": "First line about their current setup and transactions. Second line about potential improvements and savings based on turnover.",
  "suggested_services": ["service-id-1", "service-id-2", "optional-service-id-3"],
  "reasoning": "Why these services were selected based on their business profile."
}
-------------------------------------

Generate your response now.
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a financial advisor at Sanay. Always respond with valid JSON only, no additional text or markdown formatting.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 800,
    response_format: { type: 'json_object' },
  })
  const content = response.choices[0].message.content || '{}'

  try {
    const parsed = JSON.parse(content)
    return NextResponse.json({
      ok: true,
      data: parsed,
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to parse AI response',
        raw: content,
      },
      { status: 500 }
    )
  }
}
