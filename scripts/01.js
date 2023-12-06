const  Day  = require("./Day");

class DayOne extends Day {
  chars = {
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  }

  constructor() {
    super("01");
  }

  async partOne() {
    const data = await this.getData();
    const mappedData = data.map((d) => d[0].replace(/\D/g, ""));
    const twoDigitsData = mappedData.map((d) =>
      parseInt(d[0] + d[d.length - 1])
    );
    return twoDigitsData.reduce((prev, cur) => prev + cur, 0);
  };

  async partTwo() {
    const data = await this.getData();
    const regex = /(?=(one|two|three|four|five|six|seven|eight|nine|[1-9]))/g;
    const mappedData = data.map((d) => {
      const found = Array.from(d[0].matchAll(regex), (x) => x[1]).join("");

      return found.replace(
        /one|two|three|four|five|six|seven|eight|nine/g,
        (m) => this.chars[m]
      );
    });

    const twoDigitsData = mappedData.map((d) =>
      parseInt(d[0] + d[d.length - 1])
    );
    return twoDigitsData.reduce((prev, cur) => prev + cur, 0);
  };
}

new DayOne();