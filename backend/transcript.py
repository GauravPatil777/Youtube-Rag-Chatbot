
from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    # video transcript fetching
    api=YouTubeTranscriptApi()
    available_transcripts = api.list(video_id)

    selected_transcript = None

    for transcript in available_transcripts:
        if selected_transcript is None:
            selected_transcript = transcript

    transcript=api.fetch(video_id,languages=[selected_transcript.language_code])
    full_transcript=" ".join(chunk.text for chunk in transcript)
    return full_transcript