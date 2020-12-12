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
        rows = list(map(lambda s: s, data.split(";")))

        def sees_occupied_in_dir(x: int, y: int, dirx: int, diry: int, loop: bool ) -> int:
            posx = x
            posy = y
            posx += dirx
            posy += diry
            while loop and posx >= 0 and posy >= 0 and posy < len(rows) and posx < len(rows[y]) and not(rows[posy][posx] == "#" or rows[posy][posx] == "L"):
                posx += dirx
                posy += diry
            if posx >= 0 and posy >= 0 and posy < len(rows) and posx < len(rows[y]) and rows[posy][posx] == "#":
                return 1
            else:
                return 0

        def count_occupied() -> int:
            c = 0
            for y in range(len(rows)):
                for x in range(len(rows[y])):
                    if rows[y][x] == "#":
                        c += 1
            return c

        def seats_occupied(x: int, y: int, loop_mode: bool) -> int:
            result = 0
            result += sees_occupied_in_dir(x, y, -1, 0, loop_mode)
            result += sees_occupied_in_dir(x, y, -1, -1, loop_mode)
            result += sees_occupied_in_dir(x, y, 0, -1, loop_mode)
            result += sees_occupied_in_dir(x, y, 1, -1, loop_mode)
            result += sees_occupied_in_dir(x, y, 1, 0, loop_mode)
            result += sees_occupied_in_dir(x, y, 1, 1, loop_mode)
            result += sees_occupied_in_dir(x, y, 0, 1, loop_mode)
            result += sees_occupied_in_dir(x, y, -1, 1, loop_mode)
            return result

        # mode true for occupying, mode false for leaving, cop: copy of rows
        # returns seats changed
        def do_round(occupy: bool, gold_mode: bool) -> (int, list):
            cop = rows[:]
            seats_changed = 0
            for y in range(len(rows)):
                for x in range(len(rows[y])):
                    if occupy and rows[y][x] == "L" and seats_occupied(x, y, gold_mode) == 0:
                        cop[y] = cop[y][0:x] + "#" + cop[y][x+1:]
                        seats_changed += 1
                    if not occupy and rows[y][x] == "#" and ((not gold_mode and seats_occupied(x, y, gold_mode) >= 4) or (gold_mode and seats_occupied(x, y, gold_mode) >= 5)):
                        cop[y] = cop[y][0:x] + "L" + cop[y][x+1:]
                        seats_changed += 1
            # print(seats_changed)
            # for y in range(len(rows)):
            #     print(cop[y])
            return (seats_changed, cop)

        # that would have been the moment for a do while loop :D
        # silver
        (result1, rows) = do_round(True, False)
        (result2, rows) = do_round(False, False)
        while result1 > 0 or result2 > 0:
            (result1, rows) = do_round(True, False)
            (result2, rows) = do_round(False, False)
        silver = count_occupied()

        # gold
        rows = list(map(lambda s: s, data.split(";")))
        (result1, rows) = do_round(True, True)
        (result2, rows) = do_round(False, True)
        while result1 > 0 or result2 > 0:
            (result1, rows) = do_round(True, True)
            (result2, rows) = do_round(False, True)
        gold = count_occupied()

        result = { "silver": str(silver), "gold": str(gold) }
    else:
        result = { "silver": "No input", "gold": "No input" }
    
    self.send_response(200)
    self.send_header('Content-Type', 'application/json')
    self.end_headers()
    self.wfile.write(json.dumps(result).encode('utf_8'))
    return





