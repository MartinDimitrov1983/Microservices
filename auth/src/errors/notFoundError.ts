import { CustomError } from "./customError";

export class NotFoundError extends CustomError {
    statusCode=404

    constructor() {
        super('Route not Found')

        Object.setPrototypeOf(this, NotFoundError.prototype)
    }

    serialzeErrors(){
        return [{message: 'Not Found'}]
    }
}