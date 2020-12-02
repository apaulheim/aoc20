import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  let input = req.query.input || (req.body && req.body.input);
  input = input.split(",");
  let silver = 0;
  let gold = 0;

  const regexofdoom = /(?<lower>[0-9]+)-(?<upper>[0-9]+) (?<letter>[a-z]): (?<pw>[a-z]*)/;

  for (const i of input) {
    const data = i.match(regexofdoom).groups;
    if (data) {
      const regex = new RegExp(data.letter, "g");
      const found = data.pw.match(regex);
      if (found && found.length >= data.lower && found.length <= data.upper)
        silver++;
    }

    const pos1 = data.pw.charAt(data.lower - 1) == data.letter;
    const pos2 = data.pw.charAt(data.upper - 1) == data.letter;
    if (pos1 != pos2) gold++;
  }

  const responseMessage = `{ "silver": "${silver}", "gold": "${gold}" }`;
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
