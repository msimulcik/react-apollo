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
var enzyme_1 = require('enzyme');
var graphql_tag_1 = require('graphql-tag');
var apollo_client_1 = require('apollo-client');
var chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());
var expect = chai.expect;
var mockNetworkInterface_1 = require('../../../mocks/mockNetworkInterface');
var components_1 = require('../../../mocks/components');
var graphql_1 = require('../../../../src/graphql');
describe('fragments', function () {
    it('throws if you only pass a fragment', function (done) {
        var query = (_a = ["\n      fragment Failure on PeopleConnection { people { name } }\n    "], _a.raw = ["\n      fragment Failure on PeopleConnection { people { name } }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        try {
            var Container = (function (_super) {
                __extends(Container, _super);
                function Container() {
                    _super.apply(this, arguments);
                }
                Container.prototype.componentWillReceiveProps = function (props) {
                    expect(props.data.loading).to.be.false;
                    expect(props.data.allPeople).to.deep.equal(data.allPeople);
                    done();
                };
                Container.prototype.render = function () {
                    return null;
                };
                Container = __decorate([
                    graphql_1.default(query)
                ], Container);
                return Container;
            }(React.Component));
            ;
            enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
            done(new Error('This should throw'));
        }
        catch (e) {
            done();
        }
        var _a;
    });
    it('correctly fetches a query with inline fragments', function (done) {
        var query = (_a = ["\n      query people { allPeople(first: 1) { ...person } }\n      fragment person on PeopleConnection { people { name } }\n    "], _a.raw = ["\n      query people { allPeople(first: 1) { ...person } }\n      fragment person on PeopleConnection { people { name } }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                expect(props.data.loading).to.be.false;
                expect(props.data.allPeople).to.deep.equal(data.allPeople);
                done();
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query)
            ], Container);
            return Container;
        }(React.Component));
        ;
        expect(Container.fragments.length).to.equal(1);
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        var _a;
    });
    it('correctly merges a query with inline fragments and passed fragments', function (done) {
        var query = (_a = ["\n      query peopleAndShips {\n        allPeople(first: 1) { ...Person }\n        allShips(first: 1) { ...ships }\n      }\n      fragment Person on PeopleConnection { people { name } }\n    "], _a.raw = ["\n      query peopleAndShips {\n        allPeople(first: 1) { ...Person }\n        allShips(first: 1) { ...ships }\n      }\n      fragment Person on PeopleConnection { people { name } }\n    "], graphql_tag_1.default(_a));
        var shipFragment = apollo_client_1.createFragment((_b = ["\n      fragment ships on ShipsConnection { starships { name } }\n    "], _b.raw = ["\n      fragment ships on ShipsConnection { starships { name } }\n    "], graphql_tag_1.default(_b)));
        var mockedQuery = (_c = ["\n      query peopleAndShips {\n        allPeople(first: 1) { ...Person }\n        allShips(first: 1) { ...ships }\n      }\n      fragment Person on PeopleConnection { people { name } }\n      fragment ships on ShipsConnection { starships { name } }\n    "], _c.raw = ["\n      query peopleAndShips {\n        allPeople(first: 1) { ...Person }\n        allShips(first: 1) { ...ships }\n      }\n      fragment Person on PeopleConnection { people { name } }\n      fragment ships on ShipsConnection { starships { name } }\n    "], graphql_tag_1.default(_c));
        var data = {
            allPeople: { people: [{ name: 'Luke Skywalker' }] },
            allShips: { starships: [{ name: 'CR90 corvette' }] },
        };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: mockedQuery }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                expect(props.data.loading).to.be.false;
                expect(props.data.allPeople).to.deep.equal(data.allPeople);
                expect(props.data.allShips).to.deep.equal(data.allShips);
                done();
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, {
                    options: function () { return ({ fragments: [shipFragment] }); }
                })
            ], Container);
            return Container;
        }(React.Component));
        ;
        expect(Container.fragments.length).to.equal(1);
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        var _a, _b, _c;
    });
    it('correctly allows for passed fragments', function (done) {
        var query = (_a = ["\n      query ships { allShips(first: 1) { ...Ships } }\n    "], _a.raw = ["\n      query ships { allShips(first: 1) { ...Ships } }\n    "], graphql_tag_1.default(_a));
        var shipFragment = apollo_client_1.createFragment((_b = ["\n      fragment Ships on ShipsConnection { starships { name } }\n    "], _b.raw = ["\n      fragment Ships on ShipsConnection { starships { name } }\n    "], graphql_tag_1.default(_b)));
        var mockedQuery = (_c = ["\n      query ships { allShips(first: 1) { ...Ships } }\n      fragment Ships on ShipsConnection { starships { name } }\n    "], _c.raw = ["\n      query ships { allShips(first: 1) { ...Ships } }\n      fragment Ships on ShipsConnection { starships { name } }\n    "], graphql_tag_1.default(_c));
        var data = {
            allShips: { starships: [{ name: 'CR90 corvette' }] },
        };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: mockedQuery }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                expect(props.data.loading).to.be.false;
                expect(props.data.allShips).to.deep.equal(data.allShips);
                done();
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, {
                    options: function () { return ({ fragments: [shipFragment] }); },
                })
            ], Container);
            return Container;
        }(React.Component));
        ;
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        var _a, _b, _c;
    });
});
//# sourceMappingURL=fragments.js.map