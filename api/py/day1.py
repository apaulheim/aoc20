from http.server import BaseHTTPRequestHandler
from datetime import datetime
import json

class handler(BaseHTTPRequestHandler):

  def do_POST(self):
    content_len = int(self.headers.get('Content-Length'))
    post_body = self.rfile.read(content_len)
    body = json.loads(post_body)
    data = body['input']
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
    
    self.send_response(200)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()
    self.wfile.write(json.dumps(result).encode('utf_8'))
    return