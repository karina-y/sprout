import React, { Component, ReactComponentElement } from "react";
import { RouteComponentPropsCustom } from "@type";

type IAsyncComponentProps = RouteComponentPropsCustom;
interface IAsyncComponentState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ReactComponentElement<any>; //TODO is this right?
}

//TODO fix this importComponent type, should be: function stuff(): Promise<{readonly default: Login}>
export default function asyncComponent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importComponent: () => Promise<{ readonly default: any }>,
) {
  class AsyncComponent extends Component<
    IAsyncComponentProps,
    IAsyncComponentState
  > {
    //@ts-ignore
    constructor(props) {
      super(props);

      this.state = {
        //@ts-ignore
        component: null,
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component,
      });
    }

    render() {
      const C = this.state.component;

      // @ts-ignore
      return C ? <C {...this.props} /> : null;
    }
  }

  return AsyncComponent;
}
