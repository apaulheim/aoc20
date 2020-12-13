import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      let facing = 0;
      const directions = ["E", "S", "W", "N"];
      let commands = input.split(";");
      const regex = /(?<cmd>[A-Z])(?<val>\d+)/;
      let north = 0;
      let east = 0;
      // waypoint
      let wEast = 10;
      let wNorth = 1;

      const move = (cmd: string, val: number) => {
        if (cmd == "N") north += val;
        else if (cmd == "S") north -= val;
        else if (cmd == "E") east += val;
        else if (cmd == "W") east -= val;
        //   console.log("east", east);
        //   console.log("north", north);
      };

      const moveWaypoint = (cmd: string, val: number) => {
        if (cmd == "N") wNorth += val;
        else if (cmd == "S") wNorth -= val;
        else if (cmd == "E") wEast += val;
        else if (cmd == "W") wEast -= val;
        //   console.log("wEast", wEast);
        //   console.log("wNorth", wNorth);
      };

      for (let command of commands) {
        const match = command.match(regex);
        if (match) {
          const cmd = match.groups.cmd;
          const val = parseInt(match.groups.val);
          console.log(val);
          if (cmd == "L") facing -= val / 90;
          else if (cmd == "R") facing += val / 90;
          else if (cmd == "F") {
            const dirIdx = facing % 4 < 0 ? 4 + (facing % 4) : facing % 4;
            move(directions[dirIdx], val);
          } else move(cmd, val);
        }
      }

      const silver = Math.abs(east) + Math.abs(north);

      // gold
      // ship position
      east = 0;
      north = 0;
      for (let command of commands) {
        const match = command.match(regex);
        if (match) {
          const cmd = match.groups.cmd;
          const val = parseInt(match.groups.val);
          // console.log(val);
          let oldWEast = wEast;
          let oldWNorth = wNorth;
          if (cmd == "L") {
            if (val / 90 == 1) {
              wNorth = oldWEast;
              wEast = oldWNorth * -1;
            } else if (val / 90 == 2) {
              wEast *= -1;
              wNorth *= -1;
            } else if (val / 90 == 3) {
              wNorth = oldWEast * -1;
              wEast = oldWNorth;
            }
          } else if (cmd == "R") {
            if (val / 90 == 1) {
              wNorth = oldWEast * -1;
              wEast = oldWNorth;
            } else if (val / 90 == 2) {
              wEast *= -1;
              wNorth *= -1;
            } else if (val / 90 == 3) {
              wNorth = oldWEast;
              wEast = oldWNorth * -1;
            }
          } else if (cmd == "F") {
            east += wEast * val;
            north += wNorth * val;
          } else moveWaypoint(cmd, val);
        }
      }

      const gold = Math.abs(east) + Math.abs(north);
      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
