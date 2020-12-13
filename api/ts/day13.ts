// const input = "939;7,13,x,x,59,x,31,19";
import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      let [arrivalStr, bussesStr] = input.split(";");
      const arrival = parseInt(arrivalStr);
      const busses = bussesStr
        .split(",")
        .filter((bus: string) => bus != "x")
        .map((bus: string) => parseInt(bus));

      let departure = arrival;
      let buss = [];
      while (true) {
        buss = busses.filter((bus: number) => departure % bus == 0);
        if (buss.length == 0) departure++;
        else break;
      }
      const silver = (departure - arrival) * buss[0];

      // IDEA
      // 17 * 6     13 * 8  // find first match
      //     +13        +17
      // 17 * 19    13 * 25 // find next match
      //     +13        +17
      // 17 * 32    13 * 42 // -> multiplier for 17 and 13 will stay the same
      // -> always use 17*13 to find next bus

      // 17 * 201    13 * 263    19 * 180 // find first match with +13 +17
      //     +247        +323        +221
      // 17 * 448    13 * 586    19 * 401 // find next match with +13 +17
      //     +247        +323        +221
      // 17 * 695    13 * 909    19 * 622 // multiplier will stay the same
      // -> always use 17*247 to find next bus

      let bussesGold = bussesStr.split(",");
      let t = 0;
      let baseStep = parseInt(bussesGold[0]);
      let multiplier = 1;

      for (let i = 1; i < bussesGold.length; i++) {
        if (bussesGold[i] == "x") continue;
        else {
          let departureOffset = i;
          // first match
          while ((t + departureOffset) % parseInt(bussesGold[i]) != 0) {
            t += baseStep * multiplier;
          }
          let multiplier1 = t / baseStep;
          // no second match for last bus
          if (i < bussesGold.length - 1) {
            // second match
            t += baseStep * multiplier;
            while ((t + departureOffset) % parseInt(bussesGold[i]) != 0) {
              t += baseStep * multiplier;
            }
            let multiplier2 = t / baseStep;
            // new multiplier
            multiplier = multiplier2 - multiplier1;
          }
        }
      }
      const gold = t;
      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
