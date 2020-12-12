import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      let rows = input.split(";");

      const seesOccupiedInDir = (
        x: number,
        y: number,
        dirx: number,
        diry: number,
        loop: boolean
      ): number => {
        let posx = x;
        let posy = y;
        do {
          // go one step in direction
          posx += dirx;
          posy += diry;
        } while (
          loop &&
          posx >= 0 &&
          posy >= 0 &&
          posy < rows.length &&
          posx < rows[posy].length &&
          !(rows[posy][posx] == "#" || rows[posy][posx] == "L")
        );
        return posx >= 0 &&
          posy >= 0 &&
          posy < rows.length &&
          posx < rows[posy].length &&
          rows[posy][posx] == "#"
          ? 1
          : 0;
      };

      const countOccupied = (): number => {
        let c = 0;
        for (let y = 0; y < rows.length; y++) {
          for (let x = 0; x < rows[y].length; x++) {
            if (rows[y][x] == "#") c++;
          }
        }
        return c;
      };

      // 1 2 3
      // 0 X 4
      // 7 6 5
      const seatsOccupied = (
        x: number,
        y: number,
        loopMode: boolean
      ): number => {
        let result = 0;
        result += seesOccupiedInDir(x, y, -1, 0, loopMode);
        result += seesOccupiedInDir(x, y, -1, -1, loopMode);
        result += seesOccupiedInDir(x, y, 0, -1, loopMode);
        result += seesOccupiedInDir(x, y, 1, -1, loopMode);
        result += seesOccupiedInDir(x, y, 1, 0, loopMode);
        result += seesOccupiedInDir(x, y, 1, 1, loopMode);
        result += seesOccupiedInDir(x, y, 0, 1, loopMode);
        result += seesOccupiedInDir(x, y, -1, 1, loopMode);
        return result;
      };

      const doRound = (
        occupy: boolean,
        goldMode: boolean
      ): [number, string[]] => {
        let cop = [...rows];
        let seatsChanged = 0;
        for (let y = 0; y < rows.length; y++) {
          for (let x = 0; x < rows[y].length; x++) {
            if (
              occupy &&
              rows[y][x] == "L" &&
              seatsOccupied(x, y, goldMode) == 0
            ) {
              cop[y] = cop[y].substring(0, x) + "#" + cop[y].substring(x + 1);
              seatsChanged += 1;
            }
            if (
              !occupy &&
              rows[y][x] == "#" &&
              ((!goldMode && seatsOccupied(x, y, goldMode) >= 4) ||
                (goldMode && seatsOccupied(x, y, goldMode) >= 5))
            ) {
              cop[y] = cop[y].substring(0, x) + "L" + cop[y].substring(x + 1);
              seatsChanged += 1;
            }
          }
        }
        return [seatsChanged, cop];
      };

      // silver
      let result1 = 1;
      let result2 = 1;
      do {
        [result1, rows] = doRound(true, false);
        [result2, rows] = doRound(false, false);
      } while (result1 > 0 || result2 > 0);
      let silver = countOccupied();

      // gold
      rows = input.split(";");
      result1 = 1;
      result2 = 1;
      do {
        [result1, rows] = doRound(true, true);
        [result2, rows] = doRound(false, true);
      } while (result1 > 0 || result2 > 0);
      let gold = countOccupied();

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
