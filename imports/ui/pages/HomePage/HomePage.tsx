import React, { memo } from "react";
import LazyLoad from "react-lazyload";
import { GodMode, Hero, LusciousLocks, SignMeUp, WeGotYou } from "@component";
import { RouteComponentPropsCustom } from "@type";

// TODO type the props correctly
const HomePage = (props: RouteComponentPropsCustom) => (
  <div className="HomePage">
    <Hero />

    <LazyLoad height={"100vh"} once={true}>
      <React.Fragment>
        <WeGotYou />

        <LusciousLocks />

        <GodMode />

        <SignMeUp {...props} />
      </React.Fragment>
    </LazyLoad>
  </div>
);

export default memo(HomePage);
