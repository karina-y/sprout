import React, { memo } from "react";
import "./LegalStuff.scss";

//TODO make this more official

const LegalStuff = () => (
  <div className="LegalStuff">
    <h5>
      <b>Credits:</b>
    </h5>

    <div className="credit-item">
      Plant profile placeholder images:{" "}
      <a href="https://www.freepik.com/free-photos-vectors/flower">
        Flower vector created by pch.vector - www.freepik.com
      </a>
    </div>

    <div className="credit-item">
      Icons made by{" "}
      <a
        href="https://www.flaticon.com/authors/nikita-golubev"
        title="Nikita Golubev"
      >
        Nikita Golubev
      </a>{" "}
      from{" "}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </div>

    <div className="credit-item">
      Icons made by{" "}
      <a href="https://www.flaticon.com/authors/iconixar" title="iconixar">
        iconixar
      </a>{" "}
      from{" "}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </div>

    <div className="credit-item">
      Icons made by{" "}
      <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
        Freepik
      </a>{" "}
      from{" "}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </div>

    {/*<div className="credit-item">Dancing Groot by <a href="https://dribbble.com/shots/1777402-I-Am-Groot?1414061591" title="dribbble">Sunako</a></div>*/}

    <div className="credit-item">
      Plant loading gif found online, if you created this gif and would like
      credit or for me to remove it, please contact me.
    </div>

    <br />

    <h5>
      <b>Data Collection:</b>
    </h5>
    <div className="credit-item">
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      I don't collect your data. Your plant information is stored on a secure
      cloud database. All passwords are encrypted. The only data collected is
      the data entered and it is only for your use, I do not sell or use the
      information in any way.
      <br />
      The only thing that is tracked are errors and crashes.
    </div>

    {/*TODO get sprout email*/}
    <h5>
      <b>Contact:</b>
    </h5>
    <div className="credit-item">
      &copy; sprout 2020 | info@sprout.karinacodes.com
    </div>
  </div>
);

export default memo(LegalStuff);
