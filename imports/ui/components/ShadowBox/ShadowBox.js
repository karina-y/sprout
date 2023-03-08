import React from "react";
import PropTypes from "prop-types";
import "./ShadowBox.scss";

class ShadowBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const shadowLevel =
      this.props.shadowLevel != null
        ? `level-${this.props.shadowLevel}`
        : "level-0";

    const additionalOuterClasses = this.props.additionalOuterClasses || "";
    const bootstrapColClasses = this.props.bootstrapColClasses || "";
    const hoverAction = this.props.hoverAction ? "shadow-hover" : "";
    const popoutHover = this.props.popoutHover ? "popout-hover" : "";

    const outerClassName = `ShadowBox ${additionalOuterClasses} ${shadowLevel} ${hoverAction} ${popoutHover} ${
      this.props.isActive ? "active" : ""
    }`;

    return this.props.bootstrapColClasses ? (
      <div className={bootstrapColClasses}>
        <div className={outerClassName}>{this.props.children}</div>
      </div>
    ) : (
      <div className={outerClassName}>{this.props.children}</div>
    );
  }
}

/*  ACCEPTABLE PROP VALUES
    shadowLevel:            0-5
    hoverAction:            true or false   ONLY USE ONE HOVERACTION OR POPOUTHOVER, NEVER BOTH
    popoutHover:            true or false   ONLY USE ONE HOVERACTION OR POPOUTHOVER, NEVER BOTH
    bootstrapColClasses:    meant for any bootstrap column classes (ie col-xs-12 col-md-4 col-lg-push-1 hidden-xs etc)
    additionalOuterClasses: any string
 */

ShadowBox.propTypes = {
  shadowLevel: PropTypes.number.isRequired,
  hoverAction: PropTypes.bool.isRequired,
  popoutHover: PropTypes.bool.isRequired,
  additionalOuterClasses: PropTypes.string,
  bootstrapColClasses: PropTypes.string,
  isActive: PropTypes.bool,
};

export default ShadowBox;
