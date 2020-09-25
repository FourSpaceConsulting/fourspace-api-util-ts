import { ExceptionServiceInstance } from '../src/error/exception-service';
import { ExpressLikeResponse } from '../src/server/express-interface';
import { HttpStatus } from '../src/error/http-error';
import * as ExpressUtil from '../src/server/express-util';

describe('Test Error Handler', () => {

    // Mock the response
    const ResponseMocker = jest.fn<ExpressLikeResponse, any>(() => ({
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }));

    test('Test throw client error', async () => {
        // arrange
        const mockResponse = new ResponseMocker();
        // act
        try {
            ExceptionServiceInstance.throwBadRequest();
        } catch (e) {
            ExpressUtil.sendIfClientError(e, mockResponse, () => {
                ExpressUtil.sendServerError(e, mockResponse, null);
            });
        }
        // assert
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BadRequest);
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
        expect(mockResponse.send).toHaveBeenCalledWith('Bad Request');
    });

    test('Test throw client error with message', async () => {
        // arrange
        const mockResponse = new ResponseMocker();
        // act
        try {
            ExceptionServiceInstance.throwForbidden('Test Message');
        } catch (e) {
            ExpressUtil.sendIfClientError(e, mockResponse, () => {
                ExpressUtil.sendServerError(e, mockResponse, null);
            });
        }
        // assert
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.Forbidden);
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
        expect(mockResponse.send).toHaveBeenCalledWith('Test Message');
    });


    test('Test throw non-client error', async () => {
        // arrange
        const mockResponse = new ResponseMocker();
        // act
        let error: Error = new Error('Test Error');
        try {
            throw error;
        } catch (e) {
            ExpressUtil.sendIfClientError(e, mockResponse, () => {
                ExpressUtil.sendServerError(e, mockResponse, null);
            });
        }
        // assert
        expect(mockResponse.status).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.InternalServer);
        expect(mockResponse.send).toHaveBeenCalledTimes(1);
        expect(mockResponse.send).toHaveBeenCalledWith(error.stack);
    });


});

