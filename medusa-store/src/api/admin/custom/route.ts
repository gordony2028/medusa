import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';

export function GET(_req: MedusaRequest, res: MedusaResponse) {
  res.sendStatus(200);
}
