import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  const input = req.query.input || (req.body && req.body.input);
  const responseMessage =
    '{ "silver": "Day 1 silver star result from js. Input: ' +
    input +
    '", "gold": "Day 1 gold star result from js. Input: ' +
    input +
    '"}';

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};

export default httpTrigger;
