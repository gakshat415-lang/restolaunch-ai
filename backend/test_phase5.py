import os
from unittest import mock
from models.schemas import RestaurantRequest
from services.llm_service import generate_verdict

def test_phase5():
    req = RestaurantRequest(location="LocA", format="Dine-in", budget=1000, cuisine="Italian")
    
    print("Starting Phase 5 LLM Testing...\n")
    
    # ---------------------------------------------------------
    # Scenario 1: API Hallucination (Too much text)
    # ---------------------------------------------------------
    # We mock the Groq client to return 5 sentences instead of 2.
    class MockMessage:
        content = "First sentence. Second sentence! Third sentence? Fourth sentence. Fifth sentence."
        
    class MockChoice:
        message = MockMessage()
        
    class MockCompletion:
        choices = [MockChoice()]

    class MockCompletions:
        def create(self, **kwargs):
            return MockCompletion()
            
    class MockChat:
        completions = MockCompletions()
        
    class MockClient:
        chat = MockChat()

    with mock.patch('services.llm_service.client', MockClient()):
        with mock.patch.dict(os.environ, {"GROQ_API_KEY": "dummy_key"}):
            verdict_1 = generate_verdict(req, 48.88, 1)
            print("Scenario 1 (Truncate long text):")
            print(f"Generated: {verdict_1}")
            assert verdict_1 == "First sentence. Second sentence!", "Truncation failed!"
            print("Status: PASSED\n")

    # ---------------------------------------------------------
    # Scenario 2: Timeout / Exception Resilience
    # ---------------------------------------------------------
    class CrashCompletions:
        def create(self, **kwargs):
            raise Exception("Simulated Timeout Exception")
            
    class CrashChat:
        completions = CrashCompletions()
        
    class CrashClient:
        chat = CrashChat()

    with mock.patch('services.llm_service.client', CrashClient()):
        with mock.patch.dict(os.environ, {"GROQ_API_KEY": "dummy_key"}):
            verdict_2 = generate_verdict(req, 48.88, 1)
            print("Scenario 2 (Timeout Resilience):")
            print(f"Generated: {verdict_2}")
            assert verdict_2 == "Market data processed successfully, but strategic insights are temporarily unavailable.", "Fallback failed!"
            print("Status: PASSED\n")

    print("Phase 5 Tests: ALL PASSED")

if __name__ == '__main__':
    test_phase5()
