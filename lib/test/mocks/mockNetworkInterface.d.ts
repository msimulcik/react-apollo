import { NetworkInterface, Request } from 'apollo-client/networkInterface';
import { GraphQLResult, Document } from 'graphql';
export default function mockNetworkInterface(...mockedResponses: MockedResponse[]): NetworkInterface;
export interface ParsedRequest {
    variables?: Object;
    query?: Document;
    debugName?: string;
}
export interface MockedResponse {
    request: ParsedRequest;
    result?: GraphQLResult;
    error?: Error;
    delay?: number;
    newData?: () => any;
}
export declare class MockNetworkInterface implements NetworkInterface {
    private mockedResponsesByKey;
    constructor(...mockedResponses: MockedResponse[]);
    addMockedReponse(mockedResponse: MockedResponse): void;
    query(request: Request): Promise<{}>;
}
