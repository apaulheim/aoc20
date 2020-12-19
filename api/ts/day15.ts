import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let data = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (data) {
      const run = (turnslen: number): number => {
        let input = data.split(",");
        let turns = turnslen - input.length;
        let i = 0;
        let map = new Map<number, number>();
        input.forEach((value: number, index: number) => {
          map.set(value, index);
        });
        while (i < turns) {
          let last = input[input.length - 1];
          if (map.has(last)) {
            const val = input.length - 1 - map.get(last);
            map.set(last, input.length - 1);
            input.push(val);
          } else {
            map.set(last, input.length - 1);
            input.push(0);
          }

          i++;
        }
        return input[input.length - 1];
      };
      return {
        silver: run(2020).toString(),
        gold: run(30000000).toString(),
      };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
