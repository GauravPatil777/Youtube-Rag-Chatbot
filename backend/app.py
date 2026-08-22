from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from urllib.parse import urlparse, parse_qs
from fastapi.middleware.cors import CORSMiddleware

from rag import create_rag_chain, ask_question


app = FastAPI()


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Store the currently loaded video's RAG system
current_retriever = None
current_chain = None


def extract_video_id(url: str):

    parsed_url = urlparse(url)

    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        return parse_qs(parsed_url.query).get("v", [None])[0]

    if parsed_url.hostname == "youtu.be":
        return parsed_url.path.strip("/")

    return None


class VideoRequest(BaseModel):
    video_url: str


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def home():

    return {
        "message": "YouTube RAG Chatbot API is running"
    }


@app.post("/process-video")
def process_video(request: VideoRequest):

    global current_retriever, current_chain

    video_id = extract_video_id(request.video_url)

    if not video_id:
        raise HTTPException(
            status_code=400,
            detail="Invalid YouTube URL"
        )

    try:

        current_retriever, current_chain = create_rag_chain(
            video_id
        )

        return {
            "message": "Video processed successfully"
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@app.post("/chat")
def chat(request: ChatRequest):

    if current_retriever is None or current_chain is None:

        raise HTTPException(
            status_code=400,
            detail="Please process a YouTube video first."
        )

    answer = ask_question(
        current_retriever,
        current_chain,
        request.question
    )
    
    return {
        "answer": answer
    }