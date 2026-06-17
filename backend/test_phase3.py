import pandas as pd
from models.schemas import RestaurantRequest
from services.engine import filter_competitors
import services.data_service as ds

def test_phase3():
    # 1. Setup mock database
    mock_data = {
        'Name': ['R1', 'R2', 'R3', 'R4', 'R5', 'R6'],
        'Location': ['Indiranagar', 'Indiranagar', 'Indiranagar', 'Indiranagar', 'Indiranagar', 'Residential Village'],
        'Format': ['Cafe', 'Cafe', 'Cafe', 'Cafe', 'Cafe', 'Fine Dining'],
        'Price': [600, 700, 1000, 1300, 1400, 2000],
        'Cuisine': ['Italian', 'Italian', 'Italian', 'Italian', 'Italian', 'French'],
        'Rating': [4.0, 4.0, 4.0, 4.0, 4.0, 4.0],
        'Votes': [100, 100, 100, 100, 100, 100]
    }
    
    # Overwrite the global dataset directly for testing
    ds.global_df = pd.DataFrame(mock_data)
    
    print("Starting Phase 3 Testing...")
    
    try:
        # ---------------------------------------------------------
        # Scenario 1: The Budget Bracket Constraint
        # ---------------------------------------------------------
        req1 = RestaurantRequest(
            location="Indiranagar",
            format="Cafe",
            budget=1000,
            cuisine="Italian"
        )
        
        filtered1 = filter_competitors(req1)
        prices = filtered1['Price'].tolist()
        
        assert prices == [700, 1000, 1300], f"Budget bracket failed. Expected [700, 1000, 1300], got {prices}"
        print("Scenario 1 (Budget Bracket Constraint): PASSED")
        
        # ---------------------------------------------------------
        # Scenario 2: Empty Filter Result
        # ---------------------------------------------------------
        req2 = RestaurantRequest(
            location="Residential Village",
            format="Fine Dining",
            budget=2000,
            cuisine="Italian" # Note: cuisine in db is French, wait format/location is exact match
            # The test says: "Fine Dining format in a purely Residential Village location"
        )
        
        # We need an "impossible combination".
        # Let's request something that DOES NOT exist in DB.
        req_impossible = RestaurantRequest(
            location="Residential Village",
            format="Cafe", # "Cafe" doesn't exist in "Residential Village" in our mock db
            budget=1000,
            cuisine="Italian"
        )
        
        filtered2 = filter_competitors(req_impossible)
        
        assert filtered2.empty, "Empty filter result failed. Expected an empty DataFrame."
        print("Scenario 2 (Empty Filter Result): PASSED")
        
        print("\nPhase 3 Tests: ALL PASSED")
        
    except Exception as e:
        print(f"\nPhase 3 Tests: FAILED\n{e}")

if __name__ == '__main__':
    test_phase3()
