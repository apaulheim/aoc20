import logging

import azure.functions as func

import json


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    input = req.params.get('input')
    if not input:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            input = req_body.get('input')

    result = { "silver": "Day 1 silver star result from py.", "gold": "Day 1 gold star result from py."}
    if input:
        return func.HttpResponse(json.dumps(result))
    else:
        return func.HttpResponse(json.dumps(result))
