const Day = require("./Day");

class DayEleven extends Day {
  constructor() {
    super("11");
  }

  async partOne() {
    const data = await this.getData();

    const galaxyGrid = [];

    let count = 1;
    for (let y = 0; y < data.length; y++) {
      galaxyGrid[y] = [];

      const row = data[y][0].split("");
      for (let x = 0; x < row.length; x++) {
        const val = row[x] === "." ? row[x] : count;
        galaxyGrid[y][x] = val;
        if (val !== ".") {
          count++;
        }
      }
    }

    const expandY = [];
    const expandX = [];

    for (let y = 0; y < galaxyGrid.length; y++) {
      const horizontalValues = galaxyGrid[y];
      if (horizontalValues.every((val) => val === ".")) {
        expandY.push(y);
      }
    }

    for (let x = 0; x < galaxyGrid[0].length; x++) {
      const verticalValues = galaxyGrid.map((row) => row[x]);
      if (verticalValues.every((val) => val === ".")) {
        expandX.push(x);
      }
    }

    const expandedGalaxy = [...galaxyGrid];

    for (let y = 0; y < expandY.length; y++) {
      expandedGalaxy.splice(
        expandY[y] + 1 + y,
        0,
        Array(expandedGalaxy[0].length).fill(".")
      );
    }

    for (let x = 0; x < expandX.length; x++) {
      for (let y = 0; y < expandedGalaxy.length; y++) {
        expandedGalaxy[y].splice(expandX[x] + 1 + x, 0, ".");
      }
    }

    const counts = [];
    for (let y = 0; y < expandedGalaxy.length; y++) {
      for (let x = 0; x < expandedGalaxy[0].length; x++) {
        if (expandedGalaxy[y][x] !== ".") {
          counts.push({
            num: expandedGalaxy[y][x],
            x,
            y,
          });
        }
      }
    }

    const distances = [];
    for (let i = 0; i < counts.length; i++) {
      const currentGalaxy = counts[i];

      for (let j = 0; j < counts.length; j++) {
        if (i === j || i > j) {
          continue;
        }
        const destGalaxy = counts[j];
        distances.push(
          Math.abs(currentGalaxy.x - destGalaxy.x) +
            Math.abs(currentGalaxy.y - destGalaxy.y)
        );
      }
    }

    return distances.reduce((prev, cur) => prev + cur, 0);
  }

  async partTwo() {
    const data = await this.getData();

    const galaxyGrid = [];

    let count = 1;
    for (let y = 0; y < data.length; y++) {
      galaxyGrid[y] = [];

      const row = data[y][0].split("");
      for (let x = 0; x < row.length; x++) {
        const val = row[x] === "." ? row[x] : count;
        galaxyGrid[y][x] = val;
        if (val !== ".") {
          count++;
        }
      }
    }

    const expandY = [];
    const expandX = [];

    for (let y = 0; y < galaxyGrid.length; y++) {
      const horizontalValues = galaxyGrid[y];
      if (horizontalValues.every((val) => val === ".")) {
        expandY.push(y);
      }
    }

    for (let x = 0; x < galaxyGrid[0].length; x++) {
      const verticalValues = galaxyGrid.map((row) => row[x]);
      if (verticalValues.every((val) => val === ".")) {
        expandX.push(x);
      }
    }

    const counts = [];
    for (let y = 0; y < galaxyGrid.length; y++) {
      for (let x = 0; x < galaxyGrid[0].length; x++) {
        if (galaxyGrid[y][x] !== ".") {
          counts.push({
            num: galaxyGrid[y][x],
            x,
            y,
          });
        }
      }
    }

    const EXPAND_MULTIPLIER = 1000000;

    const distances = [];
    for (let i = 0; i < counts.length; i++) {
      const currentGalaxy = counts[i];

      for (let j = 0; j < counts.length; j++) {
        if (i === j || i > j) {
          continue;
        }
        const destGalaxy = counts[j];

        const xFlatDistance = Math.abs(currentGalaxy.x - destGalaxy.x);
        const highX =
          currentGalaxy.x > destGalaxy.x ? currentGalaxy.x : destGalaxy.x;
        const lowX =
          currentGalaxy.x < destGalaxy.x ? currentGalaxy.x : destGalaxy.x;
        const expandedX = expandX.filter((x) => x < highX && x > lowX);

        const yFlatDistance = Math.abs(currentGalaxy.y - destGalaxy.y);
        const highY =
          currentGalaxy.y > destGalaxy.y ? currentGalaxy.y : destGalaxy.y;
        const lowY =
          currentGalaxy.y < destGalaxy.y ? currentGalaxy.y : destGalaxy.y;
        const expandedY = expandY.filter((y) => y < highY && y > lowY);

        distances.push(
          xFlatDistance +
            expandedX.length * (EXPAND_MULTIPLIER - 1) +
            yFlatDistance +
            expandedY.length * (EXPAND_MULTIPLIER - 1)
        );
      }
    }

    return distances.reduce((prev, cur) => prev + cur, 0);
  }

  logGrid(data, ySize, xSize) {
    let grid = "";

    for (var y = 0; y < ySize; y++) {
      for (var x = 0; x < xSize; x++) {
        grid += data[y][x];
      }

      grid += "\n";
    }

    console.log(grid);
  }
}

new DayEleven();
