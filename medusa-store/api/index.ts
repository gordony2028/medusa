import { createMedusaApp } from "@medusajs/framework";
import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export default async function handler(req: MedusaRequest, res: MedusaResponse) {
  try {
    const app = await createMedusaApp();
    return app(req, res);
  } catch (error) {
    console.error("Error initializing Medusa:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}