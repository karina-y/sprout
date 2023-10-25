import React, { ReactElement } from "react";
import PropTypes from "prop-types";
import "./ShadowBox.scss";

interface IShadowBoxProps {
  shadowLevel: 0 | 1 | 2 | 3 | 4 | 5; //TODO is there a cleaner way to do this?
  hoverAction: boolean;
  popoutHover: boolean;
  additionalOuterClasses?: string;
  bootstrapColClasses?: string;
  isActive?: boolean;
  children: ReactElement | Array<ReactElement>; // TODO confirm this is right or ReactNode?
}

class ShadowBox extends React.Component<IShadowBoxProps> {
  static propTypes: {
    shadowLevel: PropTypes.Validator<number>;
    hoverAction: PropTypes.Validator<boolean>;
    popoutHover: PropTypes.Validator<boolean>;
    additionalOuterClasses: PropTypes.Requireable<string>;
    bootstrapColClasses: PropTypes.Requireable<string>;
    isActive: PropTypes.Requireable<boolean>;
  };

  constructor(props: IShadowBoxProps) {
    super(props);

    this.state = {};
  }

  render() {
    const { additionalOuterClasses = "", bootstrapColClasses = "" } =
      this.props;

    const shadowLevel =
      this.props.shadowLevel != null
        ? `level-${this.props.shadowLevel}`
        : "level-0";

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
