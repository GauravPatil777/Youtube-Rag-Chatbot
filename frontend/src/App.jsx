import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const [processing, setProcessing] = useState(false);
  const [asking, setAsking] = useState(false);

  const [videoProcessed, setVideoProcessed] = useState(false);
  const [error, setError] = useState("");

  const processVideo = async () => {
    if (!videoUrl.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }

    setProcessing(true);
    setError("");
    setVideoProcessed(false);
    setMessages([]);

    try {
      const response = await fetch(
        "https://youtube-rag-chatbot-backend.onrender.com/process-video",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            video_url: videoUrl,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to process video.");
      }

      setVideoProcessed(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setProcessing(false);
    }
  };


  const askQuestion = async () => {
    if (!question.trim()) {
      return;
    }

    if (!videoProcessed) {
      setError("Please process a YouTube video first.");
      return;
    }

    const currentQuestion = question;

    // Show user's question immediately
    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        content: currentQuestion,
      },
    ]);

    setQuestion("");
    setAsking(true);
    setError("");

    try {
      const response = await fetch(
        "https://youtube-rag-chatbot-backend.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: currentQuestion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to get answer.");
      }

      // Add AI response
      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);

    } catch (error) {
      setError(error.message);
    } finally {
      setAsking(false);
    }
  };


  const handleQuestionKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion();
    }
  };


  return (
    <div className="app">

      <header>

        <h1>
          <img
            className="youtube-icon"
            src="https://imgs.search.brave.com/4xe_GsAjgD3PnJusxU-NrabbXazc5rf2cnfbTAl0NA8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNTYv/Nzg3LzQxNy9zbWFs/bC9hLXJlZC1yb3Vu/ZGVkLXJlY3Rhbmds/ZS1mZWF0dXJlcy1h/LXdoaXRlLXBsYXkt/YnV0dG9uLWluLXRo/ZS1jZW50ZXItc3lt/Ym9saXppbmctYS13/ZWxsLWtub3duLXZp/ZGVvLXNoYXJpbmct/cGxhdGZvcm0tY3V0/b3V0cy1wbmcucG5n"
            alt="YouTube"
          />
          YouTube RAG Assistant
        </h1>
        <p style={{color:"black",fontWeight:"bolder",fontSize:"20px"}}>
          Ask questions about any YouTube video
        </p>
      </header>


      {/* Video Section */}

      <section className="video-section">

        <input
          type="text"
          placeholder="Paste YouTube URL..."
          value={videoUrl}
          onChange={(event) => setVideoUrl(event.target.value)}
        />

        <button
          onClick={processVideo}
          disabled={processing}
        >
          {processing ? "Processing..." : "Process Video"}
        </button>

      </section>


      {/* Status */}

      {videoProcessed && (
        <div className="status success">
          ✓ Video processed successfully
        </div>
      )}


      {error && (
        <div className="status error">
          {error}
        </div>
      )}


      {/* Chat */}

      <section className="chat-container">

        <div className="messages">

          {messages.length === 0 && !asking && (
            <div className="empty-chat">
              <h2>💬 Start asking questions</h2>
              <p>
                Process a YouTube video and ask anything about its content.
              </p>
            </div>
          )}


          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role}`}
            >
              <div className="message-label">
                {message.role === "user" ? "You" : "AI"}
              </div>

              <div className="message-content">
                {message.role === "assistant" ? (
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}


          {asking && (
            <div className="message assistant">
              <div className="message-label">
                AI
              </div>

              <div className="message-content">
                Thinking...
              </div>
            </div>
          )}

        </div>


        {/* Question Input */}

        <div className="question-box">

          <input
            type="text"
            placeholder={
              videoProcessed
                ? "Ask a question about the video..."
                : "Process a video first..."
            }
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={handleQuestionKeyDown}
            disabled={!videoProcessed || asking}
          />

          <button
            onClick={askQuestion}
            disabled={!videoProcessed || asking || !question.trim()}
          >
            {asking ? "..." : "Ask"}
          </button>

        </div>

      </section>

    </div>
  );
}

export default App;