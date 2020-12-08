import { NowRequest, NowResponse } from "@vercel/node";
import { StarResult } from "./shared/data";

interface Cmd {
  cmd: string;
  value: number;
}
export default (request: NowRequest, response: NowResponse) => {
  let input = request.body && request.body.input;
  let responseMessage: StarResult;

  const solve = (): StarResult => {
    if (input) {
      const regex = /(?<command>nop|acc|jmp) (?<sign>\+|-)(?<value>\d+)/;
      const parseCommand = (commandStr: string): Cmd => {
        const match = commandStr.match(regex);
        if (match) {
          return {
            cmd: match.groups.command,
            value:
              match.groups.sign == "+"
                ? parseInt(match.groups.value)
                : parseInt(match.groups.value) * -1,
          };
        } else return null;
      };

      const commands = input
        .split(";")
        .map((cmdStr: string) => parseCommand(cmdStr));

      // returns [terminated, accumulator]
      const runProgram = (commands: Array<Cmd>): [boolean, number] => {
        const executedCommands = new Set<number>();
        let currentCommand = 0;
        let accumulator = 0;
        while (currentCommand < commands.length) {
          if (executedCommands.has(currentCommand)) {
            // infinite loop
            return [false, accumulator];
          }
          executedCommands.add(currentCommand);
          if (commands[currentCommand].cmd == "nop") {
            currentCommand++;
          } else if (commands[currentCommand].cmd == "acc") {
            accumulator += commands[currentCommand].value;
            currentCommand++;
          } else if (commands[currentCommand].cmd == "jmp") {
            currentCommand += commands[currentCommand].value;
          }
        }
        return [true, accumulator];
      };

      let [terminated, silver] = runProgram(commands);

      let gold = 0;
      let commandToChange = 0;
      while (commandToChange < commands.length) {
        // find next nop|jmp command
        while (
          commandToChange < commands.length &&
          (commands[commandToChange].cmd == "acc" ||
            (commands[commandToChange].cmd == "nop" &&
              commands[commandToChange].value == 0))
        )
          commandToChange++;
        // exchange command
        if (commands[commandToChange].cmd == "nop")
          commands[commandToChange].cmd = "jmp";
        else commands[commandToChange].cmd = "nop";
        // run program
        let [term, acc] = runProgram(commands);
        if (term) {
          gold = acc;
          break;
        }
        // change back
        if (commands[commandToChange].cmd == "nop")
          commands[commandToChange].cmd = "jmp";
        else commands[commandToChange].cmd = "nop";
        commandToChange++;
      }

      return { silver: silver.toString(), gold: gold.toString() };
    } else return { silver: "No input", gold: "No input" };
  };

  responseMessage = solve();
  response.status(200).json(responseMessage);
};
