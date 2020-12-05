from http.server import BaseHTTPRequestHandler
from datetime import datetime
import json
import re

class handler(BaseHTTPRequestHandler):

  def do_POST(self):
    content_len = int(self.headers.get('Content-Length'))
    post_body = self.rfile.read(content_len)
    body = json.loads(post_body)
    data = body['input']
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

    self.send_response(200)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()
    self.wfile.write(json.dumps(result).encode('utf_8'))
    return