import zipfile
import os

zip_path = r'C:\Users\User\Desktop\C.8.L. MUSIC AI\remix_-corazones-locos-agency (1).zip'
extract_path = r'C:\Users\User\Desktop\C.8.L. MUSIC AI\extracted'

if not os.path.exists(extract_path):
    os.makedirs(extract_path)

with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_path)

print(f"Extracted to {extract_path}")
