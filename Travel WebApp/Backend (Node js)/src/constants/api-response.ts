import { Response } from "express";
import status from "http-status";

interface ApiResponse<T = any> {
    status: boolean;
    data: T | null;
    message: string | null;
    errorMessage: string  | string[] | null;
}

export const sendResponse = <T>(
    res: Response,
    status: boolean,
    data: T | null = null,
    message: string | null = null,
    errorMessage: string | string[] | null = null,
    httpStatusCode: number 
): void => {
    const response: ApiResponse<T> = {
        status,
        data,
        message,
        errorMessage,
    };

    res.status(httpStatusCode).json(response);
};


export const HTTP_STATUS_CODES = {
    OK: status.OK || 200,
    CREATED: status.CREATED || 201,
    ACCEPTED: status.ACCEPTED || 202,
    NO_CONTENT: status.NO_CONTENT || 204,
    BAD_REQUEST: status.BAD_REQUEST || 400,
    UNAUTHORIZED: status.UNAUTHORIZED || 401,
    FORBIDDEN: status.FORBIDDEN || 403,
    NOT_FOUND: status.NOT_FOUND || 404,
    METHOD_NOT_ALLOWED: status.METHOD_NOT_ALLOWED || 405,
    CONFLICT: status.CONFLICT || 409,
    UNPROCESSABLE_ENTITY: status.UNPROCESSABLE_ENTITY || 422,
    INTERNAL_SERVER_ERROR: status.INTERNAL_SERVER_ERROR || 500,
    NOT_IMPLEMENTED: status.NOT_IMPLEMENTED || 501,
    BAD_GATEWAY: status.BAD_GATEWAY || 502,
    SERVICE_UNAVAILABLE: status.SERVICE_UNAVAILABLE || 503,
    GATEWAY_TIMEOUT: status.GATEWAY_TIMEOUT || 504,
};