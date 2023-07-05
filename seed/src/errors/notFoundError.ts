import { HttpError } from './httpError';

export class NotFoundError extends HttpError {
  constructor(message = 'Not found') {
    super(message, 404);
  }
}
