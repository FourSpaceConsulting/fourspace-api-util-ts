import {
    ExpressLikeRequest,
    ExpressLikeResponse,
    ExpressLikeRequestHandler,
    ExpressLikeRouterAppender,
    ExpressLikeRouter,
    RouteConfiguration,
    ExpressLikeNextFunction,
} from './express-interface';
import { HTTPClientError } from '../error/http-error';

//#region set up middleware and routes

export const applyMiddleware = (middleware: ExpressLikeRouterAppender[], router: ExpressLikeRouter) => {
    for (const f of middleware) {
        f(router);
    }
};

export const applyRoutes = <TRequest extends ExpressLikeRequest, TResponse extends ExpressLikeResponse>(
    routes: readonly RouteConfiguration<TRequest, TResponse>[],
    router: ExpressLikeRouter
) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        (router as any)[method](path, handler);
    }
};

//#endregion
//#region error response senders

export const sendIfClientError = (err: Error, res: ExpressLikeResponse, next: ExpressLikeNextFunction) => {
    if (err instanceof HTTPClientError) {
        if (process.env.NODE_ENV !== 'test') {
            // console.warn(err);
        }
        res.status(err.statusCode).send(err.message);
    } else {
        next(err);
    }
};

export const sendServerError = (err: Error, res: ExpressLikeResponse, next: ExpressLikeNextFunction) => {
    // console.error('Middleware caught error:', typeof err, err);
    if (process.env.NODE_ENV == null || process.env.NODE_ENV === 'production') {
        res.status(500).send('Internal server error');
    } else {
        res.status(500).send(err.stack);
    }
};

//#region route helpers

/**
 * Sends a 200 response with the result of the request functor
 * @param f
 */
export function sendResult<T>(
    f: (req: ExpressLikeRequest) => Promise<T> | T
): ExpressLikeRequestHandler<ExpressLikeRequest, ExpressLikeResponse> {
    return async (request, response) => {
        const result = await f(request);
        response.status(200).json(result);
    };
}

//#endregion
//#region  --- Parameter and Body value helpers

type RequestValueGetter = (r: ExpressLikeRequest) => string;
export function createParameterGetter(p: string): RequestValueGetter {
    return r => r.params[p];
}
export function createBodyGetter(p: string): RequestValueGetter {
    return r => r.body[p];
}
export function getAuthorizationHeader(r: ExpressLikeRequest): string {
    return r.headers.authorization;
}

//#endregion
