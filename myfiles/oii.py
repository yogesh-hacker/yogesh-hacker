import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

'''
Supports:
https://oii.la/
'''

class Colors:
    header = '\033[95m'
    okblue = '\033[94m'
    okcyan = '\033[96m'
    okgreen = '\033[92m'
    warning = '\033[93m'
    fail = '\033[91m'
    endc = '\033[0m'
    bold = '\033[1m'
    underline = '\033[4m'

# Constants
base_url = "https://oii.la/XkjSP"
user_agent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
parsed_url = urlparse(base_url)
default_domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
headers = {
    "Origin": default_domain,
    "Referer": default_domain,
    "User-Agent": user_agent
}

# Set up session
session = requests.Session()

# Get first page
response = session.get(base_url, headers=headers).text
soup = BeautifulSoup(response, "html.parser")
print('[*] First page loaded...')

# Load first page Payload
payload = {}
for hidden in soup.find_all("input", {"type": "hidden"}):
    name = hidden.get("name")
    value = hidden.get("value", "")
    if name:
        payload[name] = value

# Post to get form data token
response = session.post(base_url, headers=headers, data=payload).text
print('[*] Second page ready...')
match = re.search(r'name="ad_form_data"\s+value="([^"]+)"', response)
if not match:
    exit(f'{Colors.fail}Unable to locate AD Form Data.{Colors.endc}')
ad_form_data = match.group(1)

# Prepare payload and headers
headers = {
    "Origin": default_domain,
    "Referer": base_url,
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "User-Agent": user_agent,
    "X-Requested-With": "XMLHttpRequest"
}
payload = {
    '_method': 'POST',
    'ad_form_data': ad_form_data
}

# Post to final URL to get shortned link
print('[*] Waiting 15s to get URL...')
time.sleep(15)
response = session.post(f'{default_domain}/links/go', headers=headers, data=payload).json()

# Extract shortned URL
shortned_url = response.get('url')

# Print results
print("\n" + "#" * 25 + "\n" + "#" * 25)
print(f"Captured URL: {Colors.okgreen}{shortned_url}{Colors.endc}")
print("#" * 25 + "\n" + "#" * 25)
print("\n")