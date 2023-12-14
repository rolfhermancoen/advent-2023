const Day = require("./Day");

class DayFourteen extends Day {
  constructor() {
    super("14");
  }

  async partOne() {
    const data = await this.getData();

    const parsedData = this.parseData(data);
    const tiltedData = this.tilt(parsedData, "N");

    const answer = this.calculateLoad(tiltedData);

    return answer;
  }

  async partTwo() {
    const data = await this.getData();

    const parsedData = this.parseData(data);

    const dirs = ["N", "W", "S", "E"];

    let surface = [...parsedData];
    const answers = [];
    for (let i = 0; i < 10000; i++) {
      for (let j = 0; j < dirs.length; j++) {
        surface = this.tilt(surface, dirs[j]);
      }
      answers.push(this.calculateLoad(surface));
    }

    const pattern = [];
    let foundDouble = null;
    for (let i = 0; i < answers.length; i++) {
      if (pattern.length > 10 && pattern.some((val) => val === answers[i])) {
        const firstindex = pattern.findIndex((val) => val === answers[i]);
        if (pattern.length - firstindex > 10) {
          foundDouble = answers[i];
          break;
        }
      }
      pattern.push(answers[i]);
    }

    const firstDoubleIndex = pattern.findIndex((patt) => patt === foundDouble);
    const patternStartIndex = answers.findIndex((patt) => patt === foundDouble);

    const finalPattern = pattern.splice(firstDoubleIndex);

    return finalPattern[
      (1000000000 - patternStartIndex - 1) % finalPattern.length
    ];
  }

  tilt(data, dir) {
    const newData = [...data];

    if (dir === "N") {
      for (let y = 1; y < newData.length; y++) {
        const row = newData[y];
        for (let x = 0; x < newData[0].length; x++) {
          const value = row[x];
          if (value === "O") {
            for (let i = y - 1; i >= 0; i--) {
              const topValue = newData[i][x];
              if (topValue === ".") {
                newData[i][x] = "O";
                newData[i + 1][x] = ".";
              } else {
                break;
              }
            }
          }
          continue;
        }
      }
    }

    if (dir === "S") {
      for (let y = newData.length - 1; y >= 0; y--) {
        const row = newData[y];
        for (let x = 0; x < newData[0].length; x++) {
          const value = row[x];
          if (value === "O") {
            for (let i = y + 1; i < newData.length; i++) {
              const downValue = newData[i][x];
              if (downValue === ".") {
                newData[i][x] = "O";
                newData[i - 1][x] = ".";
              } else {
                break;
              }
            }
          }
          continue;
        }
      }
    }

    if (dir === "W") {
      for (let y = 0; y < newData.length; y++) {
        const row = newData[y];
        for (let x = 0; x < newData[0].length; x++) {
          const value = row[x];
          if (value === "O") {
            for (let i = x - 1; i >= 0; i--) {
              const leftValue = newData[y][i];
              if (leftValue === ".") {
                newData[y][i] = "O";
                newData[y][i + 1] = ".";
              } else {
                break;
              }
            }
          }
          continue;
        }
      }
    }

    if (dir === "E") {
      for (let y = 0; y < newData.length; y++) {
        const row = newData[y];
        for (let x = newData[0].length - 1; x >= 0; x--) {
          const value = row[x];
          if (value === "O") {
            for (let i = x + 1; i < newData[0].length; i++) {
              const rightValue = newData[y][i];
              if (rightValue === ".") {
                newData[y][i] = "O";
                newData[y][i - 1] = ".";
              } else {
                break;
              }
            }
          }
          continue;
        }
      }
    }

    return newData;
  }

  parseData(data) {
    return data.map((val) => val[0].split(""));
  }

  calculateLoad(data) {
    const newData = [...data];
    return newData.reverse().reduce((prev, cur, index) => {
      const rocks = cur.filter((val) => val === "O");
      return prev + rocks.length * (index + 1);
    }, 0);
  }

  logGrid(data, ySize, xSize) {
    let grid = "";

    for (var y = 0; y < ySize; y++) {
      for (var x = 0; x < xSize; x++) {
        grid += data[y][x] ?? data[y][x];
      }

      grid += "\n";
    }

    console.log(grid);
  }
}

new DayFourteen();
