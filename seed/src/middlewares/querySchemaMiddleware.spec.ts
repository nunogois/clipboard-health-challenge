import { Request, Response } from 'express';
import { validateQuerySchema } from './querySchemaMiddleware';
import { z } from 'zod';

describe('validateQuerySchema', () => {
  it('should call next for a valid request with matching query schema', () => {
    const schema = z.object({
      id: z.number({ coerce: true }),
      name: z.string(),
    });

    const middleware = validateQuerySchema(schema);

    const req = {
      query: {
        id: '123',
        name: 'John Doe',
      },
    } as unknown as Request<any, any, any, z.infer<typeof schema>>;
    const res = {} as Response;
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.query).toEqual({
      id: 123,
      name: 'John Doe',
    });
  });
});
