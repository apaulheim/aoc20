import logging
import azure.functions as func
import json
import re

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python Day2 function processed a request.')

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
        silver = 0
        gold = 0
        for i in lines:
            matchObj = re.match(r'(\d+)-(\d+) ([a-z]): ([a-z]*)', i)
            if matchObj:
                matches = matchObj.groups()
                lower = int(matches[0])
                upper = int(matches[1])
                letter = matches[2]
                pw = matches[3]

                regex = re.compile(letter)
                occ = regex.findall(pw)
                if len(occ) > 0 and (lower <= len(occ) <= upper):  
                    silver += 1

                pos1 = pw[lower-1] == letter
                pos2 = pw[upper-1] == letter

                if pos1 != pos2:
                    gold += 1

        result = { "silver": str(silver), "gold": str(gold) }
    else:
        result = { "silver": "No input", "gold": "No input" }
        
    return func.HttpResponse(json.dumps(result))
