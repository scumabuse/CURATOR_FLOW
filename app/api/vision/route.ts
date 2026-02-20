import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { screenshotBase64, studentName, taskTitle } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY as string
    if (!apiKey) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

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

    const data = await response.json()
    const text: string = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ approved: false, reason: 'Ошибка проверки' }, { status: 500 })
  }
}