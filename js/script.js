"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class App {
    constructor() {
        this.result = document.getElementById("result");
        this.copyButton = document.getElementById("copy");
        this.copySpan = document.getElementById("copy-status");
        this.characterLengthInput = document.getElementById("characterLengthInput");
        this.characterLengthSpan = document.getElementById("characterLengthSpan");
        this.options = document.querySelectorAll('input[type="checkbox"]');
        this.strength = document.getElementById("strength");
        this.level = document.getElementById("level");
        this.submit = document.getElementById("submit");
        this.configure();
    }
    configure() {
        this.submit.addEventListener("click", this.submitHandler.bind(this));
        this.characterLengthInput.addEventListener("input", this.rangeChangeHandler.bind(this));
        this.copyButton.addEventListener("click", this.copyHandler.bind(this));
    }
    copyHandler() {
        const password = this.result.value;
        const success = () => {
            if (password.length) {
                this.copySpan.classList.remove("hidden");
                this.copySpan.classList.add("visible");
                setTimeout(() => {
                    this.copySpan.classList.remove("visible");
                    this.copySpan.classList.add("hidden");
                }, 1000);
            }
            return;
        };
        const failure = (err) => {
            console.error("Async: Could not copy text: ", err);
        };
        navigator.clipboard.writeText(password).then(success, failure);
    }
    rangeChangeHandler(event) {
        const target = event.target;
        this.renderValue(this.characterLengthSpan, this.roundValue(target.value));
    }
    roundValue(value) {
        const number = +value;
        const round = Math.floor(number * 1);
        const string = round.toString();
        return string;
    }
    renderValue(host, value) {
        host.innerText = value;
    }
    submitHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            const settings = this.gatherUserInputs();
            const password = yield this.createPassword(settings);
            this.result.value = password;
            this.showPasswordStrength(settings);
        });
    }
    gatherUserInputs() {
        const characterLength = parseInt(this.characterLengthInput.value);
        const options = [];
        for (const input of this.options.values()) {
            if (input.checked) {
                options.push(input.id);
            }
        }
        return { length: characterLength, options };
    }
    getData(file = "/assets/alphabet.json") {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(file);
            const data = yield response.json();
            return JSON.parse(data);
        });
    }
    createPassword(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = settings.options;
            const characterLength = +this.roundValue(settings.length.toString());
            const alphabet = yield this.getData();
            const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
            const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
            const groupLength = Math.floor(characterLength / options.length);
            const restOfLength = characterLength - groupLength * options.length;
            let randomUppercase = [];
            let randomNumbers = [];
            let randomSymbols = [];
            let randomLowercase = [];
            let result = [];
            function getRandomIndex(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            function getCharacters(library, target, amount) {
                for (let i = 0; i < amount; i++) {
                    const index = getRandomIndex(0, library.length - 1);
                    target.push(library[index]);
                }
            }
            const shuffle = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            };
            if (options.includes("uppercase")) {
                getCharacters(alphabet.uppercase, randomUppercase, groupLength);
            }
            if (options.includes("numbers")) {
                getCharacters(digits, randomNumbers, groupLength);
            }
            if (options.includes("lowercase")) {
                getCharacters(alphabet.lowercase, randomLowercase, groupLength);
            }
            if (options.includes("symbols")) {
                getCharacters(symbols, randomSymbols, groupLength);
            }
            if (restOfLength) {
                getCharacters(alphabet.lowercase, randomLowercase, restOfLength);
            }
            result = randomLowercase.concat(randomUppercase, randomNumbers, randomSymbols);
            return shuffle(result).join("");
        });
    }
    showPasswordStrength(settings) {
        const length = settings.length;
        const options = settings.options;
        let strengthValue;
        const variants = ["too weak!", "weak", "medium", "strong"];
        if (options.length == 0)
            strengthValue = "";
        if (length <= 6 && options.length !== 0)
            strengthValue = "too weak!";
        if (length > 6 && options.length == 1)
            strengthValue = "too weak!";
        if (length > 6 && options.length == 2)
            strengthValue = "weak";
        if (length > 6 && options.length == 3)
            strengthValue = "medium";
        if (length > 6 && options.length == 4)
            strengthValue = "strong";
        this.renderValue(this.strength, strengthValue);
        const power = variants.indexOf(strengthValue) + 1;
        const levels = this.level.children;
        const classes = ["red", "orange", "yellow", "green"];
        const color = classes[power - 1];
        function removeClasses() {
            for (let i = 0; i < levels.length; i++) {
                for (let j = 0; j < classes.length; j++) {
                    levels[i].classList.remove(classes[j]);
                }
            }
        }
        function addClasses() {
            for (let i = 0; i < power; i++) {
                levels[i].classList.add(color);
            }
        }
        removeClasses();
        addClasses();
    }
}
const app = new App();

/**
 * Sniffs for Older Edge or IE,
 * more info here:
 * https://stackoverflow.com/q/31721250/3528132
 */
function isOlderEdgeOrIE() {
  return (
    window.navigator.userAgent.indexOf("MSIE ") > -1 ||
    !!navigator.userAgent.match(/Trident.*rv\:11\./) ||
    window.navigator.userAgent.indexOf("Edge") > -1
  );
}

function valueTotalRatio(value, min, max) {
  return ((value - min) / (max - min)).toFixed(2);
}

function getLinearGradientCSS(ratio, leftColor, rightColor) {
  return [
    "-webkit-gradient(",
    "linear, ",
    "left top, ",
    "right top, ",
    "color-stop(" + ratio + ", " + leftColor + "), ",
    "color-stop(" + ratio + ", " + rightColor + ")",
    ")",
  ].join("");
}

function updateRangeEl(rangeEl) {
  var ratio = valueTotalRatio(rangeEl.value, rangeEl.min, rangeEl.max);
  /**
   * Sniffs for Older Edge or IE,
   * more info here:
   * https://stackoverflow.com/q/31721250/3528132
   */
  function isOlderEdgeOrIE() {
    return (
      window.navigator.userAgent.indexOf("MSIE ") > -1 ||
      !!navigator.userAgent.match(/Trident.*rv\:11\./) ||
      window.navigator.userAgent.indexOf("Edge") > -1
    );
  }

  function valueTotalRatio(value, min, max) {
    return ((value - min) / (max - min)).toFixed(2);
  }

  function getLinearGradientCSS(ratio, leftColor, rightColor) {
    return [
      "-webkit-gradient(",
      "linear, ",
      "left top, ",
      "right top, ",
      "color-stop(" + ratio + ", " + leftColor + "), ",
      "color-stop(" + ratio + ", " + rightColor + ")",
      ")",
    ].join("");
  }

  function updateRangeEl(rangeEl) {
    var ratio = valueTotalRatio(rangeEl.value, rangeEl.min, rangeEl.max);
    rangeEl.style.backgroundImage = getLinearGradientCSS(
      ratio,
      "#A4FFAF",
      "#18171F"
    );
  }

  function initRangeEl() {
    var rangeEl = document.querySelector("input[type=range]");
    var textEl = document.querySelector("input[type=text]");

    /**
     * IE/Older Edge FIX
     * On IE/Older Edge the height of the <input type="range" />
     * is the whole element as oposed to Chrome/Moz
     * where the height is applied to the track.
     *
     */
    if (isOlderEdgeOrIE()) {
      rangeEl.style.height = "20px";
      // IE 11/10 fires change instead of input
      // https://stackoverflow.com/a/50887531/3528132
      rangeEl.addEventListener("change", function (e) {
        textEl.value = e.target.value;
      });
      rangeEl.addEventListener("input", function (e) {
        textEl.value = e.target.value;
      });
    } else {
      updateRangeEl(rangeEl);
      rangeEl.addEventListener("input", function (e) {
        updateRangeEl(e.target);
        textEl.value = e.target.value;
      });
    }
  }

  initRangeEl();
  rangeEl.style.backgroundImage = getLinearGradientCSS(
    ratio,
    "#A4FFAF",
    "#18171F"
  );
}

function initRangeEl() {
  var rangeEl = document.querySelector("input[type=range]");
  var textEl = document.querySelector("input[type=text]");
  /**
   * IE/Older Edge FIX
   * On IE/Older Edge the height of the <input type="range" />
   * is the whole element as oposed to Chrome/Moz
   * where the height is applied to the track.
   *
   */
  if (isOlderEdgeOrIE()) {
    rangeEl.style.height = "20px";
    // IE 11/10 fires change instead of input
    // https://stackoverflow.com/a/50887531/3528132
    rangeEl.addEventListener("change", function (e) {
      textEl.value = e.target.value;
    });
    rangeEl.addEventListener("input", function (e) {
      textEl.value = e.target.value;
    });
  } else {
    updateRangeEl(rangeEl);
    rangeEl.addEventListener("input", function (e) {
      updateRangeEl(e.target);
      textEl.value = e.target.value;
    });
  }
}

initRangeEl();

