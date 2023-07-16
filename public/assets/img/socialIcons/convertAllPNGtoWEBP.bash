for f in *.png; do cwebp -q 80 "$f" -o "$(basename "$f" .png).webp"; done
