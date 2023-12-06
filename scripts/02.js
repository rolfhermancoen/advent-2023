const Day = require("./Day");

class DayTwo extends Day {
  MAX_BLUE = 14;
  MAX_RED = 12;
  MAX_GREEN = 13;
  constructor() {
    super("02", ";");
  }

  async partOne() {
    const parsedData = await this.getData();
    const mappedData = parsedData.map((dat) => {
      const mappedGames = dat.map((d) => ({
        ...(this.getColorValue(d, "blue")
          ? { blue: this.getColorValue(d, "blue") }
          : {}),
        ...(this.getColorValue(d, "red")
          ? { red: this.getColorValue(d, "red") }
          : {}),
        ...(this.getColorValue(d, "green")
          ? { green: this.getColorValue(d, "green") }
          : {}),
      }));
      return mappedGames;
    });

    const possibleGames = [];

    mappedData.forEach((game, index) => {
      let impossibleSet = null;
      for (let i = 0; i < game.length; i++) {
        const set = game[i];
        if (game.red && set.red > this.MAX_RED) {
          impossibleSet = set;
          break;
        }
        if (set.blue && set.blue > this.MAX_BLUE) {
          impossibleSet = set;
          break;
        }
        if (set.green && set.green > this.MAX_GREEN) {
          impossibleSet = set;
          break;
        }
      }

      if (!impossibleSet) {
        possibleGames.push(index + 1);
      }
    });

    return possibleGames.reduce((prev, cur) => prev + cur, 0);
  }

  async partTwo() {
    const parsedData = await this.getData();
    const mappedData = parsedData.map((dat) => {
      const mappedGames = dat.map((d) => ({
        ...(this.getColorValue(d, "blue")
          ? { blue: this.getColorValue(d, "blue") }
          : {}),
        ...(this.getColorValue(d, "red")
          ? { red: this.getColorValue(d, "red") }
          : {}),
        ...(this.getColorValue(d, "green")
          ? { green: this.getColorValue(d, "green") }
          : {}),
      }));
      return mappedGames;
    });

    const powerArray = mappedData.map((game) => {
      let minRed = 0;
      let minBlue = 0;
      let minGreen = 0;

      for (let i = 0; i < game.length; i++) {
        const set = game[i];
        if (set.red && set.red > minRed) {
          minRed = set.red;
        }
        if (set.blue && set.blue > minBlue) {
          minBlue = set.blue;
        }
        if (set.green && set.green > minGreen) {
          minGreen = set.green;
        }
        continue;
      }

      return minRed * minBlue * minGreen;
    });

    return powerArray.reduce((prev, cur) => prev + cur, 0);
  }

  getColorValue(string, color) {
    const splittedString = string.split(",");
    let colorString = splittedString.find((str) => str.includes(color));

    if (colorString) {
      if (colorString.includes("Game")) {
        colorString = colorString.replace(/Game [0-9]{1,3}:/g, "");
      }
      colorString = colorString.replace(color, "");

      return parseInt(colorString);
    }
    return undefined;
  }
}

new DayTwo();
