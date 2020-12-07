import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      input = input.split(";");
      let silver = 0;
      let gold = 0;

      const regexofdoom = /(?<lower>[0-9]+)-(?<upper>[0-9]+) (?<letter>[a-z]): (?<pw>[a-z]*)/;

      for (const i of input) {
        const match = i.match(regexofdoom);
        if (match) {
          const data = match.groups;
          if (data) {
            const regex = new RegExp(data.letter, "g");
            const found = data.pw.match(regex);
            if (
              found &&
              found.length >= data.lower &&
              found.length <= data.upper
            )
              silver++;
          }

          const pos1 = data.pw.charAt(data.lower - 1) == data.letter;
          const pos2 = data.pw.charAt(data.upper - 1) == data.letter;
          if (pos1 != pos2) gold++;
        } else return { silver: "Wrong input", gold: "Wrong input" };
      }
      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
