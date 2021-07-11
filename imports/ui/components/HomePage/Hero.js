import React, { memo } from "react";
import "./Hero.scss";

const Hero = () => (
  <div className="HeroPanel panel">
    <div className="left-panel">
      <h1 className="hero-title">sprout.</h1>

      {/*https://dribbble.com/shots/1777402-I-Am-Groot?1414061591*/}
      <img src="/images/groot.gif" className="groot" alt="baby groot dancing" title="navigation" />
    </div>

    <div className="right-panel">
      <h4>
        track your watering.
        <br />
        track your fertilizing.
        <br />
        track your everything.
        <br />
        and grow happier plants.
      </h4>
    </div>
  </div>
);

export default memo(Hero);
