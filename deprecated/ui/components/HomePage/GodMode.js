import React, { Component } from "react";
import "./GodMode.scss";

class GodMode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMercilessGod: true,
    };
  }

  render() {
    return (
      <div className="GodMode panel" id="godMode">
        <div
          className={`left-panel img-panel ${
            !this.state.isMercilessGod && "evil"
          }`}
          onClick={() =>
            this.setState({ isMercilessGod: !this.state.isMercilessGod })
          }
        ></div>

        <div className="right-panel text-panel panel-title-container">
          <h2 className="panel-title">Become a god among gods!</h2>

          <p className="subtitle">
            Watch the growth, watch the life sprout from within your own hands,
            enter: God Mode. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
    );
  }
}

export default GodMode;
