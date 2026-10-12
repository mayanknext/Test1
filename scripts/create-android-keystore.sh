#!/usr/bin/env bash
# One-time: creates the Android upload key and prints the four GitHub secrets the Android workflow needs.
# Keep the generated .jks file and passwords somewhere safe (a password manager): if you lose them
# you can't ship updates without going through Google Play's key-reset process.
set -euo pipefail

OUT="${1:-storyflow-upload.jks}"
ALIAS="storyflow"

if [ -e "$OUT" ]; then
  echo "$OUT already exists; refusing to overwrite it." >&2
  exit 1
fi

PASSWORD="$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 24)"

keytool -genkeypair -v \
  -keystore "$OUT" -alias "$ALIAS" \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -storepass "$PASSWORD" -keypass "$PASSWORD" \
  -dname "CN=StoryFlow AI, O=StoryFlow AI, C=IN" >/dev/null

echo
echo "Created $OUT. Add these as repository secrets (GitHub → Settings → Secrets and variables → Actions):"
echo
echo "ANDROID_KEYSTORE_BASE64 = (contents of ${OUT}.base64.txt)"
echo "ANDROID_KEYSTORE_PASSWORD = $PASSWORD"
echo "ANDROID_KEY_ALIAS = $ALIAS"
echo "ANDROID_KEY_PASSWORD = $PASSWORD"
base64 < "$OUT" | tr -d '\n' > "${OUT}.base64.txt"
echo
echo "Then delete ${OUT}.base64.txt and store $OUT + the password in your password manager."
