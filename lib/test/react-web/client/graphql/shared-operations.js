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
var TestUtils = require('react-addons-test-utils');
var apollo_client_1 = require('apollo-client');
var chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());
var expect = chai.expect;
var mockNetworkInterface_1 = require('../../../mocks/mockNetworkInterface');
var components_1 = require('../../../mocks/components');
var graphql_1 = require('../../../../src/graphql');
describe('shared opertations', function () {
    describe('withApollo', function () {
        it('passes apollo-client to props', function () {
            var client = new apollo_client_1.default();
            var ContainerWithData = (function (_super) {
                __extends(ContainerWithData, _super);
                function ContainerWithData() {
                    _super.apply(this, arguments);
                }
                ContainerWithData.prototype.render = function () {
                    expect(this.props.client).to.deep.equal(client);
                    return null;
                };
                ContainerWithData = __decorate([
                    graphql_1.withApollo
                ], ContainerWithData);
                return ContainerWithData;
            }(React.Component));
            enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        });
    });
    it('binds two queries to props', function () {
        var peopleQuery = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var peopleData = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var shipsQuery = (_b = ["query ships { allships(first: 1) { ships { name } } }"], _b.raw = ["query ships { allships(first: 1) { ships { name } } }"], graphql_tag_1.default(_b));
        var shipsData = { allships: { ships: [{ name: 'Tie Fighter' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: peopleQuery }, result: { data: peopleData } }, { request: { query: shipsQuery }, result: { data: shipsData } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var withPeople = graphql_1.default(peopleQuery, { name: 'people' });
        var withShips = graphql_1.default(shipsQuery, { name: 'ships' });
        var ContainerWithData = (function (_super) {
            __extends(ContainerWithData, _super);
            function ContainerWithData() {
                _super.apply(this, arguments);
            }
            ContainerWithData.prototype.render = function () {
                var _a = this.props, people = _a.people, ships = _a.ships;
                expect(people).to.exist;
                expect(people.loading).to.be.true;
                expect(ships).to.exist;
                expect(ships.loading).to.be.true;
                return null;
            };
            ContainerWithData = __decorate([
                withPeople,
                withShips
            ], ContainerWithData);
            return ContainerWithData;
        }(React.Component));
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        wrapper.unmount();
        var _a, _b;
    });
    it('binds two queries to props with different syntax', function () {
        var peopleQuery = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var peopleData = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var shipsQuery = (_b = ["query ships { allships(first: 1) { ships { name } } }"], _b.raw = ["query ships { allships(first: 1) { ships { name } } }"], graphql_tag_1.default(_b));
        var shipsData = { allships: { ships: [{ name: 'Tie Fighter' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: peopleQuery }, result: { data: peopleData } }, { request: { query: shipsQuery }, result: { data: shipsData } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var withPeople = graphql_1.default(peopleQuery, { name: 'people' });
        var withShips = graphql_1.default(shipsQuery, { name: 'ships' });
        var ContainerWithData = withPeople(withShips(function (props) {
            var people = props.people, ships = props.ships;
            expect(people).to.exist;
            expect(people.loading).to.be.true;
            expect(ships).to.exist;
            expect(ships.loading).to.be.true;
            return null;
        }));
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        wrapper.unmount();
        var _a, _b;
    });
    it('binds two operations to props', function () {
        var peopleQuery = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var peopleData = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var peopleMutation = (_b = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], _b.raw = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_b));
        var peopleMutationData = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: peopleQuery }, result: { data: peopleData } }, { request: { query: peopleMutation }, result: { data: peopleMutationData } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var withPeople = graphql_1.default(peopleQuery, { name: 'people' });
        var withPeopleMutation = graphql_1.default(peopleMutation, { name: 'addPerson' });
        var ContainerWithData = (function (_super) {
            __extends(ContainerWithData, _super);
            function ContainerWithData() {
                _super.apply(this, arguments);
            }
            ContainerWithData.prototype.render = function () {
                var _a = this.props, people = _a.people, addPerson = _a.addPerson;
                expect(people).to.exist;
                expect(people.loading).to.be.true;
                expect(addPerson).to.exist;
                return null;
            };
            ContainerWithData = __decorate([
                withPeople,
                withPeopleMutation
            ], ContainerWithData);
            return ContainerWithData;
        }(React.Component));
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        wrapper.unmount();
        var _a, _b;
    });
    it('allows a way to access the wrapped component instance', function () {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var testData = { foo: 'bar' };
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.someMethod = function () {
                return testData;
            };
            Container.prototype.render = function () {
                return React.createElement("span", null);
            };
            return Container;
        }(React.Component));
        var Decorated = graphql_1.default(query, { withRef: true })(Container);
        var tree = TestUtils.renderIntoDocument(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Decorated, null)));
        var decorated = TestUtils.findRenderedComponentWithType(tree, Decorated);
        expect(function () { return decorated.someMethod(); }).to.throw();
        expect(decorated.getWrappedInstance().someMethod()).to.deep.equal(testData);
        expect(decorated.refs.wrappedInstance.someMethod()).to.deep.equal(testData);
        var _a;
    });
    it('allows options to take an object', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var queryExecuted;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                queryExecuted = true;
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, { options: { skip: true } })
            ], Container);
            return Container;
        }(React.Component));
        ;
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        setTimeout(function () {
            if (!queryExecuted) {
                done();
                return;
            }
            done(new Error('query ran even though skip present'));
        }, 25);
        var _a;
    });
});
//# sourceMappingURL=shared-operations.js.map