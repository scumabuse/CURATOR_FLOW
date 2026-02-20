import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { screenshotBase64, studentName, taskTitle } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === 'your-api-key-here') {
      console.error('[vision] GEMINI_API_KEY not configured')
      return NextResponse.json({
        approved: false,
        confidence: 0,
        reason: 'Vision AI не настроен — добавьте GEMINI_API_KEY в переменные окружения'
      })
    }

    if (!screenshotBase64) {
      return NextResponse.json({ approved: false, reason: 'Скриншот не загружен' }, { status: 400 })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: screenshotBase64
                }
              },
              {
                text: `Ты — система проверки заданий в колледже.
Студент: "${studentName}"
Задание: "${taskTitle}"

Проанализируй скриншот и ответь ТОЛЬКО в формате JSON без лишнего текста:
{
  "approved": true,
  "confidence": 0,
  "studentNameFound": true,
  "taskCompleted": true,
  "reason": "краткое объяснение на русском"
}`
              }
            ]
          }]
        })
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('[vision] Gemini API error:', response.status, errText)
      return NextResponse.json({
        approved: false,
        confidence: 0,
        reason: `Ошибка Gemini API (${response.status})`
      })
    }

    const data = await response.json()
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    const clean = text.replace(/```json|```/g, '').trim()

    try {
      const result = JSON.parse(clean)
      return NextResponse.json(result)
    } catch {
      console.error('[vision] Failed to parse AI response:', clean)
      return NextResponse.json({
        approved: false,
        confidence: 0,
        reason: 'AI не смог обработать скриншот — отправлено на ручную проверку'
      })
    }
  } catch (e: any) {
    console.error('[vision] Error:', e?.message || e)
    return NextResponse.json({
      approved: false,
      confidence: 0,
      reason: 'Ошибка проверки — задание отправлено на ручную проверку куратору'
    })
  }
}