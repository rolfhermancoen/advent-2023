const Day = require("./Day");

class DayThirteen extends Day {
  constructor() {
    super("13", " ");
  }

  async partOne() {
    const data = await this.getData();

    const patterns = this.parseData(data);

    let count = 0;
    for (let i = 0; i < patterns.length; i++) {
      const verticalNumberedPattern = this.parseIntoNumbers(patterns[i], "V");
      const horizontalNumberedPattern = this.parseIntoNumbers(patterns[i], "H");

      const vPairs = this.findPairs(verticalNumberedPattern);
      const hPairs = this.findPairs(horizontalNumberedPattern);

      const verticalReflection = this.findReflection(
        verticalNumberedPattern,
        vPairs
      );
      const horizontalReflection = this.findReflection(
        horizontalNumberedPattern,
        hPairs
      );

      if (verticalReflection) {
        count = count + verticalReflection[0] + 1;
        continue;
      }
      if (horizontalReflection) {
        count = count + 100 * (horizontalReflection[0] + 1);
        continue;
      }
    }

    return count;
  }

  async partTwo() {
    const data = await this.getData();

    const patterns = this.parseData(data);

    let count = 0;
    for (let i = 0; i < patterns.length; i++) {
      const verticalNumberedPattern = this.parseIntoNumbers(patterns[i], "V");
      const horizontalNumberedPattern = this.parseIntoNumbers(patterns[i], "H");

      const vPairs = this.findPairs(verticalNumberedPattern);
      const hPairs = this.findPairs(horizontalNumberedPattern);

      const verticalReflection = this.findReflection(
        verticalNumberedPattern,
        vPairs
      );
      const horizontalReflection = this.findReflection(
        horizontalNumberedPattern,
        hPairs
      );

      if (verticalReflection) {
        count = count + verticalReflection[0] + 1;
        continue;
      }
      if (horizontalReflection) {
        count = count + 100 * (horizontalReflection[0] + 1);
        continue;
      }
    }

    return count;
  }

  parseIntoNumbers(pattern, dir) {
    let numberedPattern = Array(
      dir === "V" ? pattern[0].length : pattern.length
    ).fill([]);

    if (dir === "V") {
      for (let x = 0; x < pattern[0].length; x++) {
        for (let y = 0; y < pattern.length; y++) {
          if (pattern[y][x] === "#") {
            if (numberedPattern[x][numberedPattern[x].length - 1] > 0) {
              const currentNumber =
                numberedPattern[x][numberedPattern[x].length - 1];

              numberedPattern[x] = [
                ...numberedPattern[x].slice(0, -1),
                currentNumber + 1,
              ];
            } else {
              numberedPattern[x] = [...numberedPattern[x], 1];
            }
          } else {
            numberedPattern[x] = [...numberedPattern[x], 0];
          }
        }
      }
    }

    if (dir === "H") {
      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[0].length; x++) {
          if (pattern[y][x] === "#") {
            if (numberedPattern[y][numberedPattern[y].length - 1] > 0) {
              const currentNumber =
                numberedPattern[y][numberedPattern[y].length - 1];

              numberedPattern[y] = [
                ...numberedPattern[y].slice(0, -1),
                currentNumber + 1,
              ];
            } else {
              numberedPattern[y] = [...numberedPattern[y], 1];
            }
          } else {
            numberedPattern[y] = [...numberedPattern[y], 0];
          }
        }
      }
    }

    return numberedPattern;
  }

  findPairs(numberedPattern) {
    let groups = {};

    for (let i = 0; i < numberedPattern.length; i++) {
      if (numberedPattern[i].join("") in groups) {
        groups[numberedPattern[i].join("")] = [
          ...groups[numberedPattern[i].join("")],
          i,
        ];
      } else {
        groups[numberedPattern[i].join("")] = [i];
      }
    }

    const pairs = [];

    for (let i = 0; i < Object.keys(groups).length; i++) {
      const group = groups[Object.keys(groups)[i]];

      if (group.length === 1) {
        continue;
      }

      if (group.length === 2 && Math.abs(group[0] - group[1]) === 1) {
        pairs.push(group);
      }

      for (let j = 0; j < group.length; j++) {
        for (let k = 0; k < group.length; k++) {
          if (
            pairs.some(
              (pair) =>
                (pair[0] === group[j] && pair[1] === group[k]) ||
                (pair[0] === group[k] && pair[1] === group[j])
            )
          ) {
            continue;
          }
          if (j === k) {
            continue;
          }

          if (Math.abs(group[j] - group[k]) === 1) {
            pairs.push([group[j], group[k]]);
          }
        }
      }
    }

    return pairs;
  }

  findReflection(numberedPattern, pairs) {
    let validPair = null;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];

      const distanceLeft = pair[0];
      const distanceRight = Math.abs(pair[1] - numberedPattern.length) - 1;
      const distanceShortest =
        distanceLeft < distanceRight ? distanceLeft : distanceRight;

      let validPairBool = true;

      for (let j = 0; j < distanceShortest; j++) {
        const leftNumbers = numberedPattern[pair[0] - 1 - j];
        const rightNumbers = numberedPattern[pair[1] + 1 + j];

        if (leftNumbers.join(",") !== rightNumbers.join(",")) {
          validPairBool = false;
          break;
        }
      }

      if (validPairBool) {
        validPair = pair;
      }
    }

    return validPair;
  }

  parseData(data) {
    const seperateData = [];
    let newPattern = true;
    for (let i = 0; i < data.length; i++) {
      if (data[i][0] !== "") {
        if (newPattern) {
          seperateData[seperateData.length] = [data[i][0].split("")];
          newPattern = false;
        } else {
          seperateData[seperateData.length - 1] = [
            ...seperateData[seperateData.length - 1],
            data[i][0].split(""),
          ];
        }
      } else {
        newPattern = true;
      }
    }

    return seperateData;
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

new DayThirteen();
