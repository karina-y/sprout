/**
 * Check if item is null/empty
 * @param item
 */
export const isNull = (item: unknown): boolean => {
  let isItemNull = false;

  if (Array.isArray(item) && item.length === 0) {
    isItemNull = true;
  } else if (item == null) {
    isItemNull = true;
  } else if (item === "") {
    isItemNull = true;
  } else if (!item) {
    isItemNull = true;
  } else if (JSON.stringify(item) === "{}") {
    isItemNull = true;
  }

  return isItemNull;
};
