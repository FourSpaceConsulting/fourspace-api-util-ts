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
        res.status(err.statusCode).send(err.message);
    } else {
        next(err);
    }
};

export const sendServerError = (err: Error, res: ExpressLikeResponse, next: ExpressLikeNextFunction) => {
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
export function sendResult<R extends ExpressLikeRequest, T>(
    f: (req: R) => Promise<T> | T
): ExpressLikeRequestHandler<R, ExpressLikeResponse> {
    return async (request, response) => {
        const result = await f(request);
        response.status(200).json(result);
    };
}

//#endregion
//#region  --- Request handler decorator functions

/**
 * create a new handler that performs an action before the supplied handler is executed
 * @param requestHandler handler
 * @param action pre action
 */
export function preHandle<TRequest extends ExpressLikeRequest, TResponse extends ExpressLikeResponse>(
    requestHandler: ExpressLikeRequestHandler<TRequest, TResponse>,
    action: ExpressLikeRequestHandler<TRequest, TResponse>
): ExpressLikeRequestHandler<TRequest, TResponse> {
    return (req, res, next) => {
        action(req, res, () => {
            requestHandler(req, res, next);
        });
    };
}

/**
 * create a new handler that performs an action after the supplied handler is executed
 * @param requestHandler
 * @param action
 */
export function postHandle<TRequest extends ExpressLikeRequest, TResponse extends ExpressLikeResponse>(
    requestHandler: ExpressLikeRequestHandler<TRequest, TResponse>,
    action: ExpressLikeRequestHandler<TRequest, TResponse>
): ExpressLikeRequestHandler<TRequest, TResponse> {
    return (req, res, next) => {
        requestHandler(req, res, () => {
            action(req, res, next);
        });
    };
}

/**
 * Decorate a handler with pre and/or post actions
 * @param handler to decorate
 * @param preHandler pre action (nullable)
 * @param postHandler post action (nullable)
 */
export function decorateHandler<TRequest extends ExpressLikeRequest, TResponse extends ExpressLikeResponse>(
    handler: ExpressLikeRequestHandler<TRequest, TResponse>,
    preHandler: ExpressLikeRequestHandler<TRequest, TResponse>,
    postHandler: ExpressLikeRequestHandler<TRequest, TResponse>
) {
    const step = preHandler == null ? handler : preHandle(handler, preHandler);
    return postHandler == null ? step : postHandle(step, postHandler);
}

//#endregion
//#region  --- Parameter and Body value helpers

export type RequestValueGetter = (r: ExpressLikeRequest) => string;
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
