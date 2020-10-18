import React from "react";
import PropTypes from "prop-types";

class ResponsiveImage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const small = `/images/${this.props.image}_350.jpg`;
    const medium = `/images/${this.props.image}_768.jpg`;
    const large = `/images/${this.props.image}_1280.jpg`;
    const xlarge = `/images/${this.props.image}_3200.jpg`;
    const xxlarge = `/images/${this.props.image}_4000.jpg`;

    return (
      <img
        src={small}
        srcSet={`${small} 350w, ${medium} 768w, ${large} 1280w, ${xlarge} 3200w, ${xxlarge} 4000w`}
        className={this.props.additionalOuterClasses || ""}
        alt={this.props.imageAlt}
        /*onLoad={this.onLoad}*/
      />
    );
  }
}

ResponsiveImage.propTypes = {
  image: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  additionalOuterClasses: PropTypes.string,
};

export default ResponsiveImage;
