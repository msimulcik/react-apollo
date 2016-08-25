"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var react_1 = require('react');
var isEqual = require('lodash.isequal');
var flatten = require('lodash.flatten');
var shallowEqual_1 = require('./shallowEqual');
var invariant = require('invariant');
var assign = require('object-assign');
var hoistNonReactStatics = require('hoist-non-react-statics');
var apollo_client_1 = require('apollo-client');
var getFromAST_1 = require('apollo-client/queries/getFromAST');
var errors_1 = require('apollo-client/errors');
var parser_1 = require('./parser');
var defaultQueryData = {
    loading: true,
    errors: null,
};
var defaultMapPropsToOptions = function (props) { return ({}); };
var defaultMapResultToProps = function (props) { return props; };
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
var nextVersion = 0;
function withApollo(WrappedComponent) {
    var withDisplayName = "withApollo(" + getDisplayName(WrappedComponent) + ")";
    var WithApollo = (function (_super) {
        __extends(WithApollo, _super);
        function WithApollo(props, context) {
            _super.call(this, props, context);
            this.client = props.client || context.client;
            invariant(!!this.client, "Could not find \"client\" in either the context or " +
                ("props of \"" + withDisplayName + "\". ") +
                "Either wrap the root component in an <ApolloProvider>, " +
                ("or explicitly pass \"client\" as a prop to \"" + withDisplayName + "\"."));
        }
        WithApollo.prototype.render = function () {
            var props = assign({}, this.props);
            props.client = this.client;
            return react_1.createElement(WrappedComponent, props);
        };
        WithApollo.displayName = withDisplayName;
        WithApollo.WrappedComponent = WrappedComponent;
        WithApollo.contextTypes = { client: react_1.PropTypes.object.isRequired };
        return WithApollo;
    }(react_1.Component));
    return hoistNonReactStatics(WithApollo, WrappedComponent);
}
exports.withApollo = withApollo;
;
function graphql(document, operationOptions) {
    if (operationOptions === void 0) { operationOptions = {}; }
    var _a = operationOptions.options, options = _a === void 0 ? defaultMapPropsToOptions : _a;
    var mapPropsToOptions = options;
    if (typeof mapPropsToOptions !== 'function')
        mapPropsToOptions = function () { return options; };
    var mapResultToProps = operationOptions.props;
    var operation = parser_1.parser(document);
    var version = nextVersion++;
    return function wrapWithApolloComponent(WrappedComponent) {
        var graphQLDisplayName = "Apollo(" + getDisplayName(WrappedComponent) + ")";
        function calculateFragments(opts) {
            if (opts.fragments || operation.fragments.length) {
                if (!opts.fragments) {
                    opts.fragments = flatten(operation.fragments.slice());
                }
                else {
                    opts.fragments = flatten(opts.fragments.concat(operation.fragments));
                }
            }
        }
        function calculateOptions(props, newOpts) {
            var opts = mapPropsToOptions(props);
            if (newOpts && newOpts.variables) {
                newOpts.variables = assign({}, opts.variables, newOpts.variables);
            }
            if (newOpts)
                opts = assign({}, opts, newOpts);
            if (opts.variables || !operation.variables.length)
                return opts;
            var variables = {};
            for (var _i = 0, _a = operation.variables; _i < _a.length; _i++) {
                var variable = _a[_i].variable;
                if (!variable.name || !variable.name.value)
                    continue;
                if (typeof props[variable.name.value] !== 'undefined') {
                    variables[variable.name.value] = props[variable.name.value];
                    continue;
                }
                invariant(typeof props[variable.name.value] !== 'undefined', ("The operation '" + operation.name + "' wrapping '" + getDisplayName(WrappedComponent) + "' ") +
                    ("is expecting a variable: '" + variable.name.value + "' but it was not found in the props ") +
                    ("passed to '" + graphQLDisplayName + "'"));
            }
            opts.variables = variables;
            return opts;
        }
        function fetchData(props, _a) {
            var client = _a.client;
            if (operation.type === parser_1.DocumentType.Mutation)
                return false;
            var opts = calculateOptions(props);
            opts.query = document;
            if (opts.ssr === false)
                return false;
            if (!opts.variables)
                delete opts.variables;
            calculateFragments(opts);
            try {
                apollo_client_1.readQueryFromStore({
                    store: client.store.getState()[client.reduxRootKey].data,
                    query: opts.query,
                    variables: opts.variables,
                    fragmentMap: getFromAST_1.createFragmentMap(opts.fragments),
                });
                return false;
            }
            catch (e) { }
            return client.query(opts);
        }
        var GraphQL = (function (_super) {
            __extends(GraphQL, _super);
            function GraphQL(props, context) {
                _super.call(this, props, context);
                this.data = {};
                this.version = version;
                this.client = props.client || context.client;
                this.store = this.client.store;
                invariant(!!this.client, "Could not find \"client\" in either the context or " +
                    ("props of \"" + graphQLDisplayName + "\". ") +
                    "Either wrap the root component in an <ApolloProvider>, " +
                    ("or explicitly pass \"client\" as a prop to \"" + graphQLDisplayName + "\"."));
                this.type = operation.type;
                this.queryObservable = {};
                this.querySubscription = {};
                this.setInitialProps();
            }
            GraphQL.prototype.componentDidMount = function () {
                this.hasMounted = true;
                if (this.type === parser_1.DocumentType.Mutation)
                    return;
                this.subscribeToQuery(this.props);
            };
            GraphQL.prototype.componentWillReceiveProps = function (nextProps) {
                if (shallowEqual_1.default(this.props, nextProps))
                    return;
                if (this.type === parser_1.DocumentType.Mutation) {
                    this.createWrappedMutation(nextProps, true);
                    return;
                }
                ;
                this.haveOwnPropsChanged = true;
                this.subscribeToQuery(nextProps);
            };
            GraphQL.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
                return !!nextContext || this.haveOwnPropsChanged || this.hasOperationDataChanged;
            };
            GraphQL.prototype.componentWillUnmount = function () {
                if (this.type === parser_1.DocumentType.Query)
                    this.unsubscribeFromQuery();
                this.hasMounted = false;
            };
            GraphQL.prototype.calculateOptions = function (props, newProps) { return calculateOptions(props, newProps); };
            ;
            GraphQL.prototype.calculateResultProps = function (result) {
                var name = this.type === parser_1.DocumentType.Query ? 'data' : 'mutate';
                if (operationOptions.name)
                    name = operationOptions.name;
                var newResult = (_a = {}, _a[name] = result, _a.ownProps = this.props, _a);
                if (mapResultToProps)
                    return mapResultToProps(newResult);
                return (_b = {}, _b[name] = defaultMapResultToProps(result), _b);
                var _a, _b;
            };
            GraphQL.prototype.setInitialProps = function () {
                var _this = this;
                if (this.type === parser_1.DocumentType.Mutation) {
                    this.createWrappedMutation(this.props);
                    return;
                }
                var reduxRootKey = this.client.reduxRootKey;
                var _a = this.calculateOptions(this.props), variables = _a.variables, forceFetch = _a.forceFetch;
                var queryData = defaultQueryData;
                queryData.variables = variables;
                if (!forceFetch) {
                    try {
                        var result = apollo_client_1.readQueryFromStore({
                            store: this.store.getState()[reduxRootKey].data,
                            query: document,
                            variables: variables,
                        });
                        var refetch = function (vars) {
                            return _this.client.query({
                                query: document,
                                variables: vars,
                            });
                        };
                        var fetchMore = function (opts) {
                            opts.query = document;
                            return _this.client.query(opts);
                        };
                        queryData = assign({
                            errors: null, loading: false, variables: variables, refetch: refetch, fetchMore: fetchMore,
                        }, result);
                    }
                    catch (e) { }
                }
                this.data = queryData;
            };
            GraphQL.prototype.subscribeToQuery = function (props) {
                var watchQuery = this.client.watchQuery;
                var opts = calculateOptions(props);
                if (opts.skip)
                    return;
                if (isEqual(opts, this.previousOpts))
                    return false;
                var old = assign({}, this.previousOpts);
                var neu = assign({}, opts);
                delete old.variables;
                delete neu.variables;
                if (this.previousOpts &&
                    (!shallowEqual_1.default(opts.variables, this.previousOpts.variables)) &&
                    (shallowEqual_1.default(old, neu))) {
                    this.data.refetch(opts.variables);
                    this.previousOpts = opts;
                    return;
                }
                this.previousOpts = opts;
                var previousQuery = this.queryObservable;
                this.unsubscribeFromQuery();
                var queryOptions = assign({ query: document }, opts);
                calculateFragments(queryOptions);
                var observableQuery = watchQuery(queryOptions);
                var queryId = observableQuery.queryId;
                if (previousQuery.queryId && previousQuery.queryId !== queryId) {
                    this.data = assign(this.data, { loading: true });
                    this.hasOperationDataChanged = true;
                    this.forceRenderChildren();
                }
                this.handleQueryData(observableQuery, queryOptions);
            };
            GraphQL.prototype.unsubscribeFromQuery = function () {
                if (this.querySubscription.unsubscribe) {
                    this.querySubscription.unsubscribe();
                    delete this.queryObservable;
                }
            };
            GraphQL.prototype.handleQueryData = function (observableQuery, _a) {
                var _this = this;
                var variables = _a.variables;
                var reduxRootKey = this.client.reduxRootKey;
                var refetch, fetchMore, startPolling, stopPolling, oldData = {};
                var next = function (_a) {
                    var _b = _a.data, data = _b === void 0 ? oldData : _b, loading = _a.loading, error = _a.error;
                    var queryId = observableQuery.queryId;
                    var initialVariables = _this.store.getState()[reduxRootKey].queries[queryId].variables;
                    var resultKeyConflict = ('errors' in data ||
                        'loading' in data ||
                        'refetch' in data ||
                        'fetchMore' in data ||
                        'startPolling' in data ||
                        'stopPolling' in data);
                    invariant(!resultKeyConflict, ("the result of the '" + graphQLDisplayName + "' operation contains keys that ") +
                        "conflict with the return object. 'errors', 'loading', " +
                        "'startPolling', 'stopPolling', 'fetchMore', and 'refetch' cannot be " +
                        "returned keys");
                    if (!isEqual(oldData, data) || loading !== _this.data.loading) {
                        _this.hasOperationDataChanged = true;
                    }
                    oldData = assign({}, data);
                    _this.data = assign({
                        variables: _this.data.variables || initialVariables,
                        loading: loading,
                        refetch: refetch,
                        startPolling: startPolling,
                        stopPolling: stopPolling,
                        fetchMore: fetchMore,
                        error: error,
                    }, data);
                    _this.forceRenderChildren();
                };
                var createBoundRefetch = function (refetchMethod) { return function (vars) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var newVariables = vars;
                    var newData = { loading: true };
                    if (vars && (vars.variables || vars.query || vars.updateQuery)) {
                        newVariables = assign({}, _this.data.variables, vars.variables);
                        newData.variables = newVariables;
                    }
                    _this.data = assign(_this.data, newData);
                    _this.hasOperationDataChanged = true;
                    _this.forceRenderChildren();
                    return refetchMethod.apply(void 0, [vars].concat(args))
                        .then(function (result) {
                        if (result && isEqual(result.data, oldData))
                            next(result);
                        return result;
                    });
                }; };
                this.queryObservable = observableQuery;
                var handleError = function (error) {
                    if (error instanceof errors_1.ApolloError)
                        return next({ error: error });
                    throw error;
                };
                this.querySubscription = observableQuery.subscribe({ next: next, error: handleError });
                refetch = createBoundRefetch(this.queryObservable.refetch);
                fetchMore = createBoundRefetch(this.queryObservable.fetchMore);
                startPolling = this.queryObservable.startPolling;
                stopPolling = this.queryObservable.stopPolling;
                delete this.data.error;
                this.data = assign(this.data, { refetch: refetch, startPolling: startPolling, stopPolling: stopPolling, fetchMore: fetchMore, variables: variables });
            };
            GraphQL.prototype.forceRenderChildren = function () {
                if (this.hasMounted)
                    this.setState({});
            };
            GraphQL.prototype.getWrappedInstance = function () {
                invariant(operationOptions.withRef, "To access the wrapped instance, you need to specify " +
                    "{ withRef: true } in the options");
                return this.refs.wrappedInstance;
            };
            GraphQL.prototype.createWrappedMutation = function (props, reRender) {
                var _this = this;
                if (reRender === void 0) { reRender = false; }
                if (this.type !== parser_1.DocumentType.Mutation)
                    return;
                this.data = function (opts) {
                    opts = _this.calculateOptions(props, opts);
                    if (typeof opts.variables === 'undefined')
                        delete opts.variables;
                    opts.mutation = document;
                    calculateFragments(opts);
                    return _this.client.mutate(opts);
                };
                if (!reRender)
                    return;
                this.hasOperationDataChanged = true;
                this.forceRenderChildren();
            };
            GraphQL.prototype.render = function () {
                var _a = this, haveOwnPropsChanged = _a.haveOwnPropsChanged, hasOperationDataChanged = _a.hasOperationDataChanged, renderedElement = _a.renderedElement, props = _a.props, data = _a.data;
                this.haveOwnPropsChanged = false;
                this.hasOperationDataChanged = false;
                var clientProps = this.calculateResultProps(data);
                var mergedPropsAndData = assign({}, props, clientProps);
                if (!haveOwnPropsChanged && !hasOperationDataChanged && renderedElement) {
                    return renderedElement;
                }
                if (operationOptions.withRef)
                    mergedPropsAndData.ref = 'wrappedInstance';
                this.renderedElement = react_1.createElement(WrappedComponent, mergedPropsAndData);
                return this.renderedElement;
            };
            GraphQL.displayName = graphQLDisplayName;
            GraphQL.WrappedComponent = WrappedComponent;
            GraphQL.contextTypes = {
                store: react_1.PropTypes.object.isRequired,
                client: react_1.PropTypes.object.isRequired,
            };
            GraphQL.fragments = operation.fragments;
            return GraphQL;
        }(react_1.Component));
        if (operation.type === parser_1.DocumentType.Query)
            GraphQL.fetchData = fetchData;
        return hoistNonReactStatics(GraphQL, WrappedComponent);
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = graphql;
;
//# sourceMappingURL=graphql.js.map