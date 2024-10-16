type option = "uppercase" | "lowercase" | "numbers" | "symbols";
type strength = "too weak!" | "weak" | "medium" | "strong" | "";
interface PasswordSettings {
  length: number;
  options: option[];
}

class App {
  result: HTMLInputElement;
  copyButton: HTMLButtonElement;
  copySpan: HTMLSpanElement;
  characterLengthInput: HTMLInputElement;
  characterLengthSpan: HTMLSpanElement;
  options: NodeListOf<HTMLInputElement>;
  strength: HTMLSpanElement;
  level: HTMLDivElement;
  submit: HTMLButtonElement;

  constructor() {
    this.result = document.getElementById("result")! as HTMLInputElement;
    this.copyButton = document.getElementById("copy")! as HTMLButtonElement;
    this.copySpan = document.getElementById("copy-status")! as HTMLSpanElement;
    this.characterLengthInput = document.getElementById(
      "characterLengthInput"
    )! as HTMLInputElement;
    this.characterLengthSpan = document.getElementById(
      "characterLengthSpan"
    )! as HTMLSpanElement;
    this.options = document.querySelectorAll(
      'input[type="checkbox"]'
    )! as NodeListOf<HTMLInputElement>;
    this.strength = document.getElementById("strength")! as HTMLSpanElement;
    this.level = document.getElementById("level")! as HTMLDivElement;
    this.submit = document.getElementById("submit")! as HTMLButtonElement;

    this.configure();
  }

  private configure() {
    this.submit.addEventListener("click", this.submitHandler.bind(this));
    this.characterLengthInput.addEventListener(
      "input",
      this.rangeChangeHandler.bind(this)
    );
    this.copyButton.addEventListener("click", this.copyHandler.bind(this));
  }

  private copyHandler() {
    const password = this.result.value;
    const success = () => {
      if (password.length) {
        this.renderValue(this.copySpan, "COPIED");
        this.copySpan.classList.add("visible");
      } else {
        return;
      }
      setTimeout(() => {
        this.renderValue(this.copySpan, "");
        this.copySpan.classList.remove("visible");
      }, 1000);
    };

    const failure = (err: Error) => {
      console.error("Async: Could not copy text: ", err);
    };

    navigator.clipboard.writeText(password).then(success, failure);
  }

  private rangeChangeHandler(event: Event) {
    const target = event.target as HTMLInputElement;
    this.renderValue(this.characterLengthSpan, this.roundValue(target.value));
  }

  private roundValue(value: string) {
    const number = +value;
    const round = Math.floor(number * 1);
    const string = round.toString();
    return string;
  }

  private renderValue(host: HTMLElement, value: string) {
    host.innerText = value;
  }

  private async submitHandler() {
    const settings = this.gatherUserInputs();
    const password = await this.createPassword(settings);
    this.result.value = password;
    this.showPasswordStrength(settings);
  }

  private gatherUserInputs(): PasswordSettings {
    const characterLength = parseInt(this.characterLengthInput.value);
    const options: option[] = [];

    for (const input of this.options.values()) {
      if (input.checked) {
        options.push(input.id as option);
      }
    }

    return { length: characterLength, options };
  }

  private async getData(file = "/assets/alphabet.json") {
    const response = await fetch(file);
    const data = await response.json();
    return JSON.parse(data);
  }

  private async createPassword(settings: PasswordSettings) {
    const options = settings.options;
    const characterLength = +this.roundValue(settings.length.toString());
    const alphabet = await this.getData();
    const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

    const groupLength = Math.floor(characterLength / options.length);
    const restOfLength = characterLength - groupLength * options.length;

    let randomUppercase: string[] = [];
    let randomNumbers: string[] = [];
    let randomSymbols: string[] = [];
    let randomLowercase: string[] = [];

    let result: string[] = [];

    function getRandomIndex(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCharacters(
      library: string[],
      target: string[],
      amount: number
    ) {
      for (let i = 0; i < amount; i++) {
        const index = getRandomIndex(0, library.length - 1);
        target.push(library[index]);
      }
    }

    const shuffle = (array: string[]) => {
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

    result = randomLowercase.concat(
      randomUppercase,
      randomNumbers,
      randomSymbols
    );

    return shuffle(result).join("");
  }

  private showPasswordStrength(settings: PasswordSettings) {
    const length = settings.length;
    const options = settings.options;
    let strengthValue: strength;
    const variants = ["too weak!", "weak", "medium", "strong"];

    if (options.length == 0) strengthValue = "";
    if (length <= 6 && options.length !== 0) strengthValue = "too weak!";
    if (length > 6 && options.length == 1) strengthValue = "too weak!";
    if (length > 6 && options.length == 2) strengthValue = "weak";
    if (length > 6 && options.length == 3) strengthValue = "medium";
    if (length > 6 && options.length == 4) strengthValue = "strong";

    this.renderValue(this.strength, strengthValue!);
    const power = variants.indexOf(strengthValue!) + 1;
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
