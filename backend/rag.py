from langchain_google_genai import GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_chroma import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
from transcript import get_transcript

load_dotenv()

def create_rag_chain(video_id):
    full_transcript = get_transcript(video_id)
        
    #text splitting
    text_splitter=RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=200)
    transcripted_chunks=text_splitter.split_text(full_transcript)
    # print(f"Total chunks created: {len(transcripted_chunks)}")
    # print(f"First chunk: {transcripted_chunkīs[0]}")
        
   # LLM
    model = ChatGoogleGenerativeAI(
        model="gemini-3.1-flash-lite"
    )
    
    embeddings=GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-2"
    )
    # vector store creation
    vector_store=Chroma.from_texts(
        transcripted_chunks,
        embedding=embeddings,
         collection_name=f"youtube_{video_id}"
)

    retriever=vector_store.as_retriever(
        search_kwargs={"k":3},
        search_type="mmr"
        )
  
    prompt=PromptTemplate(
            input_variables=["context","question"],
            template="You are a helpful assistant. Use the following pieces of context to answer the question at the end in english . If you don't know the answer, just say that you don't know, don't try to make up an answer.\n\n{context}\n\nQuestion: {question}\nHelpful Answer:"
        )

    parser = StrOutputParser()

    chain = prompt | model | parser

    return retriever, chain


def ask_question(retriever, chain, user_question):

    context = retriever.invoke(user_question)

    result = chain.invoke({
        "context": "\n\n".join(
            doc.page_content for doc in context
        ),
        "question": user_question
    })

    return result