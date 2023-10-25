/* eslint-disable */
//@ts-nocheck
// TODO ^
import { StaticContext } from "react-router";
import * as H from "history";

interface matchCustom<Params extends { [K in keyof Params]?: string } = {}> {
  params: Params;
  isExact: boolean;
  path: string;
  url: string;
}

export interface RouteComponentPropsCustom<
  //@ts-ignore
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState,
> {
  history?: H.History<S>;
  location?: H.Location<S>;
  match?: matchCustom<Params>;
  staticContext?: C | undefined;
}
