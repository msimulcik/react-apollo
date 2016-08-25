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
var errors_1 = require('apollo-client/errors');
var chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());
var expect = chai.expect;
var mockNetworkInterface_1 = require('../../../mocks/mockNetworkInterface');
var components_1 = require('../../../mocks/components');
var graphql_1 = require('../../../../src/graphql');
describe('queries', function () {
    it('binds a query to props', function () {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var ContainerWithData = graphql_1.default(query)(function (_a) {
            var data = _a.data;
            expect(data).to.exist;
            expect(data.ownProps).to.not.exist;
            expect(data.loading).to.be.true;
            return null;
        });
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        wrapper.unmount();
        var _a;
    });
    it('includes the variables in the props', function () {
        var query = (_a = ["query people ($first: Int) { allPeople(first: $first) { people { name } } }"], _a.raw = ["query people ($first: Int) { allPeople(first: $first) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { first: 1 };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var ContainerWithData = graphql_1.default(query)(function (_a) {
            var data = _a.data;
            expect(data).to.exist;
            expect(data.variables).to.deep.equal(variables);
            return null;
        });
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, {first: 1})));
        var _a;
    });
    it('does not swallow children errors', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
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
    it('executes a query', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
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
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        var _a;
    });
    it('correctly rebuilds props on remount', function (done) {
        var query = (_a = ["query pollingPeople { allPeople(first: 1) { people { name } } }"], _a.raw = ["query pollingPeople { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Darth Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data }, newData: function () { return ({
                data: {
                    allPeople: { people: [{ name: "Darth Skywalker - " + Math.random() }] },
                }
            }); } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var wrapper, app, count = 0;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                if (count === 1) {
                    wrapper.unmount();
                    wrapper = enzyme_1.mount(app);
                }
                if (count === 10) {
                    wrapper.unmount();
                    done();
                }
                count++;
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, { options: { pollInterval: 10 } })
            ], Container);
            return Container;
        }(React.Component));
        ;
        app = React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null));
        wrapper = enzyme_1.mount(app);
        var _a;
    });
    it('correctly sets loading state on remounted forcefetch', function (done) {
        var query = (_a = ["query pollingPeople { allPeople(first: 1) { people { name } } }"], _a.raw = ["query pollingPeople { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Darth Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data }, delay: 10, newData: function () { return ({
                data: {
                    allPeople: { people: [{ name: "Darth Skywalker - " + Math.random() }] },
                },
            }); } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var wrapper, app, count = 0;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillMount = function () {
                if (count === 1) {
                    expect(this.props.data.loading).to.be.true;
                    count++;
                }
            };
            Container.prototype.componentWillReceiveProps = function (props) {
                if (count === 0) {
                    wrapper.unmount();
                    setTimeout(function () {
                        wrapper = enzyme_1.mount(app);
                    }, 5);
                }
                if (count === 2) {
                    expect(props.data.loading).to.be.false;
                    expect(props.data.allPeople).to.exist;
                    done();
                }
                count++;
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, { options: { forceFetch: true } })
            ], Container);
            return Container;
        }(React.Component));
        ;
        app = React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null));
        wrapper = enzyme_1.mount(app);
        var _a;
    });
    it('executes a query with two root fields', function (done) {
        var query = (_a = ["query people {\n      allPeople(first: 1) { people { name } }\n      otherPeople(first: 1) { people { name } }\n    }"], _a.raw = ["query people {\n      allPeople(first: 1) { people { name } }\n      otherPeople(first: 1) { people { name } }\n    }"], graphql_tag_1.default(_a));
        var data = {
            allPeople: { people: [{ name: 'Luke Skywalker' }] },
            otherPeople: { people: [{ name: 'Luke Skywalker' }] },
        };
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
                expect(props.data.otherPeople).to.deep.equal(data.otherPeople);
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
        var _a;
    });
    it('can unmount without error', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var ContainerWithData = graphql_1.default(query)(function () { return null; });
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        try {
            wrapper.unmount();
            done();
        }
        catch (e) {
            done(e);
        }
        var _a;
    });
    it('passes any GraphQL errors in props', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, error: new Error('boo') });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var ErrorContainer = (function (_super) {
            __extends(ErrorContainer, _super);
            function ErrorContainer() {
                _super.apply(this, arguments);
            }
            ErrorContainer.prototype.componentWillReceiveProps = function (_a) {
                var data = _a.data;
                expect(data.error).to.exist;
                expect(data.error).instanceof(errors_1.ApolloError);
                done();
            };
            ErrorContainer.prototype.render = function () {
                return null;
            };
            ErrorContainer = __decorate([
                graphql_1.default(query)
            ], ErrorContainer);
            return ErrorContainer;
        }(React.Component));
        ;
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ErrorContainer, null)));
        var _a;
    });
    it('maps props as variables if they match', function (done) {
        var query = (_a = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], _a.raw = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { first: 1 };
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
            Container.prototype.componentWillReceiveProps = function (props) {
                expect(props.data.loading).to.be.false;
                expect(props.data.allPeople).to.deep.equal(data.allPeople);
                expect(props.data.variables).to.deep.equal(this.props.data.variables);
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
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, {first: 1})));
        var _a;
    });
    it('allows falsy values in the mapped variables from props', function (done) {
        var query = (_a = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], _a.raw = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { first: null };
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
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, {first: null})));
        var _a;
    });
    it('errors if the passed props don\'t contain the needed variables', function () {
        var query = (_a = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], _a.raw = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
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
            expect(e).to.match(/Invariant Violation: The operation 'people'/);
        }
        var _a;
    });
    it('rebuilds the queries on prop change when using `options`', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var firstRun = true;
        var isDone = false;
        function options(props) {
            if (!firstRun) {
                expect(props.listId).to.equal(2);
                if (!isDone)
                    done();
                isDone = true;
            }
            return {};
        }
        ;
        var Container = graphql_1.default(query, { options: options })(function (props) { return null; });
        var ChangingProps = (function (_super) {
            __extends(ChangingProps, _super);
            function ChangingProps() {
                _super.apply(this, arguments);
                this.state = { listId: 1 };
            }
            ChangingProps.prototype.componentDidMount = function () {
                var _this = this;
                setTimeout(function () {
                    firstRun = false;
                    _this.setState({ listId: 2 });
                }, 50);
            };
            ChangingProps.prototype.render = function () {
                return React.createElement(Container, {listId: this.state.listId});
            };
            return ChangingProps;
        }(React.Component));
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ChangingProps, null)));
        var _a;
    });
    it('allows you to skip a query', function (done) {
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
                graphql_1.default(query, { options: function () { return ({ skip: true }); } })
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
    it('reruns the query if it changes', function (done) {
        var count = 0;
        var query = (_a = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], _a.raw = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data1 = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables1 = { first: 1 };
        var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var variables2 = { first: 2 };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables1 }, result: { data: data1 } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (_a) {
                var data = _a.data;
                if (count === 1 && data.loading) {
                    expect(data.allPeople).to.deep.equal(data1.allPeople);
                }
                if (count === 1 && !data.loading && this.props.data.loading) {
                    expect(data.allPeople).to.deep.equal(data2.allPeople);
                    done();
                }
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, {
                    options: function (props) { return ({ variables: props, returnPartialData: count === 0 }); },
                })
            ], Container);
            return Container;
        }(React.Component));
        ;
        var ChangingProps = (function (_super) {
            __extends(ChangingProps, _super);
            function ChangingProps() {
                _super.apply(this, arguments);
                this.state = { first: 1 };
            }
            ChangingProps.prototype.componentDidMount = function () {
                var _this = this;
                setTimeout(function () {
                    count++;
                    _this.setState({ first: 2 });
                }, 50);
            };
            ChangingProps.prototype.render = function () {
                return React.createElement(Container, {first: this.state.first});
            };
            return ChangingProps;
        }(React.Component));
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ChangingProps, null)));
        var _a;
    });
    it('reruns the query if just the variables change', function (done) {
        var count = 0;
        var query = (_a = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], _a.raw = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data1 = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables1 = { first: 1 };
        var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var variables2 = { first: 2 };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables1 }, result: { data: data1 } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (_a) {
                var data = _a.data;
                if (count === 1 && data.loading) {
                    expect(data.allPeople).to.deep.equal(data1.allPeople);
                }
                if (count === 1 && !data.loading && this.props.data.loading) {
                    expect(data.allPeople).to.deep.equal(data2.allPeople);
                    done();
                }
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, { options: function (props) { return ({ variables: props }); } })
            ], Container);
            return Container;
        }(React.Component));
        ;
        var ChangingProps = (function (_super) {
            __extends(ChangingProps, _super);
            function ChangingProps() {
                _super.apply(this, arguments);
                this.state = { first: 1 };
            }
            ChangingProps.prototype.componentDidMount = function () {
                var _this = this;
                setTimeout(function () {
                    count++;
                    _this.setState({ first: 2 });
                }, 50);
            };
            ChangingProps.prototype.render = function () {
                return React.createElement(Container, {first: this.state.first});
            };
            return ChangingProps;
        }(React.Component));
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ChangingProps, null)));
        var _a;
    });
    it('reruns the queries on prop change when using passed props', function (done) {
        var count = 0;
        var query = (_a = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], _a.raw = ["\n      query people($first: Int) {\n        allPeople(first: $first) { people { name } }\n      }\n    "], graphql_tag_1.default(_a));
        var data1 = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables1 = { first: 1 };
        var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var variables2 = { first: 2 };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables1 }, result: { data: data1 } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (_a) {
                var data = _a.data;
                if (count === 1 && data.loading) {
                    expect(data.allPeople).to.deep.equal(data1.allPeople);
                }
                if (count === 1 && !data.loading && this.props.data.loading) {
                    expect(data.allPeople).to.deep.equal(data2.allPeople);
                    done();
                }
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
        var ChangingProps = (function (_super) {
            __extends(ChangingProps, _super);
            function ChangingProps() {
                _super.apply(this, arguments);
                this.state = { first: 1 };
            }
            ChangingProps.prototype.componentDidMount = function () {
                var _this = this;
                setTimeout(function () {
                    count++;
                    _this.setState({ first: 2 });
                }, 50);
            };
            ChangingProps.prototype.render = function () {
                return React.createElement(Container, {first: this.state.first});
            };
            return ChangingProps;
        }(React.Component));
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ChangingProps, null)));
        var _a;
    });
    it('exposes refetch as part of the props api', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data1 = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data1 } }, { request: { query: query }, result: { data: data1 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var hasRefetched;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillMount = function () {
                expect(this.props.data.refetch).to.be.exist;
                expect(this.props.data.refetch).to.be.instanceof(Function);
            };
            Container.prototype.componentWillReceiveProps = function (_a) {
                var data = _a.data;
                if (hasRefetched)
                    return;
                hasRefetched = true;
                expect(data.refetch).to.be.exist;
                expect(data.refetch).to.be.instanceof(Function);
                data.refetch()
                    .then(function (result) {
                    expect(result.data).to.deep.equal(data1);
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
    it('exposes fetchMore as part of the props api', function (done) {
        var query = (_a = ["\n      query people($skip: Int, $first: Int) { allPeople(first: $first, skip: $skip) { people { name } } }\n    "], _a.raw = ["\n      query people($skip: Int, $first: Int) { allPeople(first: $first, skip: $skip) { people { name } } }\n    "], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var data1 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var variables = { skip: 1, first: 1 };
        var variables2 = { skip: 2, first: 1 };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } }, { request: { query: query, variables: variables2 }, result: { data: data1 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var count = 0;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillMount = function () {
                expect(this.props.data.fetchMore).to.be.exist;
                expect(this.props.data.fetchMore).to.be.instanceof(Function);
            };
            Container.prototype.componentWillReceiveProps = function (props) {
                if (count === 0) {
                    expect(props.data.fetchMore).to.be.exist;
                    expect(props.data.fetchMore).to.be.instanceof(Function);
                    props.data.fetchMore({
                        variables: { skip: 2 },
                        updateQuery: function (prev, _a) {
                            var fetchMoreResult = _a.fetchMoreResult;
                            return ({
                                allPeople: {
                                    people: prev.allPeople.people.concat(fetchMoreResult.data.allPeople.people),
                                },
                            });
                        },
                    });
                }
                else if (count === 1) {
                    expect(props.data.variables).to.deep.equal(variables2);
                    expect(props.data.loading).to.be.true;
                    expect(props.data.allPeople).to.deep.equal(data.allPeople);
                }
                else if (count === 2) {
                    expect(props.data.variables).to.deep.equal(variables2);
                    expect(props.data.loading).to.be.false;
                    expect(props.data.allPeople.people).to.deep.equal(data.allPeople.people.concat(data1.allPeople.people));
                    done();
                }
                else {
                    done(new Error('should not reach this point'));
                }
                count++;
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, { options: function () { return ({ variables: variables }); } })
            ], Container);
            return Container;
        }(React.Component));
        ;
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        var _a;
    });
    it('exposes stopPolling as part of the props api', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (_a) {
                var data = _a.data;
                expect(data.stopPolling).to.be.exist;
                expect(data.stopPolling).to.be.instanceof(Function);
                expect(data.stopPolling).to.not.throw;
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
        var _a;
    });
    it('exposes startPolling as part of the props api', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (_a) {
                var data = _a.data;
                expect(data.startPolling).to.be.exist;
                expect(data.startPolling).to.be.instanceof(Function);
                expect(data.startPolling).to.not.throw;
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
        var _a;
    });
    it('resets the loading state after a refetched query', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } }, { request: { query: query }, result: { data: data2 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var isRefectching;
        var refetched;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                if (refetched) {
                    expect(props.data.loading).to.be.false;
                    expect(props.data.allPeople).to.deep.equal(data2.allPeople);
                    done();
                    return;
                }
                if (isRefectching) {
                    isRefectching = false;
                    refetched = true;
                    expect(props.data.loading).to.be.true;
                    expect(props.data.allPeople).to.deep.equal(data.allPeople);
                    return;
                }
                if (!isRefectching) {
                    isRefectching = true;
                    props.data.refetch();
                }
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
    it('resets the loading state after a refetched query even if the data doesn\'t change', function (d) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } }, { request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var isRefectching;
        var refetched;
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                if (refetched) {
                    expect(props.data.loading).to.be.false;
                    expect(props.data.allPeople).to.deep.equal(data.allPeople);
                    d();
                    return;
                }
                if (isRefectching) {
                    isRefectching = false;
                    refetched = true;
                    expect(props.data.loading).to.be.true;
                    expect(props.data.allPeople).to.deep.equal(data.allPeople);
                    return;
                }
                if (!isRefectching) {
                    isRefectching = true;
                    props.data.refetch();
                }
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
    it('allows a polling query to be created', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } }, { request: { query: query }, result: { data: data2 } }, { request: { query: query }, result: { data: data2 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var count = 0;
        var Container = graphql_1.default(query, { options: function () { return ({ pollInterval: 75 }); } })(function () {
            count++;
            return null;
        });
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        setTimeout(function () {
            expect(count).to.equal(3);
            wrapper.unmount();
            done();
        }, 160);
        var _a;
    });
    it('allows custom mapping of a result to props', function () {
        var query = (_a = ["query thing { getThing { thing } }"], _a.raw = ["query thing { getThing { thing } }"], graphql_tag_1.default(_a));
        var data = { getThing: { thing: true } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var props = function (_a) {
            var data = _a.data;
            return ({ showSpinner: data.loading });
        };
        var ContainerWithData = graphql_1.default(query, { props: props })(function (_a) {
            var showSpinner = _a.showSpinner;
            expect(showSpinner).to.be.true;
            return null;
        });
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, null)));
        wrapper.unmount();
        var _a;
    });
    it('allows custom mapping of a result to props that includes the passed props', function () {
        var query = (_a = ["query thing { getThing { thing } }"], _a.raw = ["query thing { getThing { thing } }"], graphql_tag_1.default(_a));
        var data = { getThing: { thing: true } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var props = function (_a) {
            var data = _a.data, ownProps = _a.ownProps;
            expect(ownProps.sample).to.equal(1);
            return { showSpinner: data.loading };
        };
        var ContainerWithData = graphql_1.default(query, { props: props })(function (_a) {
            var showSpinner = _a.showSpinner;
            expect(showSpinner).to.be.true;
            return null;
        });
        var wrapper = enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContainerWithData, {sample: 1})));
        wrapper.unmount();
        var _a;
    });
    it('allows custom mapping of a result to props', function (done) {
        var query = (_a = ["query thing { getThing { thing } }"], _a.raw = ["query thing { getThing { thing } }"], graphql_tag_1.default(_a));
        var data = { getThing: { thing: true } };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query }, result: { data: data } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReceiveProps = function (props) {
                expect(props.thingy).to.deep.equal(data.getThing);
                done();
            };
            Container.prototype.render = function () {
                return null;
            };
            Container = __decorate([
                graphql_1.default(query, { props: function (_a) {
                        var data = _a.data;
                        return ({ thingy: data.getThing });
                    } })
            ], Container);
            return Container;
        }(React.Component));
        ;
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, null)));
        var _a;
    });
    it('allows context through updates', function (done) {
        var query = (_a = ["query people { allPeople(first: 1) { people { name } } }"], _a.raw = ["query people { allPeople(first: 1) { people { name } } }"], graphql_tag_1.default(_a));
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
            };
            Container.prototype.render = function () {
                return React.createElement("div", null, this.props.children);
            };
            Container = __decorate([
                graphql_1.default(query)
            ], Container);
            return Container;
        }(React.Component));
        ;
        var ContextContainer = (function (_super) {
            __extends(ContextContainer, _super);
            function ContextContainer(props) {
                _super.call(this, props);
                this.state = { color: 'purple' };
            }
            ContextContainer.prototype.getChildContext = function () {
                return { color: this.state.color };
            };
            ContextContainer.prototype.componentDidMount = function () {
                var _this = this;
                setTimeout(function () {
                    _this.setState({ color: 'green' });
                }, 50);
            };
            ContextContainer.prototype.render = function () {
                return React.createElement("div", null, this.props.children);
            };
            return ContextContainer;
        }(React.Component));
        ContextContainer.childContextTypes = {
            color: React.PropTypes.string,
        };
        var count = 0;
        var ChildContextContainer = (function (_super) {
            __extends(ChildContextContainer, _super);
            function ChildContextContainer() {
                _super.apply(this, arguments);
            }
            ChildContextContainer.prototype.render = function () {
                var color = this.context.color;
                if (count === 0)
                    expect(color).to.eq('purple');
                if (count === 1) {
                    expect(color).to.eq('green');
                    done();
                }
                count++;
                return React.createElement("div", null, this.props.children);
            };
            return ChildContextContainer;
        }(React.Component));
        ChildContextContainer.contextTypes = {
            color: React.PropTypes.string,
        };
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(ContextContainer, null, React.createElement(Container, null, React.createElement(ChildContextContainer, null)))));
        var _a;
    });
});
//# sourceMappingURL=queries.js.map