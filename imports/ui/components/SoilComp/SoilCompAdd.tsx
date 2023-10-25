import React from "react";
import PropTypes from "prop-types";
import { SwipePanelContent } from "@component";
import { RouteComponentPropsCustom } from "@type";
import { Categories, SoilCompDetailType } from "@enum";

interface ISoilCompAddProps extends RouteComponentPropsCustom {
  updateData: (
    e: React.ChangeEvent<HTMLInputElement>,
    type: SoilCompDetailType,
  ) => void;
  category?: Categories;
}

const SoilCompAdd = (props: ISoilCompAddProps) => {
  const { updateData, category } = props;

  return (
    <div className="swipe-slide">
      <p className="swipe-title title-ming">Soil Composition</p>

      {category === "in-ground" ? (
        <SwipePanelContent icon="ph">
          <p className="modern-input">
            pH{" "}
            <input
              type="number"
              min="0"
              inputMode="numeric"
              pattern="[0-9]*"
              className="small"
              placeholder="6.2"
              onChange={(e) => updateData(e, SoilCompDetailType.PH)}
            />
          </p>
        </SwipePanelContent>
      ) : category === "potted" ? (
        <React.Fragment>
          <SwipePanelContent icon="soilMoisture">
            <p className="modern-input">
              Moisture Level{" "}
              <input
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                className="small"
                placeholder="40"
                onChange={(e) => updateData(e, SoilCompDetailType.MOISTURE)}
              />
              %
            </p>
          </SwipePanelContent>
        </React.Fragment>
      ) : (
        <p>Please select a category on the first panel.</p>
      )}
    </div>
  );
};

SoilCompAdd.propTypes = {
  item: PropTypes.object.isRequired,
  updateData: PropTypes.func.isRequired,
  category: PropTypes.string,
};

export default SoilCompAdd;
