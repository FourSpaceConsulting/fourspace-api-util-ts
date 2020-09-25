import { ExceptionService } from './exception-service';
import {
    ExpressLikeNextFunction,
    ExpressLikeRouter,
    ExpressLikeResponse,
    ExpressLikeRequest,
    ExpressLikeRouterAppender,
} from '../server/express-interface';
import * as ExpressUtil from '../server/express-util';
import { LogFactory, Logger } from 'fourspace-logger-ts';

const LOGGER: Logger = LogFactory.getLogger('error-handlers');


/**
 * These functions handle errors after the API routes have been processed in the middleware.
 * Handling works like this:
 * If we end up in the handleMissingRouteError function, it means the request has not been handled by any
 * existing route (i.e. throw a 404 as the route doesn't exist).
 * If an error has been thrown in any previous middleware or route, then it will be handled by
 * the handleClientError or handleServerError functions depending on the type of the error.
 */
export const createErrorHandlers = (ex: ExceptionService): ExpressLikeRouterAppender[] => {
    // used for when there is no applicable route
    const handleMissingRouteError = (router: ExpressLikeRouter) => {
        router.use((_: ExpressLikeRequest, __: ExpressLikeResponse) => {
            ex.throwRouteNotFound();
        });
    };

    const handleClientError = (router: ExpressLikeRouter) => {
        router.use((err: Error, _: ExpressLikeRequest, res: ExpressLikeResponse, next: ExpressLikeNextFunction) => {
            ExpressUtil.sendIfClientError(err, res, next);
        });
    };

    const handleServerError = (router: ExpressLikeRouter) => {
        router.use((err: Error, _: ExpressLikeRequest, res: ExpressLikeResponse, next: ExpressLikeNextFunction) => {
            LOGGER.debug('Server error: ', err);
            ExpressUtil.sendServerError(err, res, next);
        });
    };
    return [handleMissingRouteError, handleClientError, handleServerError];
};
