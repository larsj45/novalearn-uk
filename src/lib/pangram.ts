const PANGRAM_API_URL = 'https://text.api.pangramlabs.com/v3'

export interface PangramResult {
  ai_likelihood: number
  detected_model?: string
  sentences?: Array<{
    text: string
    ai_likelihood: number
    detected_model?: string
  }>
}

export async function detectAI(text: string): Promise<PangramResult> {
  const apiKey = process.env.PANGRAM_API_KEY
  if (!apiKey) {
    throw new Error('PANGRAM_API_KEY is not configured')
  }

  const response = await fetch(PANGRAM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Pangram API error: ${response.status} - ${err}`)
  }

  return response.json()
}
