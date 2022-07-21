export interface ShareModel {
    id?: string;
    code: string;
    language: string;
    secure: boolean;
    secret?: string;
    requested?: Date;
}

export type CloudFunctionHttpEvent = {
    httpMethod: HttpMethod;
    headers: { [name: string]: string };
    params: { [name: string]: string };
    pathParams: { [name: string]: string };
    multiValueParams: { [name: string]: string[] };
    multiValueHeaders: { [name: string]: string[] };
    queryStringParameters: { [name: string]: string };
    multiValueQueryStringParameters: { [name: string]: string[] };
    requestContext: {
        identity: {
            sourceIp: string;
            userAgent: string;
        };
        httpMethod: HttpMethod;
        requestId: string;
        requestTime: string;
        requestTimeEpoch: number;
    };
    body: string;
    isBase64Encoded: boolean;
    path: string;
    url: string;
};

export type CloudFunctionContext = {
    awsRequestId: string;
    requestId: string;
    invokedFunctionArn: string;
    functionName: string;
    functionVersion: string;
    memoryLimitInMB: string;
    deadlineMs: number;
    logGroupName: string;
};