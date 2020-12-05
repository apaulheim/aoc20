import logging
import azure.functions as func
import json

def calc(lines, right: int, down: int) -> int:
    x = 0
    y = 0
    trees = 0

    while y < len(lines) - down: 
        x += right
        y += down
        if lines[y][x % len(lines[y])] == "#":
            trees += 1
    return trees

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python Day3 function processed a request.')

    data = req.params.get('input')
    if not data:
        try:
            req_body = req.get_json()
        except ValueError:
            pass
        else:
            data = req_body.get('input')
    
    if data:
        lines = data.split(",")
        silver = calc(lines, 3, 1)
        gold = 1

        xVals = [1, 3, 5, 7, 1]
        yVals = [1, 1, 1, 1, 2]
        for i in range(len(xVals)):
            gold *= calc(lines, xVals[i], yVals[i])

        result = { "silver": str(silver), "gold": str(gold) }
    else:
        result = { "silver": "No input", "gold": "No input" }
        
    return func.HttpResponse(json.dumps(result))
