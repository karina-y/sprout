import React, { memo } from "react";
import { RouteComponentPropsCustom } from "@type";

// import "./CustomIcon.scss";

interface ICustomIconProps extends RouteComponentPropsCustom {
  path: string;
}

const CustomIcon = (
  props: ICustomIconProps,
  {
    style = {},
    fill = "#f00",
    width = "100%",
    className = "",
    height = "100%",
    viewBox = "0 0 32 32",
  },
) => (
  <svg
    width={width}
    style={style}
    height={height}
    viewBox={viewBox}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path d={props.path} fill={fill} />
  </svg>
);

export default memo(CustomIcon);
