"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var React = require('react');
var chai = require('chai');
var graphql_tag_1 = require('graphql-tag');
var expect = chai.expect;
var graphql_1 = require('../../../../src/graphql');
var sampleOperation = (_a = ["{ user { name } }"], _a.raw = ["{ user { name } }"], graphql_tag_1.default(_a));
describe('statics', function () {
    it('should be preserved', function () {
        var ApolloContainer = (function (_super) {
            __extends(ApolloContainer, _super);
            function ApolloContainer() {
                _super.apply(this, arguments);
            }
            ApolloContainer.veryStatic = 'such global';
            ApolloContainer = __decorate([
                graphql_1.default(sampleOperation)
            ], ApolloContainer);
            return ApolloContainer;
        }(React.Component));
        ;
        expect(ApolloContainer.veryStatic).to.eq('such global');
    });
    it('exposes a debuggable displayName', function () {
        var ApolloContainer = (function (_super) {
            __extends(ApolloContainer, _super);
            function ApolloContainer() {
                _super.apply(this, arguments);
            }
            ApolloContainer = __decorate([
                graphql_1.default(sampleOperation)
            ], ApolloContainer);
            return ApolloContainer;
        }(React.Component));
        expect(ApolloContainer.displayName).to.eq('Apollo(ApolloContainer)');
    });
    it('honors custom display names', function () {
        var ApolloContainer = (function (_super) {
            __extends(ApolloContainer, _super);
            function ApolloContainer() {
                _super.apply(this, arguments);
            }
            ApolloContainer.displayName = 'Foo';
            ApolloContainer = __decorate([
                graphql_1.default(sampleOperation)
            ], ApolloContainer);
            return ApolloContainer;
        }(React.Component));
        expect(ApolloContainer.displayName).to.eq('Apollo(Foo)');
    });
});
var _a;
//# sourceMappingURL=statics.js.map