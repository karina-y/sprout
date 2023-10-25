import React, { memo } from "react";
import LazyLoad from "react-lazyload";
import { Hero, WeGotYou, LusciousLocks, GodMode, SignMeUp } from "@component";

const HomePage = (props) => (
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
