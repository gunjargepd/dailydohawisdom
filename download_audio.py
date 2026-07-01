import urllib.request
import os

url = "https://upload.wikimedia.org/wikipedia/commons/f/fb/Bansuri_sample_E_bass.ogg"

dest_dir = r"C:\Users\DELL\.gemini\antigravity\scratch\daily-doha-wisdom\assets"
os.makedirs(dest_dir, exist_ok=True)
dest_file = os.path.join(dest_dir, "ambient_flute.ogg")

print(f"Downloading bansuri sample from:\n{url}\nto {dest_file}...")
try:
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response, open(dest_file, 'wb') as out_file:
        data = response.read()
        out_file.write(data)
    print("Download completed successfully!")
except Exception as e:
    print(f"Download failed: {e}")
