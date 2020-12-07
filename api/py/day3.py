from http.server import BaseHTTPRequestHandler
from datetime import datetime
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

class handler(BaseHTTPRequestHandler):

  def do_POST(self):
    content_len = int(self.headers.get('Content-Length'))
    post_body = self.rfile.read(content_len)
    body = json.loads(post_body)
    data = body['input']
    if data:
        lines = data.split(";")
        silver = calc(lines, 3, 1)
        gold = 1

        xVals = [1, 3, 5, 7, 1]
        yVals = [1, 1, 1, 1, 2]
        for i in range(len(xVals)):
            gold *= calc(lines, xVals[i], yVals[i])

        result = { "silver": str(silver), "gold": str(gold) }
    else:
        result = { "silver": "No input", "gold": "No input" }
    
    self.send_response(200)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()
    self.wfile.write(json.dumps(result).encode('utf_8'))
    return