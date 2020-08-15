export function selectRandomPlantPicture() {

  const number = Math.floor(Math.random() * 11) + 1;

  if (number < 10) {
    return `/images/plant-0${number.toString()}.jpg`;
  } else {
	return `/images/plant-${number.toString()}.jpg`;
  }
}
