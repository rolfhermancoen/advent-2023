const Day = require("./Day");

class DayEight extends Day {
  constructor() {
    super("08", "=");
  }

  async partOne() {
    const data = await this.getData();
    const instructions = data[0][0].split("");
    const nodes = this.getNodes(data);

    let i = 0;
    let count = 0;
    let found = false;
    let currentNode = nodes.find((no) => no.node === "AAA");

    while (!found) {
      const newNodeCode =
        instructions[i] === "R" ? currentNode.right : currentNode.left;

      currentNode = nodes.find((node) => node.node === newNodeCode);

      if (currentNode.node === "ZZZ") {
        count++;
        found = true;
      } else {
        count++;
        if (i === instructions.length - 1) {
          i = 0;
        } else {
          i++;
        }
      }
    }

    return count;
  }

  async partTwo() {
    const data = await this.getData();
    const instructions = data[0][0].split("");
    const nodes = this.getNodes(data);

    const aNodes = nodes.filter((node) => node.node.endsWith("A"));

    let i = 0;
    let count = 0;
    let counts = Array(aNodes.length).fill(0);
    const found = Array(aNodes.length).fill(false);
    let allFound = false;
    const currentANodes = aNodes;

    while (!allFound) {
      for (let j = 0; j < aNodes.length; j++) {
        if (found[j] === true) {
          continue;
        }
        const newNodeCode =
          instructions[i] === "R"
            ? currentANodes[j].right
            : currentANodes[j].left;

        currentANodes[j] = nodes.find((node) => node.node === newNodeCode);

        if (currentANodes[j].node.endsWith("Z")) {
          counts[j] = count + 1;
          found[j] = true;
        }
      }

      if (found.every((f) => f === true)) {
        allFound = true;
      }

      if (i === instructions.length - 1) {
        i = 0;
      } else {
        i++;
      }

      count++;
    }

    return counts.reduce((prev, cur) => this.lcm(prev, cur), 1);
  }

  lcm(a, b) {
    const gcd = (a, b) => {
      if (b === 0) return a;
      return gcd(b, a % b);
    };
    return (a * b) / gcd(a, b);
  }

  getNodes(data) {
    return data
      .map((d) => {
        if (d.length === 2) {
          return this.parseNode(d);
        }
        return null;
      })
      .filter((d) => d !== null);
  }

  parseNode(node) {
    const dirs = node[1].split(",");

    return {
      node: node[0].replace(" ", ""),
      left: dirs[0].replace(" ", "").replace("(", ""),
      right: dirs[1].replace(" ", "").replace(")", ""),
    };
  }
}

new DayEight();
