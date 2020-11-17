/**
 * Continuation-Local Storage context provider
 */
export interface ClsContextProvider<C> {
    getContext(): C;
}
