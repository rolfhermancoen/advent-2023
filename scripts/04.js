const Day = require("./Day");

class DayFour extends Day {
  constructor() {
    super("04", "|");
  }

  async partOne() {
    const parsedData = await this.getData();

    const mappedData = parsedData.map((dat) => {
      return {
        winning: dat[0]
          .replace(/Card\s+[0-9]{1,3}:/g, "")
          .split(" ")
          .filter((d) => d !== ""),
        numbers: dat[1].split(" ").filter((d) => d !== ""),
      };
    });

    const winningNumbersPerCard = mappedData.map((card) => {
      const winningNumbers = [];

      for (let i = 0; i < card.numbers.length; i++) {
        const number = card.numbers[i];
        if (card.winning.some((num) => num === number)) {
          winningNumbers.push(number);
          continue;
        }
      }
      return winningNumbers;
    });

    const pointsPerCard = winningNumbersPerCard.map((card) => {
      if (card.length === 0) {
        return 0;
      }

      if (card.length === 1) {
        return 1;
      }

      return Math.pow(2, card.length - 1);
    });

    return pointsPerCard.reduce((prev, cur) => prev + cur, 0);
  }

  async partTwo() {
    const parsedData = await this.getData();

    const mappedData = parsedData.map((dat) => {
      return {
        winning: dat[0]
          .replace(/Card\s+[0-9]{1,3}:/g, "")
          .split(" ")
          .filter((d) => d !== ""),
        numbers: dat[1].split(" ").filter((d) => d !== ""),
      };
    });

    const winningNumbersPerCard = mappedData.map((card) => {
      const winningNumbers = [];

      for (let i = 0; i < card.numbers.length; i++) {
        const number = card.numbers[i];
        if (card.winning.some((num) => num === number)) {
          winningNumbers.push(number);
          continue;
        }
      }

      return winningNumbers.length;
    });

    const totalCards = Array.from(Array(winningNumbersPerCard.length)).map(
      () => 1
    );

    for (let i = 0; i < winningNumbersPerCard.length; i++) {
      const count = totalCards[i];

      const wins = winningNumbersPerCard[i];

      if (wins === 0) {
        continue;
      }

      for (let j = 0; j < wins; j++) {
        const previousCount = totalCards[i + j + 1];
        if (i + j + 1 < winningNumbersPerCard.length) {
          totalCards[i + j + 1] = previousCount + count;
        }
      }
    }

    return totalCards.reduce((prev, cur) => prev + cur, 0);
  }
}

new DayFour();
