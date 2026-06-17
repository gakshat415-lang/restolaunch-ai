import os
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Attempt to initialize client. Will succeed if GROQ_API_KEY is present in env.
try:
    client = Groq()
except Exception:
    client = None

def generate_verdict(req, opportunity_index, competitor_count) -> str:
    default_verdict = "Market data processed successfully, but strategic insights are temporarily unavailable."
    
    # Fast exit if no client or key
    if client is None or not os.getenv("GROQ_API_KEY"):
        return default_verdict

    system_prompt = (
        "You are an elite restaurant business strategist. "
        "Analyze the provided Opportunity Index (OI) and Competitor Count. "
        "An OI above 20 is a strong opportunity, below 10 is oversaturated. "
        "Provide exactly two sentences of strategic business advice. "
        "Do NOT use lists, bullet points, or paragraphs. Just two sentences."
    )
    
    user_prompt = (
        f"Location: {req.location}, Format: {req.format}, "
        f"Cuisine: {req.cuisine}, Budget: {req.budget}. "
        f"Competitors: {competitor_count}, Opportunity Index: {opportunity_index:.2f}."
    )

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.1-8b-instant", 
            timeout=3.0, 
            temperature=0.3,
            max_tokens=150
        )

        
        response_text = chat_completion.choices[0].message.content.strip()
        
        # Enforce two sentences maximum
        # Split by sentence boundaries (.!?) followed by space
        sentences = re.split(r'(?<=[.!?])\s+', response_text)
        
        cleaned_response = " ".join(sentences[:2]).strip()
        
        if not cleaned_response:
            return default_verdict
            
        return cleaned_response

    except Exception as e:
        print(f"LLM Error: {e}")
        # Fallback resilience (handles network timeouts, invalid keys, etc.)
        return default_verdict
