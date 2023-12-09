const Day = require("./Day");

class DayNine extends Day {
  constructor() {
    super("09");
  }

  async partOne() {
    const data = await this.getData();

    const answers = data.map((d) => {
      const funnelArrays = [d[0].split(" ").map((num) => parseInt(num))];

      for (let i = 0; i < funnelArrays.length; i++) {
        if (funnelArrays[i].every((num) => num === 0)) {
          break;
        }
        funnelArrays.push(this.diff(funnelArrays[i]));
      }

      const reversedFunnelArrays = funnelArrays.reverse();

      for (let i = 0; i < reversedFunnelArrays.length; i++) {
        const leftNumber =
          reversedFunnelArrays[i][reversedFunnelArrays[i].length - 1];
        const rightNumber =
          i === 0
            ? 0
            : reversedFunnelArrays[i - 1][
                reversedFunnelArrays[i - 1].length - 1
              ];
        const newNumber = leftNumber + rightNumber;
        reversedFunnelArrays[i] = [...reversedFunnelArrays[i], newNumber];
      }

      const originalArray = reversedFunnelArrays.reverse()[0];

      return originalArray.reverse()[0];
    });

    return answers.reduce((prev, cur) => prev + cur, 0);
  }

  async partTwo() {
    const data = await this.getData();

    const answers = data.map((d) => {
      const funnelArrays = [d[0].split(" ").map((num) => parseInt(num))];

      for (let i = 0; i < funnelArrays.length; i++) {
        if (funnelArrays[i].every((num) => num === 0)) {
          break;
        }
        funnelArrays.push(this.diff(funnelArrays[i]));
      }

      const reversedFunnelArrays = funnelArrays.reverse();

      for (let i = 0; i < reversedFunnelArrays.length; i++) {
        const leftNumber = i === 0 ? 0 : reversedFunnelArrays[i - 1][0];

        const rightNumber = reversedFunnelArrays[i][0];
        const newNumber = rightNumber - leftNumber;
        reversedFunnelArrays[i] = [newNumber, ...reversedFunnelArrays[i]];
      }

      const originalArray = reversedFunnelArrays.reverse()[0];

      return originalArray[0];
    });

    return answers.reduce((prev, cur) => prev + cur, 0);
  }

  diff(array) {
    return array.slice(1).map(function (n, i) {
      return n - array[i];
    });
  }
}

new DayNine();
