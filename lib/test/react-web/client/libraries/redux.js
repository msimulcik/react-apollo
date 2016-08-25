"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
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
var redux_1 = require('redux');
var react_redux_1 = require('react-redux');
var redux_form_1 = require('redux-form');
var redux_loop_1 = require('redux-loop');
var immutable_1 = require('immutable');
var redux_immutable_1 = require('redux-immutable');
var graphql_tag_1 = require('graphql-tag');
var apollo_client_1 = require('apollo-client');
var chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());
var expect = chai.expect;
var components_1 = require('../../../mocks/components');
var mockNetworkInterface_1 = require('../../../mocks/mockNetworkInterface');
var src_1 = require('../../../../src');
describe('redux integration', function () {
    it('updates child props on state change', function (done) {
        var query = (_a = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], _a.raw = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { first: 1 };
        var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var variables2 = { first: 2 };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var wrapper;
        function counter(state, action) {
            if (state === void 0) { state = 1; }
            switch (action.type) {
                case 'INCREMENT':
                    return state + 1;
                default:
                    return state;
            }
        }
        var apolloReducer = client.reducer();
        var store = redux_1.createStore(redux_1.combineReducers({
            counter: counter,
            apollo: apolloReducer,
        }), redux_1.applyMiddleware(client.middleware()));
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (nextProps) {
                if (nextProps.first === 1)
                    this.props.dispatch({ type: 'INCREMENT' });
                if (nextProps.first === 2) {
                    if (nextProps.data.loading)
                        return;
                    expect(nextProps.data.allPeople).to.deep.equal(data2.allPeople);
                    done();
                }
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                react_redux_1.connect(function (state) { return ({ first: state.counter }); }),
                src_1.graphql(query)
            ], Container);
            return Container;
        }(React.Component));
        ;
        wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {store: store, client: client}, React.createElement(Container, null)));
        var _a;
    });
    describe('redux-form', function () {
        it('works with redux form to drive queries', function (done) {
            var query = (_a = ["query people($name: String) { allPeople(name: $name) { people { name } } }"], _a.raw = ["query people($name: String) { allPeople(name: $name) { people { name } } }"], graphql_tag_1.default(_a));
            var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
            var variables = { name: 'Luke' };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } });
            var client = new apollo_client_1.default({ networkInterface: networkInterface });
            var wrapper;
            var apolloReducer = client.reducer();
            var store = redux_1.createStore(redux_1.combineReducers({
                apollo: apolloReducer,
                form: redux_form_1.reducer,
            }), redux_1.applyMiddleware(client.middleware()));
            var Container = (function (_super) {
                __extends(Container, _super);
                function Container() {
                    _super.apply(this, arguments);
                }
                Container.prototype.componentWillReceiveProps = function (nextProps) {
                    var value = nextProps.fields.firstName.value;
                    if (!value)
                        return;
                    expect(value).to.equal(variables.name);
                    if (nextProps.data.loading)
                        return;
                    expect(nextProps.data.loading).to.be.false;
                    expect(nextProps.data.allPeople).to.deep.equal(data.allPeople);
                    done();
                };
                Container.prototype.render = function () {
                    var _a = this.props, firstName = _a.fields.firstName, handleSubmit = _a.handleSubmit;
                    return (React.createElement("form", {onSubmit: handleSubmit}, React.createElement("div", null, React.createElement("label", null, "First Name"), React.createElement("input", __assign({type: 'text', placeholder: 'First Name'}, firstName))), React.createElement("button", {type: 'submit'}, "Submit")));
                };
                Container = __decorate([
                    redux_form_1.reduxForm({
                        form: 'contact',
                        fields: ['firstName'],
                    }),
                    src_1.graphql(query, {
                        options: function (_a) {
                            var fields = _a.fields;
                            return ({
                                variables: { name: fields.firstName.value },
                                skip: !fields.firstName.value,
                            });
                        },
                    })
                ], Container);
                return Container;
            }(React.Component));
            ;
            wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {store: store, client: client}, React.createElement(Container, null)));
            setTimeout(function () {
                wrapper.find('input').simulate('change', {
                    target: { value: variables.name },
                });
            }, 100);
            var _a;
        });
        it('works with redux form to be prefilled by queries', function (done) {
            var query = (_a = ["query people($name: String) { allPeople(name: $name) { people { name } } }"], _a.raw = ["query people($name: String) { allPeople(name: $name) { people { name } } }"], graphql_tag_1.default(_a));
            var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
            var variables = { name: 'Luke' };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } });
            var client = new apollo_client_1.default({ networkInterface: networkInterface });
            var wrapper;
            var apolloReducer = client.reducer();
            var store = redux_1.createStore(redux_1.combineReducers({
                apollo: apolloReducer,
                form: redux_form_1.reducer,
            }), redux_1.applyMiddleware(client.middleware()));
            var Container = (function (_super) {
                __extends(Container, _super);
                function Container() {
                    _super.apply(this, arguments);
                }
                Container.prototype.componentWillReceiveProps = function (nextProps) {
                    var _a = nextProps.fields.firstName, value = _a.value, initialValue = _a.initialValue;
                    if (!value)
                        return;
                    expect(initialValue).to.equal(data.allPeople.people[0].name);
                    expect(value).to.equal(data.allPeople.people[0].name);
                    done();
                };
                Container.prototype.render = function () {
                    var _a = this.props, firstName = _a.fields.firstName, handleSubmit = _a.handleSubmit;
                    return (React.createElement("form", {onSubmit: handleSubmit}, React.createElement("div", null, React.createElement("label", null, "First Name"), React.createElement("input", __assign({type: 'text', placeholder: 'First Name'}, firstName))), React.createElement("button", {type: 'submit'}, "Submit")));
                };
                Container = __decorate([
                    src_1.graphql(query, { options: function () { return ({ variables: variables }); } }),
                    redux_form_1.reduxForm({
                        form: 'contact',
                        fields: ['firstName'],
                    }, function (state, ownProps) { return ({
                        initialValues: {
                            firstName: ownProps.data.loading ? '' : ownProps.data.allPeople.people[0].name,
                        },
                    }); })
                ], Container);
                return Container;
            }(React.Component));
            ;
            enzyme_1.mount(React.createElement(components_1.ProviderMock, {store: store, client: client}, React.createElement(Container, null)));
            var _a;
        });
    });
    describe('redux-loop', function () {
        it('works with redux-loop with shared store', function (done) {
            var query = (_a = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], _a.raw = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], graphql_tag_1.default(_a));
            var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
            var variables = { first: 1 };
            var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
            var variables2 = { first: 2 };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
            var client = new apollo_client_1.default({ networkInterface: networkInterface });
            var wrapper;
            function counter(state, action) {
                if (state === void 0) { state = 1; }
                switch (action.type) {
                    case 'INCREMENT':
                        return state + 1;
                    default:
                        return state;
                }
            }
            var apolloReducer = client.reducer();
            var store = redux_1.createStore(redux_loop_1.combineReducers({
                counter: counter,
                apollo: apolloReducer,
            }), redux_1.applyMiddleware(client.middleware()), redux_loop_1.install());
            var Container = (function (_super) {
                __extends(Container, _super);
                function Container() {
                    _super.apply(this, arguments);
                }
                Container.prototype.componentWillReceiveProps = function (nextProps) {
                    if (nextProps.first === 1)
                        this.props.dispatch({ type: 'INCREMENT' });
                    if (nextProps.first === 2) {
                        if (nextProps.data.loading)
                            return;
                        expect(nextProps.data.allPeople).to.deep.equal(data2.allPeople);
                        done();
                    }
                };
                Container.prototype.render = function () {
                    return null;
                };
                Container = __decorate([
                    react_redux_1.connect(function (state) { return ({ first: state.counter }); }),
                    src_1.graphql(query)
                ], Container);
                return Container;
            }(React.Component));
            ;
            wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {store: store, client: client}, React.createElement(Container, null)));
            var _a;
        });
        it('works with redux-loop and an immutable store', function (done) {
            var query = (_a = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], _a.raw = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], graphql_tag_1.default(_a));
            var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
            var variables = { first: 1 };
            var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
            var variables2 = { first: 2 };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
            var client = new apollo_client_1.default({ networkInterface: networkInterface });
            var wrapper;
            function counter(state, action) {
                if (state === void 0) { state = 1; }
                switch (action.type) {
                    case 'INCREMENT':
                        return state + 1;
                    default:
                        return state;
                }
            }
            var immutableStateContainer = immutable_1.Map();
            var getImmutable = function (child, key) { return child ? child.get(key) : void 0; };
            var setImmutable = function (child, key, value) { return child.set(key, value); };
            var store = redux_1.createStore(redux_loop_1.combineReducers({
                counter: counter,
            }, immutableStateContainer, getImmutable, setImmutable), redux_loop_1.install());
            var Container = (function (_super) {
                __extends(Container, _super);
                function Container() {
                    _super.apply(this, arguments);
                }
                Container.prototype.componentWillReceiveProps = function (nextProps) {
                    if (nextProps.first === 1)
                        this.props.dispatch({ type: 'INCREMENT' });
                    if (nextProps.first === 2) {
                        if (nextProps.data.loading)
                            return;
                        expect(nextProps.data.allPeople).to.deep.equal(data2.allPeople);
                        done();
                    }
                };
                Container.prototype.render = function () {
                    return null;
                };
                Container = __decorate([
                    react_redux_1.connect(function (state) { return ({ first: state.get('counter') }); }),
                    src_1.graphql(query)
                ], Container);
                return Container;
            }(React.Component));
            ;
            wrapper = enzyme_1.mount(React.createElement(src_1.ApolloProvider, {store: store, client: client, immutable: true}, React.createElement(Container, null)));
            var _a;
        });
    });
    describe('immutable store', function () {
        it('works an immutable store', function (done) {
            var query = (_a = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], _a.raw = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], graphql_tag_1.default(_a));
            var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
            var variables = { first: 1 };
            var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
            var variables2 = { first: 2 };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
            var client = new apollo_client_1.default({ networkInterface: networkInterface });
            var wrapper;
            function counter(state, action) {
                if (state === void 0) { state = 1; }
                switch (action.type) {
                    case 'INCREMENT':
                        return state + 1;
                    default:
                        return state;
                }
            }
            var initialState = immutable_1.Map();
            var store = redux_1.createStore(redux_immutable_1.combineReducers({ counter: counter }), initialState);
            var Container = (function (_super) {
                __extends(Container, _super);
                function Container() {
                    _super.apply(this, arguments);
                }
                Container.prototype.componentWillReceiveProps = function (nextProps) {
                    if (nextProps.first === 1)
                        this.props.dispatch({ type: 'INCREMENT' });
                    if (nextProps.first === 2) {
                        if (nextProps.data.loading)
                            return;
                        expect(nextProps.data.allPeople).to.deep.equal(data2.allPeople);
                        done();
                    }
                };
                Container.prototype.render = function () {
                    return null;
                };
                Container = __decorate([
                    react_redux_1.connect(function (state) { return ({ first: state.get('counter') }); }),
                    src_1.graphql(query)
                ], Container);
                return Container;
            }(React.Component));
            ;
            wrapper = enzyme_1.mount(React.createElement(src_1.ApolloProvider, {store: store, client: client, immutable: true}, React.createElement(Container, null)));
            var _a;
        });
    });
});
//# sourceMappingURL=redux.js.map