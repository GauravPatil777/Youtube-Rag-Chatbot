# 🎥 YouTube RAG Chatbot

An AI-powered YouTube RAG (Retrieval-Augmented Generation) chatbot that allows users to process a YouTube video and ask questions based on its content.

Instead of sending the entire video content to an LLM, the application retrieves the most relevant parts of the video's transcript and uses them to generate context-aware answers.

## 🚀 Live Demo

🔗 Coming soon

## 📌 Features

- 🎥 Process YouTube videos using their URLs
- 📝 Extract YouTube video transcripts
- ✂️ Split transcripts into smaller chunks
- 🔢 Generate embeddings for transcript chunks
- 🗄️ Store and retrieve embeddings using ChromaDB
- 🔍 Retrieve relevant context for user questions
- 🤖 Generate answers using Google Gemini
- 💬 Interactive chat interface
- ⚡ FastAPI backend
- ⚛️ React + Vite frontend
- 🔄 End-to-end RAG pipeline

## 🧠 How It Works

The application follows a Retrieval-Augmented Generation pipeline:

```text
                YouTube URL
                     │
                     ▼
          YouTube Transcript
                     │
                     ▼
             Text Splitting
                     │
                     ▼
              Embeddings
                     │
                     ▼
               ChromaDB
                     │
                     │
              User Question
                     │
                     ▼
             Similarity Search
                     │
                     ▼
           Relevant Context
                     │
                     ▼
             Google Gemini
                     │
                     ▼
                Answer