import { trees } from "./trees.js";
import { animals } from "./animals.js";

const enforceMinimumDistance = ({ minimumDistance }) => {
  const coordsArray = [];

  const checkIfTooClose = (x, y) =>
    coordsArray.some(
      (coords) =>
        x > coords.x - minimumDistance &&
        x < coords.x + minimumDistance &&
        y > coords.y - minimumDistance &&
        y < coords.y + minimumDistance
    );

  const addToCoords = ({ x, y }) => coordsArray.push({ x, y });

  return [checkIfTooClose, addToCoords];
};

const materialiseAscii = ({ ascii, element, interval }) => {
  for (let i = 0; i < ascii.length; i++) {
    setTimeout(() => {
      element.innerHTML = ascii[ascii.length - 1 - i] + element.innerHTML;
    }, i * interval);
  }
};

const retriveRandomAscii = (asciiArray) => {
  const asciiObj = asciiArray[Math.floor(Math.random() * asciiArray.length)];
  return atob(asciiObj.base64);
};

const addPre = (x, y) => {
  const newPre = document.createElement("pre");
  newPre.style.position = "absolute";
  newPre.style.bottom = y + "px";
  newPre.style.left = x + "px";

  document.body.appendChild(newPre);
  return newPre;
};

const [checkIfAsciiTooClose, addAsciiCoords] = enforceMinimumDistance({
  minimumDistance: 150,
});

document.body.addEventListener("click", (args) => {
  const tree = retriveRandomAscii(trees);

  const y = window.innerHeight - args.clientY;
  const x = args.clientX;

  const isTreeClose = checkIfAsciiTooClose(x, y);

  if (!isTreeClose) {
    addAsciiCoords({ x, y });

    const element = addPre(x, y);

    materialiseAscii({
      ascii: tree,
      element,
      interval: 2,
    });
  }
});

document.body.addEventListener("wheel", (args) => {
  const animal = retriveRandomAscii(animals);

  const y = window.innerHeight - args.clientY;
  const x = args.clientX;

  const isAnimalClose = checkIfAsciiTooClose(x, y);

  if (!isAnimalClose) {
    addAsciiCoords({ x, y });

    const element = addPre(x, y);

    materialiseAscii({
      ascii: animal,
      element,
      interval: 2,
    });
  }
});
