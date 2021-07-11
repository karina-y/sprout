import React, { memo } from "react";
import "./Loading.scss";

//TODO edit cactus gif so it has no background
const Loading = () => (
  <div className="Loading flex-center">
    {/*TODO remove this eventually but for now it's pretty hilarious*/}
    {/*<img src="/images/cactus.gif" className="cactus-gif" alt="loading animation" title="loading animation" />*/}
    <img
      src="/images/loading.gif"
      className="plant-gif"
      alt="loading animation"
      title="loading animation"
    />
    {/*<img src="/images/groot.gif" alt="baby groot dancing" title="loading gif" />*/}
  </div>
);

export default memo(Loading);
