with open("train.py", "r") as f:
    content = f.read()

content = content.replace('"avg_session_gap_days", ', '')
content = content.replace('"avg_session_duration", \n', '\n')
content = content.replace('"engagement_score", ', '')

with open("train.py", "w") as f:
    f.write(content)

print("Done")
