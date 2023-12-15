const Day = require("./Day");

class DayFifteen extends Day {
  constructor() {
    super("15");
  }

  async partOne() {
    const data = await this.getData();

    let sum = 0;
    for (let i = 0; i < data[0].length; i++) {
      const string = data[0][i];
      sum = sum + this.decode(string);
    }
    return sum;
  }

  async partTwo() {
    const data = await this.getData();
    const boxes = Array(256).fill([]);

    for (let i = 0; i < data[0].length; i++) {
      const string = data[0][i];
      const label = string.replace(/(=|-)\d{0,10}/g, "");
      const boxNumber = this.decode(label);
      const operator = string.includes("=") ? "=" : "-";

      if (operator === "=") {
        const focalLength = string[string.length - 1];
        const existingLens = boxes[boxNumber].findIndex(
          (lens) => lens.label === label
        );

        if (existingLens !== -1) {
          boxes[boxNumber][existingLens] = { label, focalLength };
        } else {
          boxes[boxNumber] = [...boxes[boxNumber], { label, focalLength }];
        }
      }

      if (operator === "-") {
        boxes[boxNumber] = boxes[boxNumber].filter(
          (lens) => lens.label !== label
        );
      }
    }

    let sum = 0;
    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      if (box.length === 0) {
        continue;
      }

      for (let j = 0; j < box.length; j++) {
        const lens = box[j];
        const value = i * j * parseInt(lens.focalLength);

        sum = sum + (i + 1) * (j + 1) * parseInt(lens.focalLength);
      }
    }

    return sum;
  }

  decode(string) {
    let currentValue = 0;
    const letters = string.split("");

    for (let i = 0; i < string.length; i++) {
      const letter = letters[i];
      const asciiCode = letter.charCodeAt(0);

      currentValue = currentValue + asciiCode;
      currentValue = currentValue * 17;
      currentValue = currentValue % 256;
    }

    return currentValue;
  }
}

new DayFifteen();
