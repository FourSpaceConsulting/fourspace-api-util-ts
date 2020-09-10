/**
 * Status codes
 */
export enum HttpStatus {
    BadRequest = 400,
    Unauthenticated = 401,
    Forbidden = 403,
    NotFound = 404,
    ResourceConflict = 409,
    InternalServer = 500,
}

/**
 * HTTP client error
 */
export class HTTPClientError extends Error {
    readonly statusCode!: number;
    readonly name!: string;

    constructor(statusCode: number, message: object | string) {
        // call super constructor
        if (message instanceof Object) {
            super(JSON.stringify(message));
        } else {
            super(message);
        }
        // set the prototype explicitly
        // (https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work)
        Object.setPrototypeOf(this, HTTPClientError.prototype);
        // set locals
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
