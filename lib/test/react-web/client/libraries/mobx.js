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
var mobx_react_1 = require('mobx-react');
var mobx_1 = require('mobx');
var graphql_tag_1 = require('graphql-tag');
var apollo_client_1 = require('apollo-client');
var chaiEnzyme = require('chai-enzyme');
chai.use(chaiEnzyme());
var expect = chai.expect;
var components_1 = require('../../../mocks/components');
var mockNetworkInterface_1 = require('../../../mocks/mockNetworkInterface');
var graphql_1 = require('../../../../src/graphql');
describe('mobx integration', function () {
    var AppState = (function () {
        function AppState() {
            var _this = this;
            this.first = 0;
            setInterval(function () {
                if (_this.first <= 2)
                    _this.first += 1;
            }, 250);
        }
        AppState.prototype.reset = function () {
            this.first = 0;
        };
        __decorate([
            mobx_1.observable
        ], AppState.prototype, "first", void 0);
        return AppState;
    }());
    it('works with mobx', function (done) {
        var query = (_a = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], _a.raw = ["query people($first: Int) { allPeople(first: $first) { people { name } } }"], graphql_tag_1.default(_a));
        var data = { allPeople: { people: [{ name: 'Luke Skywalker' }] } };
        var variables = { first: 0 };
        var data2 = { allPeople: { people: [{ name: 'Leia Skywalker' }] } };
        var variables2 = { first: 1 };
        var networkInterface = mockNetworkInterface_1.default({ request: { query: query, variables: variables }, result: { data: data } }, { request: { query: query, variables: variables2 }, result: { data: data2 } });
        var client = new apollo_client_1.default({ networkInterface: networkInterface });
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container() {
                _super.apply(this, arguments);
            }
            Container.prototype.componentWillReact = function () {
                if (this.props.appState.first === 1) {
                    this.props.data.refetch({ first: this.props.appState.first });
                }
            };
            Container.prototype.componentWillReceiveProps = function (nextProps) {
                if (this.props.appState.first === 1) {
                    if (nextProps.data.loading)
                        return;
                    expect(nextProps.data.allPeople).to.deep.equal(data2.allPeople);
                    done();
                }
            };
            Container.prototype.render = function () {
                return React.createElement("div", null, this.props.appState.first);
            };
            Container = __decorate([
                graphql_1.default(query, {
                    options: function (props) { return ({ variables: { first: props.appState.first } }); },
                }),
                mobx_react_1.observer
            ], Container);
            return Container;
        }(React.Component));
        ;
        var appState = new AppState();
        enzyme_1.mount(React.createElement(components_1.ProviderMock, {client: client}, React.createElement(Container, {appState: appState})));
        var _a;
    });
});
//# sourceMappingURL=mobx.js.map