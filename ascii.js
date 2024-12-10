import { asciiElements } from "./asciiElements.js";
// TODO
// [] tooltip on ascii too close
// [] toolbar to choose type of ascii to render
// [x] axe to clear ascii
// [] clear coords array

let isAxeBeingPressed = false;
let action = null;

const ACTION_TYPES = {
  ADD_TREE: "add-tree",
  ADD_ANIMAL: "add-animal",
  USE_AXE: "use-axe",
};

Object.values(ACTION_TYPES).forEach((value) => {
  document.getElementById(value).onclick = () => {
    action = value;
  };
});

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

const decodeAscii = (asciiObj) => atob(asciiObj.base64);

const retriveRandomAscii = (asciiArray) => {
  const asciiObj = asciiArray[Math.floor(Math.random() * asciiArray.length)];
  return decodeAscii(asciiObj);
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

const addAscii = (AsciiType, x, y) => {
  const ascii = retriveRandomAscii(AsciiType);

  const isAsciiClose = checkIfAsciiTooClose(x, y);

  if (!isAsciiClose) {
    addAsciiCoords({ x, y });

    const element = addPre(x, y);

    materialiseAscii({
      ascii: ascii,
      element,
      interval: 2,
    });
  }
};

const axe = addPre(0, 0);
axe.innerHTML = decodeAscii(asciiElements.tools.axe);

document.body.addEventListener("click", (args) => {
  const y = window.innerHeight - args.clientY;
  const x = args.clientX;

  if (action === ACTION_TYPES.ADD_TREE) addAscii(asciiElements.trees, x, y);

  if (action === ACTION_TYPES.ADD_ANIMAL) addAscii(asciiElements.animals, x, y);
});

document.body.addEventListener("mousedown", () => {
  if (action === ACTION_TYPES.USE_AXE) {
    axe.classList.add("axe-cutting");
    isAxeBeingPressed = true;
  }
});

document.body.addEventListener("mouseup", () => {
  if (action === ACTION_TYPES.USE_AXE) {
    axe.classList.remove("axe-cutting");
    isAxeBeingPressed = false;
  }
});

document.body.addEventListener("mousemove", (args) => {
  if (action === ACTION_TYPES.USE_AXE) {
    const y = window.innerHeight - args.clientY;
    const x = args.clientX;

    axe.style.transform = "rotate(" + 25 + "deg)";

    axe.style.bottom = y + "px";
    axe.style.left = x + "px";

    if (
      args.target !== axe &&
      args.target.tagName === "PRE" &&
      isAxeBeingPressed
    ) {
      document.body.removeChild(args.target);
    }
  }
});
