import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      const lines = input.split(",");

      const calc = function (right, down) {
        let x = 0;
        let y = 0;
        let trees = 0;

        while (y < lines.length - down) {
          x += right;
          y += down;
          if (lines[y][x % lines[y].length] == "#") trees++;
        }

        return trees;
      };

      let silver = calc(3, 1);

      let gold = 1;

      let xVals = [1, 3, 5, 7, 1];
      let yVals = [1, 1, 1, 1, 2];
      for (let i = 0; i < xVals.length; i++) {
        gold *= calc(xVals[i], yVals[i]);
      }

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
