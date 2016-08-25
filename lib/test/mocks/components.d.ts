import * as React from 'react';
export declare class Passthrough extends React.Component<any, any> {
    render(): JSX.Element;
}
export declare class ProviderMock extends React.Component<any, any> {
    static propTypes: {
        store: React.Requireable<any>;
        client: React.Validator<any>;
        children: React.Validator<any>;
    };
    static childContextTypes: {
        store: React.Validator<any>;
        client: React.Validator<any>;
    };
    store: any;
    client: any;
    constructor(props: any, context: any);
    getChildContext(): {
        store: any;
        client: any;
    };
    render(): React.ReactElement<any>;
}
