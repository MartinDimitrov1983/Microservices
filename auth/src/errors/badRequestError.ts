import { CustomError } from './customError';

export class BadRequestError extends CustomError {
    statusCode = 400;

    constructor(public message: string) {
        super(message);

        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serialzeErrors() {
        return [{ message: this.message }];
    }
}
