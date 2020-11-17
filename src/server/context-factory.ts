import { ExpressLikeNextFunction, ExpressLikeRequest } from './express-interface';

/**
 * Continuation-Local Storage context factory
 */
export interface ClsContextFactory<R extends ExpressLikeRequest> {
    createContext(r: R, next: ExpressLikeNextFunction): void;
}
