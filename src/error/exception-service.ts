import { HTTPClientError, HttpStatus } from './http-error';

export interface ExceptionService {
    throwUnauthenticated(message?: string): void;
    throwForbidden(message?: string): void;
    throwBadRequest(message?: string): void;
    throwInternalServer(message?: string): void;
    throwResourceConflict(message?: string): void;
    throwRouteNotFound(message?: string): void;
    throwResourceNotFound(message?: string): void;
}

/**
 * Create exception service singleton
 */
export const ExceptionServiceInstance: ExceptionService = new (class {
    public throwUnauthenticated(message?: string): void {
        throw new HTTPClientError(HttpStatus.Unauthenticated, message == null ? 'Unauthenticated' : message);
    }

    public throwForbidden(message?: string): void {
        throw new HTTPClientError(HttpStatus.Forbidden, message == null ? 'Forbidden' : message);
    }

    public throwBadRequest(message?: string): void {
        throw new HTTPClientError(HttpStatus.BadRequest, message == null ? 'Bad Request' : message);
    }

    public throwInternalServer(message?: string): void {
        throw new HTTPClientError(HttpStatus.InternalServer, message == null ? 'Internal Server Error' : message);
    }

    public throwResourceConflict(message?: string): void {
        throw new HTTPClientError(HttpStatus.ResourceConflict, message == null ? 'Resource Conflict' : message);
    }

    public throwRouteNotFound(message?: string): void {
        throw new HTTPClientError(HttpStatus.NotFound, message == null ? 'Method not found' : message);
    }

    public throwResourceNotFound(message?: string): void {
        throw new HTTPClientError(HttpStatus.NotFound, message == null ? 'Resource not found' : message);
    }
})();
