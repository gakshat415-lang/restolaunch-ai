import os
from PIL import Image

def remove_white_background(image_path):
    print(f"Processing {image_path}...")
    try:
        img = Image.open(image_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Change all white (also shades of whites)
            # to transparent
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(image_path, "PNG")
        print(f"Successfully processed {image_path}")
    except Exception as e:
        print(f"Failed to process {image_path}: {e}")

public_dir = r"c:\test\frontend\public"
for filename in ["3d_coffee.png", "3d_star.png", "3d_pin.png"]:
    file_path = os.path.join(public_dir, filename)
    if os.path.exists(file_path):
        remove_white_background(file_path)
