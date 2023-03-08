import React from "react";
import PlantToDo from "@page/PlantToDo/PlantToDo";
import { shallow, mount, render } from "enzyme";

let props = {};
describe("<PlantToDo />", () => {
  const app = shallow(<PlantToDo {...props} />);

  it("<PlantToDo /> should render", () => {
    expect(app.exists()).toBe(true);
  });
});
