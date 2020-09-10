//#region --- Express Like interfaces
//        --- These allow us to write express compatible code without actually having to import express
export interface ExpressLikeParamsDictionary {
    [key: string]: string;
}
export interface ExpressLikeNextFunction {
    // tslint:disable-next-line callable-types (In ts2.1 it thinks the type alias has no call signatures)
    (err?: any): void;
}
export interface ExpressLikeRequest {
    headers: ExpressLikeIncomingHttpHeaders;
    securityContext?: { isAuthenticated: boolean };
    params: ExpressLikeParamsDictionary;
    body: any;
}
export interface ExpressLikeResponse {
    status(code: number): this;
    json(o: any): this;
    send(o: any): this;
}
export interface ExpressLikeIncomingHttpHeaders {
    authorization?: string;
}
export type ExpressLikeRouter = any;
export type ExpressLikeRouterAppender = (router: ExpressLikeRouter) => void;

//#endregion
//#region --- Route Configuration

export enum ApiMethod {
    GET = 'get',
    POST = 'post',
}

/**
 * Handler for express routes
 */
export type ExpressLikeRequestHandler<TRequest extends ExpressLikeRequest, TResponse extends ExpressLikeResponse> = (
    req: TRequest,
    res: TResponse,
    next: ExpressLikeNextFunction
) => Promise<void> | void;

/**
 * Handler for express error routes
 */
export type ExpressLikeErrorRequestHandler<TRequest extends ExpressLikeRequest, TResponse extends ExpressLikeResponse> = (
    err: any,
    req: TRequest,
    res: TResponse,
    next: ExpressLikeNextFunction
) => Promise<void> | void;

/**
 * Configuration for an express route
 */
export type RouteConfiguration<TRequest extends ExpressLikeRequest, TResponse extends ExpressLikeResponse> = {
    path: string;
    method: string;
    handler: ExpressLikeRequestHandler<TRequest, TResponse> | ExpressLikeRequestHandler<TRequest, TResponse>[];
};
//#endregion
