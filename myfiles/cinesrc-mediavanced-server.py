import re
import json
import requests
import base64
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urljoin
from django.http import JsonResponse
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from datetime import datetime, timezone
from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.Random import get_random_bytes
import cloudscraper

default_domain = "https://cinesrc.st"
user_agent = "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
rsa_public_key = """-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCFplzWaLwhwOrmKuhe6Vghq4RU
NBjis9AUEl9Vw6r3CHz8aQGncnNgQ0t1oChO7I7EVs2oKcOrBNfhg+8aP4gURUoU
Xuk9M8M7OdeVvB2rTxiYIX+mvoslyTuAVRTWTvL5qQu9tZ84PfBCd6vFxku20TmF
MYYm2zpuXzCI4mmBewIDAQAB
-----END PUBLIC KEY-----"""
aes_key_b64 = "JWmlRlgGKC3MLQihZMqx/hW276z1FolQ8QRePYWhn/E="
server = 'nebula'
headers = {
    'Referer': default_domain,
    'User-Agent': user_agent
}
response_data = {
    'status': None,
    'status_code': None,
    'error': None,
    'headers': {},
    'streaming_urls': {},
    'downloading_urls': {}
}

# Quality mapping
quality_map = {
    "mobile": "144p",
    "lowest": "240p",
    "low": "360p",
    "sd": "480p",
    "hd": "720p",
    "full": "1080p"
}

stream_quality_map = {
    "mobile": "144p",
    "lowest": "240p",
    "low": "360p",
    "medium": "480p",
    "high": "720p",
    "fullhd": "1080p"
}


def real_extract(url):
    scraper = cloudscraper.create_scraper()
    server_action_token = requests.get('https://script.google.com/macros/s/AKfycbz0Nk6EXmwLr-QxTan0EZ1AUKTFG4bxb-9p0BYURnUmyMbQuI-ZF3ybwa8cGg8UXn4w/exec').json().get('key')
    # Fetch page content
    match = re.search(r'\/embed\/(.*?)\/(\d+)(?:\?s=(\d+)&e=(\d+))?', url)
    if match:
        content_type = match.group(1)
        content_type = "show" if content_type == "tv" else content_type
        content_id, season, episode = (
            match.group(2),
            match.group(3) or '$undefined',
            match.group(4) or '$undefined'
        )

    # Get token from server
    response = scraper.get(f'{default_domain}/api/signature', headers=headers).json()
    token = response.get('token')

    # Prepare encryption parameters
    timestamp = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    path = urlparse(url).path
    nonce = get_random_bytes(16)
    salt = get_random_bytes(16)
    iv = get_random_bytes(12)
    aes_key = get_random_bytes(32)

    # Generate fingerprint
    fingerprint = {
        'tz': "Asia/Calcutta",
        'lang': "en-GB",
        'langs': "en-GB,en-US,en",
        'pf': "Linux armv81",
        'cm': True,
        'dpr': 2,
        'sw': 360,
        'sh': 806,
        'cd': 24,
        'cvs': "6398717e3beb0e320556d5fb2077d04aaae6041ca9f2e8e6a2e912a156849ee1",
        'wgl': "ANGLE (ARM, Mali-G57 MC2, OpenGL ES 3.2)|Google Inc. (ARM)",
        'jit': "0.5999999046325684,0.9000000953674316,0.9000000953674316,0.5999999046325684,0.2999997138977051"
    }

    # Prepare payload
    payload = {
        '_r': 1.1,
        '_k': timestamp,
        '_m': user_agent,
        '_n1l': "i3Dguw==",
        '_x': base64.b64encode(nonce).decode(),
        '_q': base64.b64encode(nonce).decode(),
        '_j': token,
        '_n25': "mtD6yA==",
        '_w': path,
        '_f': fingerprint
    }
    payload_array = [item for k, v in payload.items() for item in (k, v)]
    plaintext = json.dumps(payload_array).encode()

    # XOR the Payload
    xored = bytearray(len(plaintext))
    for i in range(len(plaintext)):
        xored[i] = plaintext[i] ^ aes_key[i % len(aes_key)]

    # Encrypt Payload using AES-256-GCM
    cipher = AES.new(aes_key, AES.MODE_GCM, nonce=iv)
    encrypted, tag = cipher.encrypt_and_digest(xored)
    aes_ciphertext = encrypted + tag

    # Encrypt AES Key with RSA‑OAEP SHA256
    rsa_key = RSA.import_key(rsa_public_key)
    rsa_cipher = PKCS1_OAEP.new(rsa_key, hashAlgo=SHA256)
    rsa_encrypted_key = rsa_cipher.encrypt(aes_key)

    # Build final encrypted request blob
    encrypted_key_b64 = base64.b64encode(rsa_encrypted_key).decode()
    iv_b64 = base64.b64encode(iv).decode()
    ciphertext_b64 = base64.b64encode(aes_ciphertext).decode()

    # Prepare Encrypted Blob
    encrypted_blob = '~'.join(['v1.1', encrypted_key_b64, iv_b64, ciphertext_b64])

    # Prepare Payload and Get Encrypted Streaming Data
    request_payload = [content_id, content_type, season, episode, encrypted_blob, server]
    response = scraper.post(url, data=json.dumps(request_payload), headers={**headers, 'Accept': 'text/x-component', 'next-action': server_action_token, 'Content-Type': 'text/plain;charset=UTF-8'}).text
    print(response)
    # Extract encrypted payload line
    encrypted_line = response.splitlines()[1]
    encrypted_payload = encrypted_line[2:].strip('"')

    # Parse payload components
    payload_parts = encrypted_payload.split(".")
    version_tag = payload_parts[0]
    iv_b64 = payload_parts[1]
    ciphertext_b64 = payload_parts[2]

    # Decode base64 values
    iv_bytes = base64.b64decode(iv_b64)
    ciphertext_with_tag = base64.b64decode(ciphertext_b64)
    aes_key_bytes = base64.b64decode(aes_key_b64)

    # Separate ciphertext and auth tag
    ciphertext_bytes = ciphertext_with_tag[:-16]
    auth_tag = ciphertext_with_tag[-16:]

    # AES‑256‑GCM decryption
    cipher = AES.new(aes_key_bytes, AES.MODE_GCM, nonce=iv_bytes)
    plaintext_bytes = cipher.decrypt_and_verify(ciphertext_bytes, auth_tag)
    plaintext = plaintext_bytes.decode("utf-8")

    # Extract video URL
    streaming_data = json.loads(plaintext).get('url')
    video_url = streaming_data[0].get('url')
    
    # Get streaming url
    mapped_urls = {
        'auto': video_url
    }
    response_data.update({
        'status': 'success',
        'status_code': 200,
        'headers': headers,
        'streaming_urls': mapped_urls,
        'downloading_urls': mapped_urls
    })
    
    return response_data
