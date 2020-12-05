import logging
import azure.functions as func
import json

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python Day1 function processed a request.')

    data = req.params.get('input')
    if not data:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            data = req_body.get('input')

    if data:
        numbers = list(map(int, data.split(",")))
        silver = 0
        gold = 0
        for i in numbers:
            for j in numbers:
                if i + j == 2020:
                    silver = i * j
                for k in numbers:
                    if i + j + k == 2020:
                        gold = i * j * k


        result = { "silver": str(silver), "gold": str(gold) }
    else:
        result = { "silver": "No input", "gold": "No input" }
        
    return func.HttpResponse(json.dumps(result))
