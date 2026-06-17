import pandas as pd
import numpy as np
from services.data_service import clean_data

def test_data_cleaning():
    # Mock dataset with edge-case strings
    data = {
        'Name': ['Resto A', 'Resto B', 'Resto C', 'Resto D', 'Resto E'],
        'Location': ['Loc 1', 'Loc 2', 'Loc 3', 'Loc 4', 'Loc 5'],
        'Format': ['F1', 'F2', 'F3', 'F4', 'F5'],
        'Cuisine': ['C1', 'C2', 'C3', 'C4', 'C5'],
        'Price': ['1,200', '₹1,200', '800', '1,500', '900'],
        'Rating': ['4.2/5', 'NEW', '-', '3.8/5', np.nan],
        'Votes': ['120', 'N/A', '', '45', np.nan]
    }
    raw_df = pd.DataFrame(data)
    
    print("Starting Cleaning Pipeline...")
    
    try:
        cleaned_df = clean_data(raw_df)

        
        # Verify Price
        prices = cleaned_df['Price'].tolist()
        assert prices == [1200, 1200, 800, 1500, 900], f"Price cleaning failed: {prices}"
        assert pd.api.types.is_integer_dtype(cleaned_df['Price']), "Price column is not integer"
        
        # Verify Rating
        ratings = cleaned_df['Rating'].tolist()
        assert ratings == [4.2, 3.5, 3.5, 3.8, 3.5], f"Rating cleaning failed: {ratings}"
        assert pd.api.types.is_float_dtype(cleaned_df['Rating']), "Rating column is not float"
        
        # Verify Votes
        votes = cleaned_df['Votes'].tolist()
        assert votes == [120, 0, 0, 45, 0], f"Votes cleaning failed: {votes}"
        assert pd.api.types.is_integer_dtype(cleaned_df['Votes']), "Votes column is not integer"
        
        print("\nPhase 2 Data Cleaning Test: PASSED")
        
    except Exception as e:
        print(f"\nPhase 2 Data Cleaning Test: FAILED\n{e}")

if __name__ == '__main__':
    test_data_cleaning()
