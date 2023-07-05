import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/badRequestError';
import { Schema, z } from 'zod';

export const validateParamsSchema =
  <T extends Schema>(schema: T) =>
  (req: Request<z.infer<T>>, _res: Response, next: NextFunction) => {
    try {
      req.params = schema.parse(req.params);

      next();
    } catch (error) {
      next(new BadRequestError(error.errors[0].message, error.errors));
    }
  };
