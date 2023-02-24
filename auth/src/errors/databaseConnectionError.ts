import { CustomError } from './customError';

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    reason = 'Error connecting to database';

    constructor() {
        super('Error connecting to db');

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serialzeErrors() {
        return [{ message: this.reason }];
    }
}
