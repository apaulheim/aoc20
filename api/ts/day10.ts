import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      let adapters = input
        .split(";")
        .map((line: string) => parseInt(line))
        .sort((a: number, b: number) => a - b);

      adapters = [0].concat(adapters);
      adapters = adapters.concat(adapters[adapters.length - 1] + 3);

      let one = 0;
      let three = 0;
      let i = 1;
      while (i < adapters.length) {
        let val = adapters[i] - adapters[i - 1];
        if (val == 1) one++;
        else if (val == 3) three++;
        i++;
      }

      const silver = one * three;

      const possibilities = [];

      const isValidAdapter = (a: number, b: number): boolean => {
        return b - a == 1 || b - a == 2 || b - a == 3;
      };

      for (let i = 0; i < adapters.length - 1; i++) {
        let poss = 0;
        if (
          i < adapters.length - 1 &&
          isValidAdapter(adapters[i], adapters[i + 1])
        )
          poss++;
        if (
          i < adapters.length - 2 &&
          isValidAdapter(adapters[i], adapters[i + 2])
        )
          poss++;
        if (
          i < adapters.length - 3 &&
          isValidAdapter(adapters[i], adapters[i + 3])
        )
          poss++;
        possibilities.push(poss);
      }

      for (let i = possibilities.length - 2; i >= 0; i--) {
        if (possibilities[i] == 1) {
          possibilities[i] = possibilities[i + 1];
        } else if (possibilities[i] == 2) {
          possibilities[i] =
            possibilities[i + 1] +
            (i + 2 < possibilities.length ? possibilities[i + 2] : 0);
        } else if (possibilities[i] == 3) {
          possibilities[i] =
            possibilities[i + 1] +
            possibilities[i + 2] +
            (i + 3 < possibilities.length ? possibilities[i + 3] : 0);
        }
      }

      const gold = possibilities[0];

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
