const Day = require("./Day");

class DaySix extends Day {
  constructor() {
    super("06");
  }

  async partOne() {
    const data = await this.getData();
    const times = this.parseDataString(data[0][0]);
    const distances = this.parseDataString(data[1][0]);

    const beatNumbers = [];
    for (let i = 0; i < distances.length; i++) {
      const distance = parseInt(distances[i]);
      const time = parseInt(times[i]);

      const beats = [];
      for (let j = 0; j < time; j++) {
        const spareTime = time - j;
        const possibleDistance = spareTime * j;

        if (possibleDistance > distance) {
          beats.push(j);
        }
      }

      beatNumbers.push(beats.length);
    }

    return beatNumbers.reduce((prev, cur) => prev * cur, 1);
  }

  async partTwo() {
    const data = await this.getData();
    const times = this.parseDataString(data[0][0]);
    const distances = this.parseDataString(data[1][0]);

    const time = times.reduce((prev, cur) => prev + cur, "");
    const distance = distances.reduce((prev, cur) => prev + cur, "");

    const beats = [];
    for (let j = 0; j < time; j++) {
      const spareTime = time - j;
      const possibleDistance = spareTime * j;

      if (possibleDistance > distance) {
        beats.push(j);
      }
    }

    return beats.length;
  }

  parseDataString(string) {
    return string.match(/\d{1,4}/g);
  }
}

new DaySix();
