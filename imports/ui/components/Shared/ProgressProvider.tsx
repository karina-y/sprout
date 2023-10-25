import { useEffect, useState } from "react";

// If you don't have a version of React that supports
// hooks, you can use a class-based version of this
// component in ProgressProviderUsingClass.js

//TODO no fucking clue what these types are, i don't see this being used anyway
//@ts-ignore
const ProgressProvider = ({ valueStart, valueEnd, children }) => {
  const [value, setValue] = useState(valueStart);

  useEffect(() => {
    setValue(valueEnd);
  }, [valueEnd]);

  return children(value);
};

export default ProgressProvider;
