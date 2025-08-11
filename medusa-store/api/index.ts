import { VercelRequest, VercelResponse } from "@vercel/node"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')

    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }

    // Simple health check endpoint
    if (req.url === '/health') {
      return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
    }

    // For now, return a simple response - we'll expand this once the DB is connected
    return res.status(200).json({ 
      message: 'Medusa API is running',
      path: req.url,
      method: req.method
    })

  } catch (error) {
    console.error("Error in Medusa handler:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}