import { useState } from "react";

function usePruneType(initial) {
  const [pruneType, setPruneType] = useState(initial);

  return { pruneType, setPruneType };
}

export default usePruneType;
