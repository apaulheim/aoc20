interface Bag {
  color: string;
  amount: number;
}

import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      // color -> contains colors
      const tree = new Map<string, Array<Bag>>();
      // color -> contained in colors
      const silverTree = new Map<string, Array<string>>();

      const lines = input.split(";");
      const regex = /(?<amount>[0-9]+) (?<color>\w+\s\w+) bag/;

      lines.forEach((line: string) => {
        // strip point
        const line2 = line.substr(0, line.length - 1);
        const [color, rest] = line2.split(" bags contain ");
        const allContents = new Array<Bag>();
        if (rest == "no other bags") {
        } else {
          const contents = rest.split(", ");
          contents.forEach((content: string) => {
            const match = content.match(regex);
            if (match) {
              // gold
              allContents.push({
                color: match.groups.color,
                amount: parseInt(match.groups.amount),
              });
              // silver
              if (silverTree.has(match.groups.color)) {
                const arr = silverTree.get(match.groups.color);
                arr.push(color);
                silverTree.set(match.groups.color, arr);
              } else {
                silverTree.set(match.groups.color, [color]);
              }
            } else console.error("MISMATCH");
          });
        }
        tree.set(color, allContents);
      });
      let alreadyParsed = new Set<string>();
      const parseContainedColors = (color: string) => {
        if (!alreadyParsed.has(color)) {
          alreadyParsed.add(color);
          const arr = silverTree.get(color);
          if (arr) {
            arr.forEach((color: string) => {
              parseContainedColors(color);
            });
          } //else console.log(color, "not contained");
        }
      };
      parseContainedColors("shiny gold");
      const silver = alreadyParsed.size - 1; // contains also shiny gold

      const parseContainedBags = (color: string): number => {
        let result = 1;
        if (tree.has(color)) {
          const arr = tree.get(color);
          //   console.log(color, arr);
          arr.forEach((bag: Bag) => {
            result += bag.amount * parseContainedBags(bag.color);
          });
        }
        return result;
      };
      const gold = parseContainedBags("shiny gold") - 1;

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
