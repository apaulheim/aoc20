import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

const parseClasses = (data: string): Map<string, number[]> => {
  const m = new Map<string, number[]>();
  data.split(";").forEach((val: string) => {
    const [cl, rangesStr] = val.split(": ");
    const [range1, range2] = rangesStr.split(" or ");
    const ranges = range1
      .split("-")
      .map((str: string) => parseInt(str))
      .concat(range2.split("-").map((str: string) => parseInt(str)));
    m.set(cl, ranges);
  });
  return m;
};

const parseMyTicket = (data: string): number[] => {
  return data
    .split("your ticket:;")[1]
    .split(",")
    .map((str: string) => parseInt(str));
};

const parseNearbyTickets = (data: string): number[][] => {
  const numbersStrs = data.split("nearby tickets:;")[1].split(";");
  return numbersStrs.map((str: string) =>
    str.split(",").map((str: string) => parseInt(str))
  );
};

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      const [classStr, myTicketStr, nearbyTicketsStr] = input.split(";;");
      const classes = parseClasses(classStr);
      const myTicket = parseMyTicket(myTicketStr);
      let nearbyTickets = parseNearbyTickets(nearbyTicketsStr);

      let silver = 0;
      let invalidTickets = [];
      nearbyTickets.forEach((nearbyTicket: number[], idx: number) => {
        nearbyTicket.forEach((value: number) => {
          let valueIsValid = false;
          classes.forEach((range: number[]) => {
            if (
              (value >= range[0] && value <= range[1]) ||
              (value >= range[2] && value <= range[3])
            ) {
              valueIsValid = true;
            }
          });
          if (!valueIsValid) {
            silver += value;
            invalidTickets.push(idx);
          }
        });
      });

      nearbyTickets = nearbyTickets.filter(
        (_, idx: number) => !invalidTickets.includes(idx)
      );

      let gold = 1;
      let allValidClasses: Array<Set<string>> = [];
      for (let i = 0; i < nearbyTickets[0].length; i++) {
        const s = new Set<string>();
        const fieldValues = nearbyTickets.reduce(
          (fields: number[], currentTicket: number[]) => {
            fields.push(currentTicket[i]);
            return fields;
          },
          []
        );
        classes.forEach((range: number[], name: string) => {
          let valueIsValid = fieldValues.every(
            (value) =>
              (value >= range[0] && value <= range[1]) ||
              (value >= range[2] && value <= range[3])
          );

          if (valueIsValid) {
            s.add(name);
          }
        });

        allValidClasses.push(s);
      }

      let classColumn = new Map<string, number>();
      let i = 0;
      while (i < allValidClasses.length) {
        let shortestSetIdx = allValidClasses.findIndex(
          (s: Set<string>) => s.size == 1
        );
        let currentClass = allValidClasses[shortestSetIdx].values().next()
          .value;
        classColumn.set(currentClass, shortestSetIdx);
        allValidClasses.forEach((s: Set<string>) => s.delete(currentClass));
        i++;
      }
      classColumn.forEach((val: number, name: string) => {
        if (name.startsWith("departure")) gold *= myTicket[val];
      });

      return {
        silver: silver.toString(),
        gold: gold.toString(),
      };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
