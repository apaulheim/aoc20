import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

interface Day14Parsed {
  type: string;
  index: number;
  value: number | string;
}

const decToBin = (dec: number): string => {
  return (dec >>> 0).toString(2);
};

const binToDec = (bin: string): number => {
  return parseInt(bin, 2);
};

const applyBitmask = (dec: number, mask: string): number => {
  const binary = decToBin(dec);
  const newValue = [];
  for (let i = 1; i <= mask.length; i++) {
    newValue.push(
      mask.charAt(mask.length - i) == "X"
        ? i <= binary.length
          ? binary.charAt(binary.length - i)
          : 0
        : mask.charAt(mask.length - i)
    );
  }
  const newBinary = newValue.reverse().join("");
  return binToDec(newBinary);
};

const allPossibleValues = (strs: string[]): string[] => {
  let res = [];
  strs.forEach((val: string) => {
    const idx = val.indexOf("X");
    if (idx != -1) {
      res.push(val.substring(0, idx) + "0" + val.substring(idx + 1));
      res.push(val.substring(0, idx) + "1" + val.substring(idx + 1));
    }
  });
  return res;
};

const applyBitmaskGold = (dec: number, mask: string): number[] => {
  const binary = decToBin(dec);
  //   console.log(binary);
  //   console.log(mask);
  const newValue = [];
  for (let i = 1; i <= mask.length; i++) {
    if (mask.charAt(mask.length - i) != "0")
      newValue.push(mask.charAt(mask.length - i));
    else if (mask.charAt(mask.length - i) == "0") {
      if (i <= binary.length) newValue.push(binary.charAt(binary.length - i));
      else newValue.push("0");
    }
  }
  const newBinary = newValue.reverse().join("");
  //   console.log(newBinary);
  let res = [newBinary];
  while (res[0].indexOf("X") != -1) {
    res = allPossibleValues(res);
  }
  //   console.log(res);
  return res.map((strval: string) => binToDec(strval));
};

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      let data = input.split(";").map((dataStr: string) => {
        const [cmd, value] = dataStr.split(" = ");
        if (cmd == "mask") return { type: cmd, index: 0, value } as Day14Parsed;
        else {
          let match = cmd.match(/mem\[(?<idx>\d+)\]/);
          if (match) {
            return {
              type: "mem",
              index: parseInt(match.groups.idx),
              value: parseInt(value),
            } as Day14Parsed;
          }
        }
      });
      const silverVersion = () => {
        let result = new Map<number, number>();
        let lastMask = "";
        data.forEach((entry: Day14Parsed) => {
          if (entry.type == "mask") lastMask = entry.value as string;
          else {
            result.set(
              entry.index,
              applyBitmask(entry.value as number, lastMask)
            );
          }
        });
        let silver = 0;
        result.forEach((val: number) => (silver += val));
        return silver;
      };

      const goldVersion = () => {
        let result = new Map<number, number>();
        let lastMask = "";
        data.forEach((entry: Day14Parsed) => {
          if (entry.type == "mask") lastMask = entry.value as string;
          else {
            let indices = applyBitmaskGold(entry.index as number, lastMask);
            indices.forEach((index: number) => {
              result.set(index, entry.value as number);
            });
          }
        });
        let gold = 0;
        result.forEach((val: number) => (gold += val));
        return gold;
      };

      return {
        silver: silverVersion().toString(),
        gold: goldVersion().toString(),
      };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
