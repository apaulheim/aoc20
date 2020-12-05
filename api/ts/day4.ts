import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      const passportsStr = input.split(",,");
      let silver = 0;
      let gold = 0;
      for (let passport of passportsStr) {
        if (
          passport.includes("byr:") &&
          passport.includes("iyr:") &&
          passport.includes("eyr:") &&
          passport.includes("hgt:") &&
          passport.includes("hcl:") &&
          passport.includes("ecl:") &&
          passport.includes("pid:")
        ) {
          silver++;

          let pass = {};
          passport.split(",").forEach((line) => {
            line.split(" ").forEach((data) => {
              const [key, val] = data.split(":");
              pass[key] = val;
            });
          });

          let validEntries = new Set();
          Object.keys(pass).forEach((key) => {
            if (key == "byr") {
              const val = parseInt(pass[key]);
              if (val >= 1920 && val <= 2002) validEntries.add("byr");
            } else if (key == "iyr") {
              const val = parseInt(pass[key]);
              if (val >= 2010 && val <= 2020) validEntries.add("iyr");
            } else if (key == "eyr") {
              const val = parseInt(pass[key]);
              if (val >= 2020 && val <= 2030) validEntries.add("eyr");
            } else if (key == "hgt") {
              const re = /^(?<hgt>[0-9]+)(?<unit>(cm|in))$/;
              const match = pass[key].match(re);
              if (match) {
                const hgt = parseInt(match.groups.hgt);
                if (
                  (match.groups.unit == "cm" && hgt >= 150 && hgt <= 193) ||
                  (match.groups.unit == "in" && hgt >= 59 && hgt <= 76)
                )
                  validEntries.add("hgt");
              }
            } else if (key == "hcl") {
              const re = /^#(([0-9]|[a-f]){6})$/;
              const match = pass[key].match(re);
              if (match) validEntries.add("hcl");
            } else if (key == "ecl") {
              const re = /^(amb|blu|brn|gry|grn|hzl|oth)$/;
              const match = pass[key].match(re);
              if (match) validEntries.add("ecl");
            } else if (key == "pid") {
              const re = /^([0-9]){9}$/;
              const match = pass[key].match(re);
              if (match) validEntries.add("pid");
            }
          });
          if (validEntries.size == 7) {
            gold++;
          }
        }
      }

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
