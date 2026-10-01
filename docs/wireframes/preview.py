"""Turns ./source/*.dc.html into plain HTML files in ./preview that open in any browser."""
import glob, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
for path in sorted(glob.glob(os.path.join(HERE, "source", "*.dc.html"))):
    if os.path.basename(path).startswith("PD"):
        continue  # Paper Design mockups need the canvas runtime
    html = open(path).read()
    html = html.replace('<script src="./support.js"></script>\n', "")
    html = re.sub(r'<script type="text/x-dc".*?</script>\n', "", html, flags=re.S)
    html = html.replace("<x-dc>\n", "").replace("</x-dc>\n", "")
    html = html.replace("<helmet>\n", "").replace("</helmet>\n", "")
    html = re.sub(r'href="([A-Za-z0-9_-]+)\.dc\.html', r'href="\1.html', html)
    name = os.path.basename(path).replace(".dc.html", ".html")
    with open(os.path.join(HERE, "preview", name), "w") as fh:
        fh.write(html)
print("ok")
