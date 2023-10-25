import React from "react";
import PropTypes from "prop-types";
import { RouteComponentPropsCustom } from "@type";

interface IResponsiveImageProps extends RouteComponentPropsCustom {
  image: string;
  imageAlt: string;
  additionalOuterClasses?: string;
}

const ResponsiveImage = (props: IResponsiveImageProps) => {
  const { image, imageAlt, additionalOuterClasses } = props;

  const small = `/images/${image}_350.jpg`;
  const medium = `/images/${image}_768.jpg`;
  const large = `/images/${image}_1280.jpg`;
  const xlarge = `/images/${image}_3200.jpg`;
  const xxlarge = `/images/${image}_4000.jpg`;

  return (
    <img
      src={small}
      srcSet={`${small} 350w, ${medium} 768w, ${large} 1280w, ${xlarge} 3200w, ${xxlarge} 4000w`}
      className={additionalOuterClasses || ""}
      alt={imageAlt}
      /*onLoad={this.onLoad}*/
    />
  );
};

ResponsiveImage.propTypes = {
  image: PropTypes.string.isRequired,
  imageAlt: PropTypes.string.isRequired,
  additionalOuterClasses: PropTypes.string,
};

export default ResponsiveImage;
