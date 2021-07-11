import React, { memo } from "react";
import "./LusciousLocks.scss";

const LusciousLocks = () => (
  <div className="LusciousLocks panel" id="lusciousLocks">
    <div className="right-panel text-panel panel-title-container">
      <h2 className="panel-title">Let down those luscious locks</h2>

      <p className="subtitle">
        By tracking your watering and fertilizing habits, maintaining optimal soil moisture, and
        singing to your plants, they'll grow the most beautiful luscious locks! Lorem ipsum dolor
        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </p>
    </div>

    <div className="left-panel img-panel"></div>
  </div>
);

export default memo(LusciousLocks);
