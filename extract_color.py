from PIL import Image
from collections import Counter

def get_dominant_color(image_path):
    try:
        img = Image.open(image_path)
        img = img.convert("RGB")
        img = img.resize((50, 50)) # Resize for speed
        pixels = list(img.getdata())
        
        # Filter out white/near-white and black/near-black background pixels
        filtered_pixels = [
            p for p in pixels 
            if not (p[0] > 240 and p[1] > 240 and p[2] > 240) # White
            and not (p[0] < 20 and p[1] < 20 and p[2] < 20)   # Black
        ]
        
        if not filtered_pixels:
            return "No color found"

        counts = Counter(filtered_pixels)
        most_common = counts.most_common(1)[0][0]
        return "#{:02x}{:02x}{:02x}".format(most_common[0], most_common[1], most_common[2])

    except Exception as e:
        return str(e)

print(get_dominant_color(r"C:\Users\rossg\.gemini\antigravity\brain\d8716bf7-2ce6-445f-8b8b-6354c59f0a14\uploaded_image_1764028272174.png"))
