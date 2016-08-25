"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Passthrough = (function (_super) {
    __extends(Passthrough, _super);
    function Passthrough() {
        _super.apply(this, arguments);
    }
    Passthrough.prototype.render = function () {
        return React.createElement("span", null);
    };
    return Passthrough;
}(React.Component));
exports.Passthrough = Passthrough;
;
var ProviderMock = (function (_super) {
    __extends(ProviderMock, _super);
    function ProviderMock(props, context) {
        _super.call(this, props, context);
        this.client = props.client;
        if (props.store) {
            this.store = props.store;
            return;
        }
        props.client.initStore();
        this.store = props.client.store;
    }
    ProviderMock.prototype.getChildContext = function () {
        return {
            store: this.store,
            client: this.client,
        };
    };
    ProviderMock.prototype.render = function () {
        var children = this.props.children;
        return React.Children.only(children);
    };
    ProviderMock.propTypes = {
        store: React.PropTypes.shape({
            subscribe: React.PropTypes.func.isRequired,
            dispatch: React.PropTypes.func.isRequired,
            getState: React.PropTypes.func.isRequired,
        }),
        client: React.PropTypes.object.isRequired,
        children: React.PropTypes.element.isRequired,
    };
    ProviderMock.childContextTypes = {
        store: React.PropTypes.object.isRequired,
        client: React.PropTypes.object.isRequired,
    };
    return ProviderMock;
}(React.Component));
exports.ProviderMock = ProviderMock;
;
//# sourceMappingURL=components.js.map