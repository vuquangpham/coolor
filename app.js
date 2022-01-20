// DOM Selector
const colorDivs = document.querySelectorAll(".color");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustBtn = document.querySelectorAll(".adjust");
const closeBtn = document.querySelectorAll(".close-adjustment");
const lockBtn = document.querySelectorAll(".lock");

const initialColor = [];

// Generate hexcolor
const generateHexColor = function () {
  // const characters = "0123456789ABCDEF";
  // let hash = "#";

  // for (let i = 0; i < 6; i++) {
  //   hash += characters[Math.floor(Math.random() * 16)];
  // }
  // console.log(hash);
  // return hash;
  const hexColor = chroma.random();
  return hexColor;
};

const checkTextContrast = function (color, text) {
  const luminance = chroma(color).luminance();

  luminance > 0.5 ? (text.style.color = "#000") : (text.style.color = "#fff");
};

const resetInputs = function () {
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColor[slider.dataset.hue];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = Math.floor(hueValue);
    }

    if (slider.name === "brightness") {
      const brightColor = initialColor[slider.dataset.bright];
      const brightValue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(brightValue * 100) / 100;
    }

    if (slider.name === "saturation") {
      const satColor = initialColor[slider.dataset.sat];
      const satValue = chroma(satColor).hsl()[1];
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
};

const randomColor = function () {
  // Reset Initial Color
  initialColor.splice(0);

  colorDivs.forEach((div, index) => {
    const hexText = div.firstElementChild;
    const colorRandom = generateHexColor();

    if (div.classList.contains("lock")) {
      initialColor.push(hexText.innerText);
    } else {
      initialColor.push(colorRandom.hex());
    }

    // Add color to bg
    div.style.backgroundColor = initialColor[index];
    hexText.innerText = initialColor[index];

    // Check constrast for textColor
    checkTextContrast(initialColor[index], hexText);

    // Initial Colorize Slider
    // const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");

    const hueRange = sliders[0];
    const brightRange = sliders[1];
    const satRange = sliders[2];

    colorizeSliders(colorRandom, hueRange, brightRange, satRange);
  });

  resetInputs();
};

const colorizeSliders = function (color, hueRange, brightRange, satRange) {
  // Scale Saturation
  const noSat = chroma(color).set("hsl.s", 0);
  const fullSat = chroma(color).set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, chroma(color), fullSat]);

  const midBright = chroma(color).set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);

  // Update Input Color
  satRange.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`;

  brightRange.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`;

  hueRange.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
};

const handleHslChange = function (e) {
  const index =
    e.target.dataset.hue || e.target.dataset.bright || e.target.dataset.sat;

  const [hue, bright, sat] = [
    ...e.target.parentElement.querySelectorAll('input[type="range"]'),
  ];
  const bgColor = initialColor[index];
  let color = chroma(bgColor)
    .set("hsl.s", sat.value)
    .set("hsl.l", bright.value)
    .set("hsl.h", hue.value);

  colorDivs[index].style.backgroundColor = color;

  colorizeSliders(color.hex(), hue, bright, sat);
};

const updateTextUI = function (index) {
  const activeDiv = colorDivs[index];
  const bgColor = chroma(activeDiv.style.backgroundColor);
  const textHex = activeDiv.firstElementChild;
  const icons = activeDiv.querySelectorAll(".controls button");
  console.log(bgColor);
  textHex.innerText = bgColor.hex();
  checkTextContrast(bgColor, textHex);

  // Check icons constrast
};

const copyToClipboard = function (hex) {
  navigator.clipboard.writeText(hex.innerText);

  popup.classList.add("active");
  popup.firstElementChild.classList.add("active");
};

popup.addEventListener("transitionend", function (e) {
  this.classList.remove("active");
  this.firstElementChild.classList.remove("active");
});

generateBtn.addEventListener("click", randomColor);

sliders.forEach((slider) => {
  slider.addEventListener("input", handleHslChange);
});

colorDivs.forEach((div, index) => {
  div.addEventListener("change", function (e) {
    updateTextUI(index);
  });
});

currentHexes.forEach((hex) => {
  hex.addEventListener("click", function (e) {
    copyToClipboard(hex);
  });
});

adjustBtn.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    this.parentElement.nextElementSibling.classList.toggle("active");
  });
});

closeBtn.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    this.parentElement.classList.remove("active");
  });
});

lockBtn.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    const colorDiv = this.parentElement.parentElement;

    if (colorDiv.classList.contains("lock")) {
      colorDiv.classList.remove("lock");
      this.innerHTML = `
      <svg
      xmlns="http://www.w3.org/2000/svg"
      class="controls-icon"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z"
      />
    </svg>
      `;
      return;
    }

    colorDiv.classList.add("lock");
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="controls-icon" viewBox="0 0 20 20" fill="currentColor">
    <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
  </svg>
      `;
  });
});

randomColor();
