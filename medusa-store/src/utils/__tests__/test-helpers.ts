import { MedusaRequest, MedusaResponse } from '@medusajs/framework';

/**
 * Creates a mock MedusaRequest object for testing
 */
export function createMockRequest(
  overrides?: Partial<MedusaRequest>
): MedusaRequest {
  return {
    method: 'GET',
    url: '/test',
    headers: {},
    query: {},
    params: {},
    body: {},
    ...overrides,
  } as MedusaRequest;
}

/**
 * Creates a mock MedusaResponse object for testing
 */
export function createMockResponse(): MedusaResponse & {
  jsonData?: unknown;
  statusCode?: number;
} {
  const res = {
    statusCode: undefined as number | undefined,
    jsonData: undefined as unknown,
    status: jest.fn().mockImplementation(function (
      this: typeof res,
      code: number
    ) {
      this.statusCode = code;
      return this;
    }),
    json: jest.fn().mockImplementation(function (
      this: typeof res,
      data: unknown
    ) {
      this.jsonData = data;
      return this;
    }),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    getHeader: jest.fn(),
    removeHeader: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
  };

  return res as MedusaResponse & typeof res;
}

/**
 * Creates a mock service for testing
 */
export function createMockService<T>(
  serviceName: string,
  methods: Partial<T>
): T {
  return {
    __type: serviceName,
    ...methods,
  } as T;
}

/**
 * Waits for all promises to resolve
 */
export function flushPromises(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

/**
 * Creates a test database connection mock
 */
export function createMockDatabase() {
  return {
    transaction: jest
      .fn()
      .mockImplementation((cb: (manager: unknown) => unknown) => {
        const mockManager = {
          save: jest.fn(),
          remove: jest.fn(),
          find: jest.fn(),
          findOne: jest.fn(),
        };
        return cb(mockManager);
      }),
  };
}
