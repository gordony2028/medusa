import { MedusaRequest, MedusaResponse } from '@medusajs/framework';
import { GET } from '../route';

describe('Health Check Endpoint', () => {
  let req: Partial<MedusaRequest>;
  let res: Partial<MedusaResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    req = {};
    res = {
      status: statusMock,
    };
  });

  it('should return 200 with health status', () => {
    GET(req as MedusaRequest, res as MedusaResponse);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        message: 'Medusa backend is running',
        timestamp: expect.any(String) as string,
      })
    );
  });

  it('should include valid ISO timestamp', () => {
    GET(req as MedusaRequest, res as MedusaResponse);

    const calls = jsonMock.mock.calls as Array<
      [{ status: string; message: string; timestamp: string }]
    >;
    const callArg = calls[0][0];
    const timestamp = new Date(callArg.timestamp);

    expect(timestamp.toISOString()).toBe(callArg.timestamp);
    expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
  });
});
