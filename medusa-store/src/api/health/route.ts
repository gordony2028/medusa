import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.status(200).json({
    status: "ok",
    message: "Medusa backend is running",
    timestamp: new Date().toISOString()
  });
}