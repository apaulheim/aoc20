import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      const numbers = input.split(";").map((str: string) => parseInt(str));
      let silver = 0;
      let gold = 0;

      for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
          if (numbers[i] + numbers[j] == 2020) {
            silver = numbers[i] * numbers[j];
          }
          for (let k = 0; k < numbers.length; k++) {
            if (numbers[i] + numbers[j] + numbers[k] == 2020) {
              gold = numbers[i] * numbers[j] * numbers[k];
            }
          }
        }
      }
      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
