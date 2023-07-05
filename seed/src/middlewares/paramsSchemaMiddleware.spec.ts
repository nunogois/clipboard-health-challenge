import { Request, Response } from 'express';
import { validateParamsSchema } from './paramsSchemaMiddleware';
import { z } from 'zod';

describe('validateParamsSchema', () => {
  it('should call next for a valid request with matching params schema', () => {
    const schema = z.object({
      id: z.number({ coerce: true }),
      name: z.string(),
    });

    const middleware = validateParamsSchema(schema);

    const req = {
      params: {
        id: '123',
        name: 'John Doe',
      },
    } as unknown as Request<z.infer<typeof schema>>;
    const res = {} as Response;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.params).toEqual({
      id: 123,
      name: 'John Doe',
    });
  });
});
