import React, { memo } from "react";
import "./SignMeUp.scss";
import { RouteComponentPropsCustom } from "@type";
import { Meteor } from "meteor/meteor";
import { useNavigate } from "react-router";

type ISignMeUpProps = RouteComponentPropsCustom;

const SignMeUp = (_props: ISignMeUpProps) => {
  const navigate = useNavigate();

  return (
    <div className="SignMeUpPanel panel" id="download">
      {Meteor.isCordova ? (
        <button className="pop get-started btn-md">get started</button>
      ) : (
        <button className="pop btn-md" onClick={() => navigate("sign-up")}>
          sign up
        </button>
      )}
    </div>
  );
};

export default memo(SignMeUp);
