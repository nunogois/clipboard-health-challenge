import { HttpError } from './httpError';

export class BadRequestError extends HttpError {
  details: any;
  constructor(message = 'Bad request', details?: any) {
    super(message, 400);
    this.details = details;
  }
}
