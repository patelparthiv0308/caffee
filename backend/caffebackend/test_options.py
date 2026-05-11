import urllib.request
import urllib.error

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/orders/',
    headers={'Origin': 'http://localhost:5173', 'Access-Control-Request-Method': 'POST'},
    method='OPTIONS'
)

try:
    urllib.request.urlopen(req)
    print("SUCCESS")
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8', errors='ignore'))
