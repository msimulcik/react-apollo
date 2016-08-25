"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var chai = require('chai');
var enzyme_1 = require('enzyme');
var redux_1 = require('redux');
var chaiEnzyme = require('chai-enzyme');
var TestUtils = require('react-addons-test-utils');
chai.use(chaiEnzyme());
var expect = chai.expect;
var apollo_client_1 = require('apollo-client');
var ApolloProvider_1 = require('../../../src/ApolloProvider');
describe('<ApolloProvider /> Component', function () {
    var Child = (function (_super) {
        __extends(Child, _super);
        function Child() {
            _super.apply(this, arguments);
        }
        Child.prototype.render = function () {
            return React.createElement("div", null);
        };
        Child.contextTypes = {
            client: React.PropTypes.object.isRequired,
            store: React.PropTypes.object.isRequired,
        };
        return Child;
    }(React.Component));
    var client = new apollo_client_1.default();
    var store = redux_1.createStore(function () { return ({}); });
    it('should render children components', function () {
        var wrapper = enzyme_1.shallow(React.createElement(ApolloProvider_1.default, {store: store, client: client}, React.createElement("div", {className: 'unique'})));
        expect(wrapper.contains(React.createElement("div", {className: 'unique'}))).to.equal(true);
    });
    it('should require a client', function () {
        expect(function () {
            enzyme_1.shallow(React.createElement(ApolloProvider_1.default, {client: undefined}, React.createElement("div", {className: 'unique'})));
        }).to.throw('ApolloClient was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
    });
    it('should not require a store', function () {
        var wrapper = enzyme_1.shallow(React.createElement(ApolloProvider_1.default, {client: client}, React.createElement("div", {className: 'unique'})));
        expect(wrapper.contains(React.createElement("div", {className: 'unique'}))).to.equal(true);
    });
    it('should throw if rendered without a child component', function () {
        try {
            enzyme_1.shallow(React.createElement(ApolloProvider_1.default, {store: store, client: client}));
        }
        catch (e) {
            expect(e).to.be.instanceof(Error);
        }
    });
    it('should add the client to the child context', function () {
        var tree = TestUtils.renderIntoDocument(React.createElement(ApolloProvider_1.default, {store: store, client: client}, React.createElement(Child, null)));
        var child = TestUtils.findRenderedComponentWithType(tree, Child);
        expect(child.context.client).to.deep.equal(client);
    });
    it('should add the store to the child context', function () {
        var tree = TestUtils.renderIntoDocument(React.createElement(ApolloProvider_1.default, {store: store, client: client}, React.createElement(Child, null)));
        var child = TestUtils.findRenderedComponentWithType(tree, Child);
        expect(child.context.store).to.deep.equal(store);
    });
});
//# sourceMappingURL=ApolloProvider.js.map