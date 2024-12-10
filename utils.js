export const enforceMinimumDistance = ({ minimumDistance }) => {
  const coordsArray = [];

  const checkIfTooClose = (x, y) =>
    coordsArray.some(
      (coords) =>
        x > coords.x - minimumDistance &&
        x < coords.x + minimumDistance &&
        y > coords.y - minimumDistance &&
        y < coords.y + minimumDistance
    );

  const addToCoords = ({ x, y }) => {
    coordsArray.push({ x, y });
  };

  const removeFromCoords = ({ x, y }) => {
    const index = coordsArray.findIndex(
      (coord) => coord.x === x && coord.y === y
    );
    if (index !== -1) {
      coordsArray.splice(index, 1);
    }
  };

  return [checkIfTooClose, addToCoords, removeFromCoords];
};

export const materialiseAscii = ({ ascii, element, interval }) => {
  for (let i = 0; i < ascii.length; i++) {
    setTimeout(() => {
      element.innerHTML = ascii[ascii.length - 1 - i] + element.innerHTML;
    }, i * interval);
  }
};

export const decodeAscii = (asciiObj) => atob(asciiObj.base64);

export const retriveRandomAscii = (asciiArray) => {
  const asciiObj = asciiArray[Math.floor(Math.random() * asciiArray.length)];
  return decodeAscii(asciiObj);
};

export const addPre = (x, y) => {
  const newPre = document.createElement("pre");
  newPre.style.position = "absolute";
  newPre.style.bottom = y + "px";
  newPre.style.left = x + "px";

  document.body.appendChild(newPre);
  return newPre;
};
