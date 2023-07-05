import { Request, Response, NextFunction } from 'express';
import { errorMiddleware } from '../middlewares/errorMiddleware';
import { HttpError } from '../errors/httpError';
import { NotFoundError } from '../errors/notFoundError';
import { BadRequestError } from '../errors/badRequestError';

describe('errorMiddleware', () => {
  it('should send JSON response with appropriate status code and error message for HttpError instance', () => {
    const error = new HttpError("I'm a teapot", 418);
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ error: "I'm a teapot" });
  });
  it('should send JSON response with appropriate status code and error message for NotFoundError instance', () => {
    const error = new NotFoundError();
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
  });
  it('should send JSON response with appropriate status code and error message for BadRequestError instance', () => {
    const error = new BadRequestError();
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad request' });
  });
});
