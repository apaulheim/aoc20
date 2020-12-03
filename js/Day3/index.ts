import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  let input = req.query.input || (req.body && req.body.input);
  const lines = input.split(",");

  const calc = function (right, down) {
    let x = 0;
    let y = 0;
    let trees = 0;

    while (y < lines.length - down) {
      x += right;
      y += down;
      if (lines[y][x % lines[y].length] == "#") trees++;
    }

    return trees;
  };

  let silver = calc(3, 1);

  let gold = 1;

  let xVals = [1, 3, 5, 7, 1];
  let yVals = [1, 1, 1, 1, 2];
  for (let i = 0; i < xVals.length; i++) {
    gold *= calc(xVals[i], yVals[i]);
  }

  const responseMessage = `{ "silver": "${silver}", "gold": "${gold}" }`;
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
