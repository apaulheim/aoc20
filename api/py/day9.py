from http.server import BaseHTTPRequestHandler
from datetime import datetime
import json
import itertools

class handler(BaseHTTPRequestHandler):

  def do_POST(self):
    content_len = int(self.headers.get('Content-Length'))
    post_body = self.rfile.read(content_len)
    body = json.loads(post_body)
    data = body['input']
    if data:
        lines = list(map(lambda s: int(s), data.split(";")))
        lengthToCheck = 25
        currentIdx = 0
        silver = 0
        gold = 0

        def findGold(low: int, up: int) -> int:
            contiguous = []
            for i in range(low, up+1):
                contiguous.append(lines[i])
            return min(contiguous) + max(contiguous)

        def checkForGold(j: int, length: int, silver:int) -> int:
            sum = 0
            while j < length and sum <= silver:
                sum += lines[j]
                if sum == silver:
                    return findGold(i, j)            
                j += 1
            return -1


        for j in range(len(lines) - lengthToCheck):
            preambleArray = []
            for i in range(j, j + lengthToCheck):
                preambleArray.append(lines[i])
            sums = []
            a = itertools.combinations(preambleArray,2) 
            for (add1, add2) in a: 
                sums.append(add1 + add2)
            if lines[j+lengthToCheck] not in sums:
                silver = lines[j+lengthToCheck]

        for i in range(len(lines)):
            val = checkForGold(i, len(lines), silver)
            if(val != -1):
                gold = val
                break
        
        result = { "silver": str(silver), "gold": str(gold) }
    else:
        result = { "silver": "No input", "gold": "No input" }
    
    self.send_response(200)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()
    self.wfile.write(json.dumps(result).encode('utf_8'))
    return