import os
from dotenv import load_dotenv

# Load env variables before importing llm_service
load_dotenv()

from models.schemas import RestaurantRequest
from services.llm_service import generate_verdict

def test_groq():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_api_key_goes_here":
        print("Test FAILED: GROQ_API_KEY is not set correctly in .env")
        return
        
    print(f"Key detected: {api_key[:4]}...{api_key[-4:] if len(api_key) > 8 else ''}")
    print("Testing connection to Groq API...\n")
    
    try:
        req = RestaurantRequest(location="Indiranagar", format="Cafe", budget=1000, cuisine="Italian")
        # Let's pass a very high opportunity index to test genuine response
        verdict = generate_verdict(req, opportunity_index=45.5, competitor_count=1)
        
        print("Received Response:")
        print(verdict)
        print("\nTest PASSED!")
        
    except Exception as e:
        print(f"Test FAILED with exception: {e}")

if __name__ == '__main__':
    test_groq()
