from PIL import Image, ImageDraw, ImageFilter

def make_icon(size, path, padding_ratio=0.16):
    img = Image.new("RGB", (size, size), "#1a1a2e")
    draw = ImageDraw.Draw(img)

    # background gradient (top-left to bottom-right, dark navy -> deep blue)
    top = (26, 26, 46)
    bottom = (22, 33, 62)
    for y in range(size):
        t = y / size
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (size, y)], fill=(r, g, b))

    pad = int(size * padding_ratio)
    key_box = [pad, pad, size - pad, size - pad]
    key_size = key_box[2] - key_box[0]
    radius = int(key_size * 0.22)

    # soft glow behind the keycap
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gpad = int(pad * 0.4)
    gdraw.rounded_rectangle(
        [key_box[0] - gpad, key_box[1] - gpad, key_box[2] + gpad, key_box[3] + gpad],
        radius=radius + gpad,
        fill=(150, 150, 255, 110),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(size * 0.05))
    img = Image.alpha_composite(img.convert("RGBA"), glow)
    draw = ImageDraw.Draw(img)

    # keycap bottom shadow edge
    shadow_h = int(key_size * 0.06)
    draw.rounded_rectangle(
        [key_box[0], key_box[1] + shadow_h, key_box[2], key_box[3] + shadow_h],
        radius=radius,
        fill=(23, 23, 35, 255),
    )

    # keycap top face gradient (slate)
    face = Image.new("RGBA", (key_size, key_size), (0, 0, 0, 0))
    fdraw = ImageDraw.Draw(face)
    top_c = (70, 70, 94)
    bottom_c = (44, 44, 64)
    for y in range(key_size):
        t = y / key_size
        r = int(top_c[0] + (bottom_c[0] - top_c[0]) * t)
        g = int(top_c[1] + (bottom_c[1] - top_c[1]) * t)
        b = int(top_c[2] + (bottom_c[2] - top_c[2]) * t)
        fdraw.line([(0, y), (key_size, y)], fill=(r, g, b, 255))
    mask = Image.new("L", (key_size, key_size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, key_size, key_size], radius=radius, fill=255)
    img.paste(face, (key_box[0], key_box[1]), mask)

    # inner highlight dimple
    dim_pad = int(key_size * 0.32)
    dimple = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ddraw = ImageDraw.Draw(dimple)
    ddraw.rounded_rectangle(
        [key_box[0] + dim_pad, key_box[1] + dim_pad, key_box[2] - dim_pad, key_box[3] - dim_pad],
        radius=int(radius * 0.5),
        fill=(255, 255, 255, 15),
    )
    img = Image.alpha_composite(img, dimple)

    img.convert("RGB").save(path, "PNG")

make_icon(180, "apple-touch-icon.png")
make_icon(192, "icon-192.png")
make_icon(512, "icon-512.png")
print("done")
