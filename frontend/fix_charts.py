import re

with open("src/App.jsx", "r") as f:
    content = f.read()

# Fix ImbalanceBarChart and StreakBarChart
content = re.sub(
    r"const maxVal = 0\.15; // 15% max pour l'échelle",
    r"const maxVal = 0.80; // 80% max pour l'échelle",
    content
)
content = re.sub(
    r"\{\[0, 0\.05, 0\.10, 0\.15\]\.map\(\(val, idx\) => \{",
    r"{[0, 0.20, 0.40, 0.60, 0.80].map((val, idx) => {",
    content
)

# Fix SessionGamesBarChart
content = re.sub(
    r"const maxVal = 0\.20; // 20% max pour l'échelle",
    r"const maxVal = 0.80; // 80% max pour l'échelle",
    content
)
content = re.sub(
    r"\{\[0, 0\.05, 0\.10, 0\.15, 0\.20\]\.map\(\(val, idx\) => \{",
    r"{[0, 0.20, 0.40, 0.60, 0.80].map((val, idx) => {",
    content
)

with open("src/App.jsx", "w") as f:
    f.write(content)

print("Done")
