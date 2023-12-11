const Day = require("./Day");

class DayTen extends Day {
  tiles = {
    "|": {
      up: true,
      down: true,
      left: false,
      right: false,
      display: "║",
      map: [
        ["0", "1", "0"],
        ["0", "1", "0"],
        ["0", "1", "0"],
      ],
    },
    "-": {
      up: false,
      down: false,
      left: true,
      right: true,
      display: "═",
      map: [
        ["0", "0", "0"],
        ["1", "1", "1"],
        ["0", "0", "0"],
      ],
    },
    L: {
      up: true,
      down: false,
      left: false,
      right: true,
      display: "╚",
      map: [
        ["0", "1", "0"],
        ["0", "1", "1"],
        ["0", "0", "0"],
      ],
    },
    J: {
      up: true,
      down: false,
      left: true,
      right: false,
      display: "╝",
      map: [
        ["0", "1", "0"],
        ["1", "1", "0"],
        ["0", "0", "0"],
      ],
    },
    7: {
      up: false,
      down: true,
      left: true,
      right: false,
      display: "╗",
      map: [
        ["0", "0", "0"],
        ["1", "1", "0"],
        ["0", "1", "0"],
      ],
    },
    F: {
      up: false,
      down: true,
      left: false,
      right: true,
      display: "╔",
      map: [
        ["0", "0", "0"],
        ["0", "1", "1"],
        ["0", "1", "0"],
      ],
    },
    ".": {
      up: false,
      down: false,
      left: false,
      right: false,
      map: [
        ["0", "0", "0"],
        ["0", "0", "0"],
        ["0", "0", "0"],
      ],
    },
    S: {
      up: true,
      down: true,
      left: true,
      right: true,
    },
  };

  constructor() {
    super("10", " ");
  }

  async partOne() {
    const data = await this.getData();
    const gridData = data.map((dat) => dat[0].split(""));
    const startY = gridData.findIndex((gridRow) =>
      gridRow.some((d) => d === "S")
    );
    const startX = gridData[startY].findIndex((d) => d === "S");

    let rooted = false;
    let prevNode = null;
    let curNode = { y: startY, x: startX, value: "S" };
    let count = 0;
    while (!rooted) {
      if ((curNode.value === "S") & (prevNode !== null)) {
        rooted = true;
        break;
      }
      const search = [-1, 0, 1];
      const foundNodes = [];

      for (let i = 0; i < search.length; i++) {
        const x = search[i] + curNode.x;
        for (let j = 0; j < search.length; j++) {
          if (
            (search[i] === 0 && search[j] === 0) ||
            (search[i] === 1 && search[j] === 1) ||
            (search[i] === -1 && search[j] === 1) ||
            (search[i] === 1 && search[j] === -1) ||
            (search[i] === -1 && search[j] === -1)
          ) {
            continue;
          }
          const y = search[j] + curNode.y;

          if (
            x < 0 ||
            x > gridData[0].length - 1 ||
            y < 0 ||
            y > gridData.length - 1
          ) {
            continue;
          }
          foundNodes.push({
            value: gridData[y][x],
            x,
            y,
            dir: this.getDirection(search[i], search[j]),
          });
        }
      }

      const filterPossibleNodes = foundNodes.filter((node) => {
        if (curNode.value === "S") {
          return this.tiles[node.value][this.getOppositeDirection(node.dir)];
        }
        return this.tiles[curNode.value][node.dir];
      });

      const nextNode =
        curNode.value !== "S"
          ? filterPossibleNodes.find(
              (node) => !(node.x === prevNode.x && node.y === prevNode.y)
            )
          : filterPossibleNodes[0];

      prevNode = curNode;
      curNode = nextNode;
      count++;
    }

    return count / 2;
  }

  async partTwo() {
    const data = await this.getData();
    const gridData = data.map((dat) => dat[0].split(""));
    const startY = gridData.findIndex((gridRow) =>
      gridRow.some((d) => d === "S")
    );
    const startX = gridData[startY].findIndex((d) => d === "S");

    let rooted = false;
    const routeNodes = [{ y: startY, x: startX, value: "S" }];
    while (!rooted) {
      const currentNode = routeNodes[routeNodes.length - 1];
      const previousNode = routeNodes[routeNodes.length - 2] ?? null;

      if (currentNode.value === "S" && previousNode !== null) {
        rooted = true;
        break;
      }
      const search = [-1, 0, 1];
      const foundNodes = [];

      for (let i = 0; i < search.length; i++) {
        const x = search[i] + currentNode.x;
        for (let j = 0; j < search.length; j++) {
          if (
            (search[i] === 0 && search[j] === 0) ||
            (search[i] === 1 && search[j] === 1) ||
            (search[i] === -1 && search[j] === 1) ||
            (search[i] === 1 && search[j] === -1) ||
            (search[i] === -1 && search[j] === -1)
          ) {
            continue;
          }
          const y = search[j] + currentNode.y;

          if (
            x < 0 ||
            x > gridData[0].length - 1 ||
            y < 0 ||
            y > gridData.length - 1
          ) {
            continue;
          }
          foundNodes.push({
            value: gridData[y][x],
            x,
            y,
            dir: this.getDirection(search[i], search[j]),
          });
        }
      }

      const filterPossibleNodes = foundNodes.filter((node) => {
        if (currentNode.value === "S") {
          return this.tiles[node.value][this.getOppositeDirection(node.dir)];
        }
        return this.tiles[currentNode.value][node.dir];
      });

      const nextNode =
        currentNode.value !== "S"
          ? filterPossibleNodes.find(
              (node) =>
                !(node.x === previousNode.x && node.y === previousNode.y)
            )
          : filterPossibleNodes[0];

      if (currentNode.value === "S") {
        routeNodes[0].dir = nextNode.dir;
      }

      routeNodes.push(nextNode);
    }
    const sRouteNodes = routeNodes.filter((node) => node.value === "S");

    routeNodes[0].value = this.getStartValue(sRouteNodes);
    routeNodes.pop();

    const newGridData = gridData.map((yData, yIndex) =>
      yData.map((xData, xIndex) => {
        const routeNode = routeNodes.find(
          (node) => node.x === xIndex && node.y === yIndex
        );
        return {
          value: routeNode ? routeNode.value : xData,
          x: xIndex,
          y: yIndex,
          route: routeNode ? true : false,
          fullTile: routeNode ? false : true,
        };
      })
    );

    this.logGrid(newGridData, newGridData.length, newGridData[0].length);

    const expandedGridData = [];

    for (let i = 0; i < newGridData.length; i++) {
      const currentYData = newGridData[i];
      for (let j = 0; j < currentYData.length; j++) {
        const currentTile = currentYData[j];
        const currentMap = this.tiles[currentTile.value].map;

        for (let k = 0; k < currentMap.length; k++) {
          for (let h = 0; h < currentMap[0].length; h++) {
            const newTile = currentMap[k][h];
            if (!expandedGridData[i * 3 + k]) {
              expandedGridData[i * 3 + k] = [];
            }
            if (!expandedGridData[i * 3 + k][j * 3 + h]) {
              expandedGridData[i * 3 + k][j * 3 + h] = {
                x: j * 3 + h,
                y: i * 3 + k,
                value: newTile,
                oldValue: currentTile.value,
                route: currentTile.route,
                fulltile: currentTile.fullTile,
              };
            }
          }
        }
      }
    }

    let mappedRooted = false;
    const mappedGridData = [...expandedGridData];

    mappedGridData[0][0].found = true;
    let cords = { x: 0, y: 0 };

    while (!mappedRooted) {
      const currentNode = mappedGridData[cords.y][cords.x];
      const search = [-1, 0, 1];

      if (cords.y % 10 === 0 && cords.x === 0) {
        console.log(`Processing row: ${cords.y} of scan: ${mappedRooted}`);
      }

      for (let i = 0; i < search.length; i++) {
        const x = search[i] + currentNode.x;
        for (let j = 0; j < search.length; j++) {
          if (
            (search[i] === 0 && search[j] === 0) ||
            (search[i] === 1 && search[j] === 1) ||
            (search[i] === -1 && search[j] === 1) ||
            (search[i] === 1 && search[j] === -1) ||
            (search[i] === -1 && search[j] === -1)
          ) {
            continue;
          }
          const y = search[j] + currentNode.y;

          if (
            x < 0 ||
            x > mappedGridData[0].length - 1 ||
            y < 0 ||
            y > mappedGridData.length - 1
          ) {
            continue;
          }

          const possibleNode = mappedGridData[y][x];

          if (possibleNode.route) {
            if (possibleNode.value !== "1" && possibleNode.found !== null) {
              mappedGridData[y][x].found = true;
            }
          } else {
            if (possibleNode.found !== null) {
              mappedGridData[y][x].found = true;
            }
          }
        }
      }

      mappedGridData[cords.y][cords.x].value = ".";
      mappedGridData[cords.y][cords.x].found = null;

      const nextYData = mappedGridData.find((yData) =>
        yData.some((d) => d.found)
      );

      const nextNode = nextYData
        ? nextYData.find((d) => d.found === true)
        : null;

      if (
        !nextNode ||
        (cords.x === mappedGridData[0].length &&
          cords.y === mappedGridData.length)
      ) {
        mappedRooted = true;
        break;
      }

      cords = {
        x: nextNode ? nextNode.x : 0,
        y: nextNode ? nextNode.y : 0,
      };
    }

    const finalGridData = [];

    for (let y = 0; y < mappedGridData.length / 3; y++) {
      finalGridData[y] = [];
      for (let x = 0; x < mappedGridData[0].length / 3; x++) {
        const tile = mappedGridData[y * 3][x * 3];
        finalGridData[y].push({
          ...tile,
          value: tile.route ? this.tiles[tile.oldValue].display : tile.value,
        });
      }
    }

    let fullTiles = 0;

    for (let y = 0; y < finalGridData.length; y++) {
      for (let x = 0; x < finalGridData[0].length; x++) {
        const tile = finalGridData[y][x];
        if (tile.value === "0") {
          fullTiles++;
        }
      }
    }

    this.logGrid(finalGridData, finalGridData.length, finalGridData[0].length);

    return fullTiles;
  }

  getDirection(x, y) {
    if (x === -1) {
      return "left";
    }
    if (x === 1) {
      return "right";
    }
    if (y === -1) {
      return "up";
    }
    if (y === 1) {
      return "down";
    }

    throw new Error();
  }

  getOppositeDirection(dir) {
    if (dir === "left") {
      return "right";
    }

    if (dir === "right") {
      return "left";
    }

    if (dir === "up") {
      return "down";
    }

    if (dir === "down") {
      return "up";
    }

    throw new Error();
  }

  logGrid(data, ySize, xSize) {
    let grid = "";

    for (var y = 0; y < ySize; y++) {
      for (var x = 0; x < xSize; x++) {
        grid += data[y][x].displayValue ?? data[y][x].value;
      }

      grid += "\n";
    }

    console.log(grid);
  }

  getStartValue(nodes) {
    const dirs = nodes.map((node) => node.dir);
    dirs[1] = this.getOppositeDirection(dirs[1]);
    let value = "";

    const tileKeys = Object.keys(this.tiles);

    for (let i = 0; i < tileKeys.length; i++) {
      if (tileKeys[i] === "S") {
        return;
      }
      const tile = this.tiles[tileKeys[i]];
      if (dirs.every((dir) => tile[dir])) {
        value = tileKeys[i];
        break;
      }
    }

    return value;
  }
}

new DayTen();
