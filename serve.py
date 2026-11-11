"""Servidor local sin caché: python serve.py  →  http://localhost:5521"""
import http.server, os, sys

class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))
port = int(sys.argv[1]) if len(sys.argv) > 1 else 5521
http.server.ThreadingHTTPServer(("", port), NoCache).serve_forever()
