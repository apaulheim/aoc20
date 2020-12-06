import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      let silver = 0;
      let gold = 0;
      const groups = input.split(",,");
      groups.forEach((group) => {
        // silver part
        const groupSet = new Set();
        const persons = group.split(",");

        // gold part
        let goldAnswers = new Set();
        for (let i = 0; i < persons[0].length; i++) {
          goldAnswers.add(persons[0][i]);
        }

        persons.forEach((answers) => {
          // silver part
          for (let i = 0; i < answers.length; i++) {
            groupSet.add(answers[i]);
          }

          // gold part
          let commonAnswers = new Set();
          let goldAnsArray = Array.from(goldAnswers);
          for (let i = 0; i < goldAnsArray.length; i++) {
            if (answers.includes(goldAnsArray[i]))
              commonAnswers.add(goldAnsArray[i]);
          }
          goldAnswers = commonAnswers;
        });
        silver += groupSet.size;
        gold += goldAnswers.size;
      });

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
