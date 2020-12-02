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

  for (const i of input) {
    const space = i.split(" ");
    const range = space[0].split("-");
    const letter = space[1].split(":")[0];
    const lower = range[0];
    const upper = range[1];
    const pw = space[2];

    const regex = new RegExp(letter, "g");
    const found = pw.match(regex);
    if (found && found.length >= lower && found.length <= upper) silver++;

    const pos1 = pw.charAt(lower - 1) == letter;
    const pos2 = pw.charAt(upper - 1) == letter;

    if (pos1 != pos2) gold++;
  }
  const responseMessage = `{ "silver": "${silver}", "gold": "${gold}" }`;
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
