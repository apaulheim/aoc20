import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const input = req.query.input || (req.body && req.body.input);
  const numbers = input.split(",").map((str: string) => parseInt(str));
  let silver = 0;
  let gold = 0;

  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] == 2020) {
        silver = numbers[i] * numbers[j];
      }
      for (let k = 0; k < numbers.length; k++) {
        if (numbers[i] + numbers[j] + numbers[k] == 2020) {
          gold = numbers[i] * numbers[j] * numbers[k];
        }
      }
    }
  }
  const responseMessage = `{ "silver": "${silver}", "gold": "${gold}" }`;

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
