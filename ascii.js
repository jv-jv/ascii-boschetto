import { asciiElements } from "./asciiElements.js";
import {
  enforceMinimumDistance,
  materialiseAscii,
  decodeAscii,
  retriveRandomAscii,
  addPre,
} from "./utils.js";

// TODO
// [] tooltip on ascii too close
// [] toolbar to choose type of ascii to render

// set action and behaviour
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

const [checkIfAsciiTooClose, addAsciiCoords, removeFromCoords] =
  enforceMinimumDistance({
    minimumDistance: 150,
  });

// Axe
const axe = addPre(0, 0);
axe.innerHTML = decodeAscii(asciiElements.tools.axe);
let isAxeBeingPressed = false;

const axeMoveAndDelete = (args) => {
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
    const y = Number(args.target.style.bottom.split("px")[0]);
    const x = Number(args.target.style.left.split("px")[0]);

    removeFromCoords({ x, y });
    document.body.removeChild(args.target);
  }
};

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

// Event listeners

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
    axeMoveAndDelete(args);
  }
});

document.body.addEventListener("touchmove", (args) => {
  if (action === ACTION_TYPES.USE_AXE) {
    axeMoveAndDelete(args);
  }
});
