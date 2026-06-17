import pandas as pd
import numpy as np
import math
from models.schemas import RestaurantRequest
from services.engine import filter_competitors, calculate_opportunity
import services.data_service as ds

def test_phase4_extended():
    # Setup mock database with extensive scenarios
    mock_data = {
        'Name': [
            # Scenario A: High Quality, Low Supply
            'A1_Italian', 'A2_Other', 
            # Scenario B: Oversaturated
            'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10',
            # Scenario C: 0-Vote existing competitors
            'C1_Zero', 'C2_Zero', 'C3_Zero',
            # Global fallbacks for Cuisines
            'Global_Italian', 'Global_Burger', 'Global_Sushi'
        ],
        'Location': [
            'LocA', 'LocA',
            'LocB', 'LocB', 'LocB', 'LocB', 'LocB', 'LocB', 'LocB', 'LocB', 'LocB', 'LocB',
            'LocC', 'LocC', 'LocC',
            'Global', 'Global', 'Global'
        ],
        'Format': [
            'Dine-in', 'Dine-in',
            'QSR', 'QSR', 'QSR', 'QSR', 'QSR', 'QSR', 'QSR', 'QSR', 'QSR', 'QSR',
            'Cafe', 'Cafe', 'Cafe',
            'Dine-in', 'QSR', 'Cafe'
        ],
        'Price': [
            1000, 1000,
            500, 500, 500, 500, 500, 500, 500, 500, 500, 500,
            300, 300, 300,
            1000, 500, 300
        ],
        'Cuisine': [
            'Italian', 'Mexican',
            'Burger', 'Burger', 'Burger', 'Burger', 'Burger', 'Burger', 'Burger', 'Burger', 'Burger', 'Burger',
            'Sushi', 'Sushi', 'Sushi',
            'Italian', 'Burger', 'Sushi'
        ],
        'Rating': [
            4.8, 3.5,
            3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5, 3.5,
            3.0, 3.0, 3.0,
            4.0, 4.0, 4.0
        ],
        'Votes': [
            1000, 10,
            100, 100, 100, 100, 100, 100, 100, 100, 100, 100,
            0, 0, 0,
            500, 500, 500
        ]
    }
    
    ds.global_df = pd.DataFrame(mock_data)
    
    print("--- Running Extended Phase 4 Tests ---\n")
    
    try:
        # ---------------------------------------------------------
        # Scenario A: High Quality, Low Supply (Market Vacuum)
        # ---------------------------------------------------------
        req_A = RestaurantRequest(location="LocA", format="Dine-in", budget=1000, cuisine="Italian")
        filtered_A = filter_competitors(req_A)
        res_A = calculate_opportunity(req_A, filtered_A)
        
        print("Scenario A: Market Vacuum (High Demand, Low Supply)")
        print(f"- Competitors (C): {res_A['competitor_count']}")
        print(f"- Average MDS: {res_A['average_mds']:.2f}")
        print(f"- Opportunity Index (OI): {res_A['opportunity_index']:.2f}")
        print(f"- Expectation: High OI due to 1 strong competitor.")
        # Rating 4.8, Votes 1000. MDS = 4.8^2 * log10(1001) = 23.04 * ~3.0004 = 69.13
        # OI = 69.13 / sqrt(1 + 1) = 69.13 / 1.414 = 48.88
        print("-" * 50)
        
        # ---------------------------------------------------------
        # Scenario B: High Supply, Average Quality (Oversaturated)
        # ---------------------------------------------------------
        req_B = RestaurantRequest(location="LocB", format="QSR", budget=500, cuisine="Burger")
        filtered_B = filter_competitors(req_B)
        res_B = calculate_opportunity(req_B, filtered_B)
        
        print("Scenario B: Oversaturated Market (Moderate Demand, High Supply)")
        print(f"- Competitors (C): {res_B['competitor_count']}")
        print(f"- Average MDS: {res_B['average_mds']:.2f}")
        print(f"- Opportunity Index (OI): {res_B['opportunity_index']:.2f}")
        print(f"- Expectation: Lower OI due to penalty of sqrt(11) competitors.")
        # Rating 3.5, Votes 100. MDS = 3.5^2 * log10(101) = 12.25 * ~2.0043 = 24.55
        # OI = 24.55 / sqrt(10 + 1) = 24.55 / 3.316 = 7.40
        print("-" * 50)
        
        # ---------------------------------------------------------
        # Scenario C: 0-Vote Competitors (City-Wide Fallback active)
        # ---------------------------------------------------------
        req_C = RestaurantRequest(location="LocC", format="Cafe", budget=300, cuisine="Sushi")
        filtered_C = filter_competitors(req_C)
        res_C = calculate_opportunity(req_C, filtered_C)
        
        print("Scenario C: Ghost Town (3 competitors, 0 valid votes)")
        print(f"- Competitors (C): {res_C['competitor_count']}")
        print(f"- Average MDS (Fallback): {res_C['average_mds']:.2f}")
        print(f"- Opportunity Index (OI): {res_C['opportunity_index']:.2f}")
        print(f"- Expectation: Average MDS uses Global Sushi (4.0, 500 votes -> ~43.18). OI penalized by local competitors sqrt(3+1) = 2. So OI ~ 21.59.")
        print("-" * 50)
        
        print("\nAll extended test cases executed successfully.")
        
    except Exception as e:
        print(f"\nExtended Phase 4 Tests: FAILED\n{e}")

if __name__ == '__main__':
    test_phase4_extended()
