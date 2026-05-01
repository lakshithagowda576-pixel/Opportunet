import urllib.request
import re

queries = [
    "Karnataka+PGCET+MBA+Preparation",
    "Karnataka+PGCET+MCA+Preparation",
    "Karnataka+PGCET+MTech"
]

for q in queries:
    try:
        url = f"https://www.youtube.com/results?search_query={q}"
        html = urllib.request.urlopen(url).read().decode('utf-8')
        video_ids = list(set(re.findall(r'"videoId":"([^"]{11})"', html)))
        print(f"--- {q} ---")
        for vid in video_ids[:3]:
            print(f"https://www.youtube.com/watch?v={vid}")
    except Exception as e:
        print(e)
