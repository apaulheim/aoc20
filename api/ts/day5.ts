import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      const findRow = (lower, upper, dir) => {
        let newlower = lower;
        let newupper = upper;
        let half = (upper + 1 - lower) / 2;
        if (dir == "F" || dir == "L") newupper = upper - half;
        else if (dir == "B" || dir == "R") newlower = lower + half;
        return [newlower, newupper];
      };

      let silver = 0;
      const directionsStr = input.split(",");
      const allSeats = new Set();
      for (let i = 0; i < 1024; i++) {
        allSeats.add(i);
      }
      directionsStr.forEach((directions) => {
        const rowDirections = directions.substr(0, 7);
        const columnDirections = directions.substr(7);
        let upper = 127;
        let lower = 0;
        for (let i = 0; i < rowDirections.length; i++) {
          [lower, upper] = findRow(lower, upper, rowDirections[i]);
        }
        let right = 7;
        let left = 0;
        for (let i = 0; i < columnDirections.length; i++) {
          [left, right] = findRow(left, right, columnDirections[i]);
        }
        let res = lower * 8 + left;
        allSeats.delete(res);
        if (res > silver) silver = res;
      });
      console.log(silver);
      let gold = 0;
      let allSeatsArray = Array.from(allSeats.values()).sort();
      let i = 0;
      while (i == allSeatsArray[i] && i < allSeatsArray.length) i++;
      gold = allSeatsArray[i];

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
