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
var assign = require('object-assign');
var apollo_client_1 = require('apollo-client');
var chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());
var expect = chai.expect;
var mockNetworkInterface_1 = require('../../../mocks/mockNetworkInterface');
var components_1 = require('../../../mocks/components');
var graphql_1 = require('../../../../src/graphql');
describe('mutations', function () {
    it('binds a mutation to props', function () {
        var query = (_a = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], _a.raw = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var ContainerWithData = graphql_1.default(query)(function (_a) {
            var mutate = _a.mutate;
            expect(mutate).to.exist;
            expect(mutate).to.be.instanceof(Function);
            return null;
        });
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        var _a;
    });
    it('binds a mutation to custom props', function () {
        var query = (_a = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], _a.raw = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var props = function (_a) {
            var ownProps = _a.ownProps, addPerson = _a.addPerson;
            return ((_b = {},
                _b[ownProps.methodName] = function (name) { return addPerson({ variables: { name: name } }); },
                _b
            ));
            var _b;
        };
        var ContainerWithData = graphql_1.default(query, { props: props })(function (_a) {
            var test = _a.test;
            expect(test).to.exist;
            expect(test).to.be.instanceof(Function);
            return null;
        });
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, {methodName: "test"})));
        var _a;
    });
    it('does not swallow children errors', function (done) {
        var query = (_a = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], _a.raw = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var bar;
        var ContainerWithData = graphql_1.default(query)(function () {
            bar();
            return null;
        });
        try {
            enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
            done(new Error('component should have thrown'));
        }
        catch (e) {
            expect(e).to.match(/TypeError/);
            done();
        }
        var _a;
    });
    it('can execute a mutation', function (done) {
        var query = (_a = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], _a.raw = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentDidMount = function () {
                this.props.mutate()
                    .then(function (result) {
                    expect(result.data).to.deep.equal(data);
                    done();
                })
                    .catch(done);
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
        var _a;
    });
    it('can execute a mutation with variables from props', function (done) {
        var query = (_a = ["\n      mutation addPerson($id: Int) {\n        allPeople(id: $id) { people { name } }\n      }\n    "], _a.raw = ["\n      mutation addPerson($id: Int) {\n        allPeople(id: $id) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { id: 1 };
        var networkInterface = mockNetworkInterface_1.default({
            request: { query: query, variables: variables },
            result: { data: data },
        });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentDidMount = function () {
                this.props.mutate()
                    .then(function (result) {
                    expect(result.data).to.deep.equal(data);
                    done();
                })
                    .catch(done);
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
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, {id: 1})));
        var _a;
    });
    it('allows falsy values in the mapped variables from props', function (done) {
        var query = (_a = ["\n      mutation addPerson($id: Int) {\n        allPeople(id: $id) { people { name } }\n      }\n    "], _a.raw = ["\n      mutation addPerson($id: Int) {\n        allPeople(id: $id) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { id: null };
        var networkInterface = mockNetworkInterface_1.default({
            request: { query: query, variables: variables },
            result: { data: data },
        });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentDidMount = function () {
                this.props.mutate()
                    .then(function (result) {
                    expect(result.data).to.deep.equal(data);
                    done();
                })
                    .catch(done);
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
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, {id: null})));
        var _a;
    });
    it('errors if the passed props don\'t contain the needed variables', function () {
        var query = (_a = ["\n      mutation addPerson($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], _a.raw = ["\n      mutation addPerson($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { first: 1 };
        var networkInterface = mockNetworkInterface_1.default({
            request: { query: query, variables: variables },
            result: { data: data },
        });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = graphql_1.default(query)(function () { return null; });
        try {
            enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, {frst: 1})));
        }
        catch (e) {
            expect(e).to.match(/Invariant Violation: The operation 'addPerson'/);
        }
        var _a;
    });
    it('rebuilds the mutation on prop change when using `options`', function (done) {
        var query = (_a = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], _a.raw = ["mutation addPerson { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        function options(props) {
            expect(props.listId).to.equal(2);
            return {};
        }
        ;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                if (props.listId !== 2)
                    return;
                props.mutate().then(function (x) { return done(); }).catch(done);
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, { options: options })
            ], Container);
            return Container;
        }(React.Component));
        ;
        var ChangingProps = (function (_super) {
            __extends(ChangingProps, _super);
            function ChangingProps() {
                _super.apply(this, arguments);
                this.state = { listId: 1 };
            }
            ChangingProps.prototype.componentDidMount = function () {
                var _this = this;
                setTimeout(function () { return _this.setState({ listId: 2 }); }, 50);
            };
            ChangingProps.prototype.render = function () {
                return React.createElement(Container, {listId: this.state.listId});
            };
            return ChangingProps;
        }(React.Component));
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ChangingProps, null)));
        var _a;
    });
    it('can execute a mutation with custom variables', function (done) {
        var query = (_a = ["\n      mutation addPerson($id: Int) {\n        allPeople(id: $id) { people { name } }\n      }\n    "], _a.raw = ["\n      mutation addPerson($id: Int) {\n        allPeople(id: $id) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { id: 1 };
        var networkInterface = mockNetworkInterface_1.default({
            request: { query: query, variables: variables },
            result: { data: data },
        });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentDidMount = function () {
                this.props.mutate({ variables: { id: 1 } })
                    .then(function (result) {
                    expect(result.data).to.deep.equal(data);
                    done();
                })
                    .catch(done);
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
        var _a;
    });
    it('allows for passing optimisticResponse for a mutation', function (done) {
        var query = (_a = ["\n      mutation createTodo {\n        createTodo { id, text, completed, __typename }\n        __typename\n      }\n    "], _a.raw = ["\n      mutation createTodo {\n        createTodo { id, text, completed, __typename }\n        __typename\n      }\n    "], graphql_tag_1.default(_a));
        var data = {
            __typename: 'Mutation',
            createTodo: {
                __typename: 'Todo',
                id: '99',
                text: 'This one was created with a mutation.',
                completed: true,
            },
        };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentDidMount = function () {
                var optimisticResponse = {
                    __typename: 'Mutation',
                    createTodo: {
                        __typename: 'Todo',
                        id: '99',
                        text: 'Optimistically generated',
                        completed: true,
                    },
                };
                this.props.mutate({ optimisticResponse: optimisticResponse })
                    .then(function (result) {
                    expect(result.data).to.deep.equal(data);
                    done();
                })
                    .catch(done);
                var dataInStore = client.queryManager.getDataWithOptimisticResults();
                expect(dataInStore['$ROOT_MUTATION.createTodo']).to.deep.equal(optimisticResponse.createTodo);
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
        var _a;
    });
    it('allows for updating queries from a mutation', function (done) {
        var mutation = (_a = ["\n      mutation createTodo {\n        createTodo { id, text, completed }\n      }\n    "], _a.raw = ["\n      mutation createTodo {\n        createTodo { id, text, completed }\n      }\n    "], graphql_tag_1.default(_a));
        var mutationData = {
            createTodo: {
                id: '99',
                text: 'This one was created with a mutation.',
                completed: true,
            },
        };
        var optimisticResponse = {
            createTodo: {
                id: '99',
                text: 'Optimistically generated',
                completed: true,
            },
        };
        var updateQueries = {
            todos: function (previousQueryResult, _a) {
                var mutationResult = _a.mutationResult, queryVariables = _a.queryVariables;
                if (queryVariables.id !== '123') {
                    return previousQueryResult;
                }
                var originalList = previousQueryResult.todo_list;
                var newTask = mutationResult.data.createTodo;
                return {
                    todo_list: assign(originalList, { tasks: originalList.tasks.concat([newTask]) }),
                };
            },
        };
        var query = (_b = ["\n      query todos($id: ID!) {\n        todo_list(id: $id) {\n          id, title, tasks { id, text, completed }\n        }\n      }\n    "], _b.raw = ["\n      query todos($id: ID!) {\n        todo_list(id: $id) {\n          id, title, tasks { id, text, completed }\n        }\n      }\n    "], graphql_tag_1.default(_b));
        var data = {
            todo_list: { id: '123', title: 'how to apollo', tasks: [] },
        };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: { id: '123' } }, result: { data: data } }, { request: { query: mutation }, result: { data: mutationData } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var count = 0;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                if (!props.data.todo_list)
                    return;
                if (!props.data.todo_list.tasks.length) {
                    props.mutate()
                        .then(function (result) {
                        expect(result.data).to.deep.equal(mutationData);
                    })
                        .catch(done);
                    var dataInStore = client.queryManager.getDataWithOptimisticResults();
                    expect(dataInStore['$ROOT_MUTATION.createTodo']).to.deep.equal(optimisticResponse.createTodo);
                    return;
                }
                if (count === 0) {
                    count++;
                    expect(props.data.todo_list.tasks).to.deep.equal([optimisticResponse.createTodo]);
                }
                else if (count === 1) {
                    expect(props.data.todo_list.tasks).to.deep.equal([mutationData.createTodo]);
                    done();
                }
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query),
                graphql_1.default(mutation, { options: function () { return ({ optimisticResponse: optimisticResponse, updateQueries: updateQueries }); } })
            ], Container);
            return Container;
        }(React.Component));
        ;
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, {id: '123'})));
        var _a, _b;
    });
});
//# sourceMappingURL=mutations.js.map