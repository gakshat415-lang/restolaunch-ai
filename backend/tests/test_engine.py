import pytest
import pandas as pd
import numpy as np
from unittest.mock import patch
from models.schemas import RestaurantRequest
from services.engine import filter_competitors, calculate_opportunity

# Mock data for testing
@pytest.fixture
def mock_dataset():
    data = {
        'Name': ['Restaurant A', 'Restaurant B', 'Restaurant C', 'Restaurant D (New)'],
        'Location': ['Indiranagar', 'Indiranagar', 'Indiranagar', 'Indiranagar'],
        'Format': ['Cafe', 'Cafe', 'Cafe', 'Cafe'],
        'Cuisine': ['Italian', 'Italian', 'Italian', 'Italian'],
        'Price': [800, 900, 700, 850],
        'Rating': [4.5, 4.0, 3.5, 3.5], # D is new, so 3.5
        'Votes': [1000, 500, 0, 0], # C has 0 votes, D has 0 votes
        'dish_liked': ['Pasta', 'Pizza', np.nan, 'Tiramisu'] # C has NaN dish
    }
    return pd.DataFrame(data)

@patch('services.engine.get_data')
def test_filter_competitors(mock_get_data, mock_dataset):
    mock_get_data.return_value = mock_dataset
    req = RestaurantRequest(location='Indiranagar', format='Cafe', budget=800, cuisine='Italian')
    filtered_df = filter_competitors(req)
    
    # 800 * 0.7 = 560, 800 * 1.3 = 1040
    # All prices (800, 900, 700, 850) are within 560-1040
    assert len(filtered_df) == 4

@patch('services.engine.get_data')
def test_zero_vote_exclusion(mock_get_data, mock_dataset):
    mock_get_data.return_value = mock_dataset
    req = RestaurantRequest(location='Indiranagar', format='Cafe', budget=800, cuisine='Italian')
    filtered_df = filter_competitors(req)
    
    res = calculate_opportunity(req, filtered_df)
    
    # average_mds should only consider A and B (since C and D have 0 votes)
    # MDS(A) = (4.5^2) * log10(1001) = 20.25 * 3.0004 = 60.75
    # MDS(B) = (4.0^2) * log10(501) = 16 * 2.6998 = 43.19
    # Avg = (60.75 + 43.19) / 2 = 51.97
    assert res['average_mds'] > 50 and res['average_mds'] < 53
    
    # Total competitor count should be 4 (includes 0 vote ones)
    assert res['competitor_count'] == 4

@patch('services.engine.get_data')
def test_division_by_zero_safeguard(mock_get_data, mock_dataset):
    mock_get_data.return_value = mock_dataset
    # Filter for something that doesn't exist
    req = RestaurantRequest(location='Whitefield', format='Pub', budget=1000, cuisine='Mexican')
    filtered_df = filter_competitors(req)
    assert len(filtered_df) == 0
    
    # Calculate opportunity on empty df
    res = calculate_opportunity(req, filtered_df)
    
    # Competitor count should be 0
    assert res['competitor_count'] == 0
    # Math shouldn't crash, OI should be calculated using global average fallback or 0
    assert isinstance(res['opportunity_index'], float)

@patch('services.engine.get_data')
def test_nan_serialization(mock_get_data, mock_dataset):
    mock_get_data.return_value = mock_dataset
    req = RestaurantRequest(location='Indiranagar', format='Cafe', budget=800, cuisine='Italian')
    filtered_df = filter_competitors(req)
    
    res = calculate_opportunity(req, filtered_df)
    top_competitors = res['top_competitors']
    
    # C should have 'dish_liked' as None instead of np.nan
    for comp in top_competitors:
        if comp['Name'] == 'Restaurant C':
            assert comp['dish_liked'] is None
        # Make sure no np.nan is leaking
        for key, val in comp.items():
            assert not isinstance(val, float) or not np.isnan(val)
