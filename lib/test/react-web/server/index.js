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
var chai = require('chai');
var React = require('react');
var ReactDOM = require('react-dom/server');
var apollo_client_1 = require('apollo-client');
var src_1 = require('../../../src');
var server_1 = require('../../../src/server');
require('isomorphic-fetch');
var graphql_tag_1 = require('graphql-tag');
var mockNetworkInterface_1 = require('../../mocks/mockNetworkInterface');
var expect = chai.expect;
describe('SSR', function () {
    describe('`getDataFromTree`', function () {
        it('should run through all of the queries that want SSR', function (done) {
            var query = (_a = ["{ currentUser { firstName } }"], _a.raw = ["{ currentUser { firstName } }"], graphql_tag_1.default(_a));
            var data = { currentUser: { firstName: 'James' } };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data }, delay: 50 });
            var apolloClient = new apollo_client_1.default({ networkInterface: networkInterface });
            var WrappedElement = src_1.graphql(query)(function (_a) {
                var data = _a.data;
                return (React.createElement("div", null, data.loading ? 'loading' : data.currentUser.firstName));
            });
            var app = (React.createElement(src_1.ApolloProvider, {client: apolloClient}, React.createElement(WrappedElement, null)));
            server_1.getDataFromTree(app)
                .then(function () {
                var markup = ReactDOM.renderToString(app);
                expect(markup).to.match(/James/);
                done();
            })
                .catch(console.error);
            var _a;
        });
        it('should run return the initial state for hydration', function (done) {
            var query = (_a = ["{ currentUser { firstName } }"], _a.raw = ["{ currentUser { firstName } }"], graphql_tag_1.default(_a));
            var data = { currentUser: { firstName: 'James' } };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data }, delay: 50 });
            var apolloClient = new apollo_client_1.default({ networkInterface: networkInterface });
            var WrappedElement = src_1.graphql(query)(function (_a) {
                var data = _a.data;
                return (React.createElement("div", null, data.loading ? 'loading' : data.currentUser.firstName));
            });
            var app = (React.createElement(src_1.ApolloProvider, {client: apolloClient}, React.createElement(WrappedElement, null)));
            server_1.getDataFromTree(app)
                .then(function (_a) {
                var store = _a.store;
                var initialState = store.getState();
                expect(initialState.apollo.data).to.exist;
                expect(initialState.apollo.data['$ROOT_QUERY.currentUser']).to.exist;
                done();
            })
                .catch(console.error);
            var _a;
        });
        it('should use the correct default props for a query', function (done) {
            var query = (_a = ["query user($id: ID) { currentUser(id: $id){ firstName } }"], _a.raw = ["query user($id: ID) { currentUser(id: $id){ firstName } }"], graphql_tag_1.default(_a));
            var data = { currentUser: { firstName: 'James' } };
            var variables = { id: 1 };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data }, delay: 50 });
            var apolloClient = new apollo_client_1.default({ networkInterface: networkInterface });
            var Element = src_1.graphql(query, { name: 'user' })(function (_a) {
                var user = _a.user;
                return (React.createElement("div", null, user.loading ? 'loading' : user.currentUser.firstName));
            });
            var app = (React.createElement(src_1.ApolloProvider, {client: apolloClient}, React.createElement(Element, {id: 1})));
            server_1.getDataFromTree(app)
                .then(function (_a) {
                var store = _a.store;
                var initialState = store.getState();
                expect(initialState.apollo.data).to.exist;
                expect(initialState.apollo.data['$ROOT_QUERY.currentUser({"id":1})']).to.exist;
                done();
            })
                .catch(console.error);
            var _a;
        });
        it('shouldn\'t run queries if ssr is turned to off', function (done) {
            var query = (_a = ["query user($id: ID) { currentUser(id: $id){ firstName } }"], _a.raw = ["query user($id: ID) { currentUser(id: $id){ firstName } }"], graphql_tag_1.default(_a));
            var data = { currentUser: { firstName: 'James' } };
            var variables = { id: 1 };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data }, delay: 50 });
            var apolloClient = new apollo_client_1.default({ networkInterface: networkInterface });
            var Element = src_1.graphql(query, {
                name: 'user',
                options: function (props) { return ({ variables: props, ssr: false }); }
            })(function (_a) {
                var user = _a.user;
                return (React.createElement("div", null, user.loading ? 'loading' : user.currentUser.firstName));
            });
            var app = (React.createElement(src_1.ApolloProvider, {client: apolloClient}, React.createElement(Element, {id: 1})));
            server_1.getDataFromTree(app)
                .then(function (_a) {
                var store = _a.store;
                var initialState = store.getState();
                expect(initialState.apollo.queries).to.be.empty;
                expect(initialState.apollo.data).to.be.empty;
                done();
            })
                .catch(console.error);
            var _a;
        });
        it('should correctly handle SSR mutations', function (done) {
            var query = (_a = ["{ currentUser { firstName } }"], _a.raw = ["{ currentUser { firstName } }"], graphql_tag_1.default(_a));
            var data1 = { currentUser: { firstName: 'James' } };
            var mutation = (_b = ["mutation { logRoutes { id } }"], _b.raw = ["mutation { logRoutes { id } }"], graphql_tag_1.default(_b));
            var mutationData = { logRoutes: { id: 'foo' } };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data1 }, delay: 5 }, { request: { query: mutation }, result: { data: mutationData }, delay: 5 });
            var apolloClient = new apollo_client_1.default({ networkInterface: networkInterface });
            var withQuery = src_1.graphql(query, {
                options: function (ownProps) { return ({ ssr: true }); },
                props: function (_a) {
                    var data = _a.data;
                    expect(data.refetch).to.exist;
                    return {
                        refetchQuery: data.refetch,
                        data: data,
                    };
                },
            });
            var withMutation = src_1.graphql(mutation, {
                props: function (_a) {
                    var ownProps = _a.ownProps, mutate = _a.mutate;
                    expect(ownProps.refetchQuery).to.exist;
                    return {
                        action: function (variables) {
                            return mutate({ variables: variables }).then(function () { return ownProps.refetchQuery(); });
                        },
                    };
                },
            });
            var Element = (function (_a) {
                var data = _a.data;
                return (React.createElement("div", null, data.loading ? 'loading' : data.currentUser.firstName));
            });
            var WrappedElement = withQuery(withMutation(Element));
            var app = (React.createElement(src_1.ApolloProvider, {client: apolloClient}, React.createElement(WrappedElement, null)));
            server_1.getDataFromTree(app)
                .then(function () {
                var markup = ReactDOM.renderToString(app);
                expect(markup).to.match(/James/);
                done();
            })
                .catch(console.error);
            var _a, _b;
        });
        it('should not require `ApolloProvider` to be the root component', function (done) {
            var query = (_a = ["{ currentUser { firstName } }"], _a.raw = ["{ currentUser { firstName } }"], graphql_tag_1.default(_a));
            var data = { currentUser: { firstName: 'James' } };
            var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data }, delay: 50 });
            var apolloClient = new apollo_client_1.default({ networkInterface: networkInterface });
            var WrappedElement = src_1.graphql(query)(function (_a) {
                var data = _a.data;
                return (React.createElement("div", null, data.loading ? 'loading' : data.currentUser.firstName));
            });
            var MyRootContainer = (function (_super) {
                __extends(MyRootContainer, _super);
                function MyRootContainer(props) {
                    _super.call(this, props);
                    this.state = { color: 'purple' };
                }
                MyRootContainer.prototype.getChildContext = function () {
                    return { color: this.state.color };
                };
                MyRootContainer.prototype.render = function () {
                    return React.createElement("div", null, this.props.children);
                };
                return MyRootContainer;
            }(React.Component));
            MyRootContainer.childContextTypes = {
                color: React.PropTypes.string,
            };
            var app = (React.createElement(MyRootContainer, null, React.createElement(src_1.ApolloProvider, {client: apolloClient}, React.createElement(WrappedElement, null))));
            server_1.getDataFromTree(app)
                .then(function () {
                var markup = ReactDOM.renderToString(app);
                expect(markup).to.match(/James/);
                done();
            })
                .catch(done);
            var _a;
        });
    });
    describe('`renderToStringWithData`', function () {
        it('should work on a non trivial example', function (done) {
            this.timeout(10000);
            var networkInterface = apollo_client_1.createNetworkInterface('http://graphql-swapi.parseapp.com/');
            var apolloClient = new apollo_client_1.default({ networkInterface: networkInterface });
            var Film = (function (_super) {
                __extends(Film, _super);
                function Film() {
                    _super.apply(this, arguments);
                }
                Film.prototype.render = function () {
                    var data = this.props.data;
                    if (data.loading)
                        return null;
                    var film = data.film;
                    return React.createElement("h6", null, film.title);
                };
                Film = __decorate([
                    src_1.graphql((_a = ["\n        query data($id: ID!) { film: node(id: $id) { ... on Film { title } } }\n      "], _a.raw = ["\n        query data($id: ID!) { film: node(id: $id) { ... on Film { title } } }\n      "], graphql_tag_1.default(_a)))
                ], Film);
                return Film;
                var _a;
            }(React.Component));
            ;
            var Starship = (function (_super) {
                __extends(Starship, _super);
                function Starship() {
                    _super.apply(this, arguments);
                }
                Starship.prototype.render = function () {
                    var data = this.props.data;
                    if (data.loading)
                        return null;
                    var ship = data.ship;
                    return (React.createElement("div", null, React.createElement("h4", null, ship.name, " appeared in the following flims:"), React.createElement("br", null), React.createElement("ul", null, ship.filmConnection.films.map(function (film, key) { return (React.createElement("li", {key: key}, React.createElement(Film, {id: film.id}))); }))));
                };
                Starship = __decorate([
                    src_1.graphql((_a = ["\n        query data($id: ID!) {\n          ship: node(id: $id) { ... on Starship { name, filmConnection { films { id } } } }\n        }\n      "], _a.raw = ["\n        query data($id: ID!) {\n          ship: node(id: $id) { ... on Starship { name, filmConnection { films { id } } } }\n        }\n      "], graphql_tag_1.default(_a)))
                ], Starship);
                return Starship;
                var _a;
            }(React.Component));
            ;
            var AllShips = (function (_super) {
                __extends(AllShips, _super);
                function AllShips() {
                    _super.apply(this, arguments);
                }
                AllShips.prototype.render = function () {
                    var data = this.props.data;
                    return (React.createElement("ul", null, !data.loading && data.allStarships && data.allStarships.starships.map(function (ship, key) { return (React.createElement("li", {key: key}, React.createElement(Starship, {id: ship.id}))); })));
                };
                AllShips = __decorate([
                    src_1.graphql((_a = ["query data { allStarships(first: 2) { starships { id } } }"], _a.raw = ["query data { allStarships(first: 2) { starships { id } } }"], graphql_tag_1.default(_a)))
                ], AllShips);
                return AllShips;
                var _a;
            }(React.Component));
            var AllPlanets = (function (_super) {
                __extends(AllPlanets, _super);
                function AllPlanets() {
                    _super.apply(this, arguments);
                }
                AllPlanets.prototype.render = function () {
                    var data = this.props.data;
                    if (data.loading)
                        return null;
                    var planets = data.allPlanets.planets;
                    return (React.createElement("div", null, React.createElement("h1", null, "Planets"), planets.map(function (planet, key) { return (React.createElement("div", {key: key}, planet.name)); })));
                };
                AllPlanets = __decorate([
                    src_1.graphql((_a = ["query data { allPlanets(first: 1) { planets { name } } }"], _a.raw = ["query data { allPlanets(first: 1) { planets { name } } }"], graphql_tag_1.default(_a)))
                ], AllPlanets);
                return AllPlanets;
                var _a;
            }(React.Component));
            var Bar = function () { return (React.createElement("div", null, React.createElement("h2", null, "Bar"), React.createElement(AllPlanets, null))); };
            var Foo = function () { return (React.createElement("div", null, React.createElement("h1", null, "Foo"), React.createElement(Bar, null))); };
            var app = (React.createElement(src_1.ApolloProvider, {client: apolloClient}, React.createElement("div", null, React.createElement(Foo, null), React.createElement("hr", null), React.createElement(AllShips, null))));
            server_1.renderToStringWithData(app)
                .then(function (markup) {
                expect(markup).to.match(/CR90 corvette/);
                expect(markup).to.match(/Return of the Jedi/);
                expect(markup).to.match(/A New Hope/);
                expect(markup).to.match(/Planets/);
                expect(markup).to.match(/Tatooine/);
                expect(markup).to.match(/__APOLLO_STATE__/);
                done();
            })
                .catch(done);
        });
    });
});
//# sourceMappingURL=index.js.map