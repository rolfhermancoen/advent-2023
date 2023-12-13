const Day = require("./Day");

class DayTwelve extends Day {
  constructor() {
    super("12", " ");
  }

  async partOne() {
    const data = await this.getData();

    const valids = [];
    for (let i = 0; i < data.length; i++) {
      const solved = this.solve(
        data[i][0].split(""),
        data[i][1].split(",").map((val) => parseInt(val))
      );

      valids.push(solved);
    }

    return valids.reduce((prev, cur) => prev + cur, 0);
  }

  async partTwo() {
    const data = await this.getData();

    const newData = this.expandData(data);

    const valids = [];
    for (let i = 0; i < newData.length; i++) {
      const solved = this.solve(
        newData[i][0].split(""),
        newData[i][1].split(",").map((val) => parseInt(val))
      );

      valids.push(solved);
    }

    return valids.reduce((prev, cur) => prev + cur, 0);
  }

  expandData(data) {
    const newData = data.map((d) => {
      const map = Array(5).fill(d[0]).join("?");
      const damage = Array(5).fill(d[1]).join(",");

      return [map, damage];
    });

    return newData;
  }

  solve(
    row,
    group,
    cache = {},
    index = 0,
    groupIndex = 0,
    groupElementIndex = 0
  ) {
    const key = `${index},${groupIndex},${groupElementIndex}`;

    if (key in cache) {
      return cache[key];
    }

    if (index === row.length) {
      if (groupIndex === group.length && groupElementIndex === 0) {
        return 1;
      }
      if (
        groupIndex === group.length - 1 &&
        group[groupIndex] === groupElementIndex
      ) {
        return 1;
      }
      return 0;
    }

    let answer = 0;

    if (row[index] === "#" || row[index] === "?") {
      answer = this.solve(
        row,
        group,
        cache,
        index + 1,
        groupIndex,
        groupElementIndex + 1
      );
    }

    if (row[index] === "." || row[index] === "?") {
      if (groupElementIndex === 0) {
        answer += this.solve(row, group, cache, index + 1, groupIndex, 0);
      }
      if (
        groupElementIndex > 0 &&
        groupIndex < group.length &&
        group[groupIndex] === groupElementIndex
      ) {
        answer += this.solve(row, group, cache, index + 1, groupIndex + 1, 0);
      }
    }

    return (cache[key] = answer);
  }
}

new DayTwelve();
