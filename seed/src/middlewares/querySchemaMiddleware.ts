import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors/badRequestError';
import { Schema, z } from 'zod';

export const validateQuerySchema =
  <T extends Schema>(schema: T) =>
  (
    req: Request<any, any, any, z.infer<T>>,
    _res: Response,
    next: NextFunction,
  ) => {
    try {
      req.query = schema.parse(req.query);

      next();
    } catch (error) {
      next(new BadRequestError(error.errors[0].message, error.errors));
    }
  };
