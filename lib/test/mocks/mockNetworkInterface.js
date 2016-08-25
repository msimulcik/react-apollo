"use strict";
var graphql_1 = require('graphql');
function mockNetworkInterface() {
    var mockedResponses = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        mockedResponses[_i - 0] = arguments[_i];
    }
    return new (MockNetworkInterface.bind.apply(MockNetworkInterface, [void 0].concat(mockedResponses)))();
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mockNetworkInterface;
var MockNetworkInterface = (function () {
    function MockNetworkInterface() {
        var _this = this;
        var mockedResponses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            mockedResponses[_i - 0] = arguments[_i];
        }
        this.mockedResponsesByKey = {};
        mockedResponses.forEach(function (mockedResponse) {
            _this.addMockedReponse(mockedResponse);
        });
    }
    MockNetworkInterface.prototype.addMockedReponse = function (mockedResponse) {
        var key = requestToKey(mockedResponse.request);
        var mockedResponses = this.mockedResponsesByKey[key];
        if (!mockedResponses) {
            mockedResponses = [];
            this.mockedResponsesByKey[key] = mockedResponses;
        }
        mockedResponses.push(mockedResponse);
    };
    MockNetworkInterface.prototype.query = function (request) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var parsedRequest = {
                query: request.query,
                variables: request.variables,
                debugName: request.debugName,
            };
            var key = requestToKey(parsedRequest);
            if (!_this.mockedResponsesByKey[key]) {
                throw new Error('No more mocked responses for the query: ' + graphql_1.print(request.query));
            }
            var original = _this.mockedResponsesByKey[key].slice();
            var _a = _this.mockedResponsesByKey[key].shift() || {}, result = _a.result, error = _a.error, delay = _a.delay, newData = _a.newData;
            if (newData) {
                original[0].result = newData();
                _this.mockedResponsesByKey[key].push(original[0]);
            }
            if (!result && !error) {
                throw new Error("Mocked response should contain either result or error: " + key);
            }
            setTimeout(function () {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            }, delay ? delay : 1);
        });
    };
    return MockNetworkInterface;
}());
exports.MockNetworkInterface = MockNetworkInterface;
function requestToKey(request) {
    var queryString = request.query && graphql_1.print(request.query);
    return JSON.stringify({
        variables: request.variables,
        debugName: request.debugName,
        query: queryString,
    });
}
//# sourceMappingURL=mockNetworkInterface.js.map