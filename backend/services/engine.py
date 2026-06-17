import pandas as pd
import numpy as np
import math
from services.data_service import get_data
from models.schemas import RestaurantRequest

def filter_competitors(req: RestaurantRequest) -> pd.DataFrame:
    df = get_data()
    
    if df.empty:
        return df
        
    # Use case-insensitive partial string matching
    filtered = df[
        (df['Location'].str.contains(req.location, case=False, na=False)) & 
        (df['Format'].str.contains(req.format, case=False, na=False))
    ]
    
    if filtered.empty:
        return filtered
        
    min_budget = req.budget * 0.7
    max_budget = req.budget * 1.3
    
    filtered = filtered[(filtered['Price'] >= min_budget) & (filtered['Price'] <= max_budget)]
    
    return filtered

def calculate_opportunity(req: RestaurantRequest, filtered_df: pd.DataFrame) -> dict:
    # Step A (MDS): Calculate for all matching restaurants in local subset
    filtered_df = filtered_df.copy()
    if not filtered_df.empty:
        filtered_df['MDS'] = (filtered_df['Rating'] ** 2) * np.log10(filtered_df['Votes'] + 1)
    else:
        filtered_df['MDS'] = pd.Series(dtype=float)

    
    # Step B (Baseline Demand): Isolate target cuisine within the subset
    cuisine_df = filtered_df[filtered_df['Cuisine'].str.contains(req.cuisine, case=False, na=False)]
    
    # Exclude restaurants with 0 votes from the average demand calculation
    valid_cuisine_df = cuisine_df[cuisine_df['Votes'] > 0]
    
    if len(valid_cuisine_df) > 0:
        average_mds = valid_cuisine_df['MDS'].mean()
    else:
        # Fallback: City-wide average for that cuisine
        global_df = get_data()
        global_cuisine = global_df[global_df['Cuisine'].str.contains(req.cuisine, case=False, na=False)].copy()
        global_valid = global_cuisine[global_cuisine['Votes'] > 0].copy()
        
        if len(global_valid) > 0:
            global_valid['MDS'] = (global_valid['Rating'] ** 2) * np.log10(global_valid['Votes'] + 1)
            average_mds = global_valid['MDS'].mean()
        else:
            average_mds = 0.0
            
    # Step C (Supply Saturation): Total physical units (including 0 votes)
    competitor_count = len(cuisine_df)
    
    # Step D (Opportunity Index)
    opportunity_index = average_mds / math.sqrt(competitor_count + 1)
    
    # Sorting: Sort all local competitors descending by MDS, return top 5
    top_5 = filtered_df.sort_values(by='MDS', ascending=False).head(5)
    top_5 = top_5.replace({np.nan: None})
    
    return {
        "opportunity_index": float(opportunity_index),
        "average_mds": float(average_mds),
        "competitor_count": int(competitor_count),
        "top_competitors": top_5.to_dict(orient="records")
    }
