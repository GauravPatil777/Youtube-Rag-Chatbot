import os
import requests
from dotenv import load_dotenv

load_dotenv()

def get_transcript(video_id):
    api_key = os.getenv("SUPADATA_API_KEY")

    url = "https://api.supadata.ai/v1/youtube/transcript"

    headers = {
        "x-api-key": api_key
    }

    params = {
        "videoId": video_id,
        "text": "true"
    }

    response = requests.get(
        url,
        headers=headers,
        params=params,
        timeout=30
    )

    response.raise_for_status()

    data = response.json()

    return data["content"]