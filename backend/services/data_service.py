import pandas as pd
import numpy as np

# Global DataFrame to hold the restaurant data
global_df = None

def clean_data(raw_df: pd.DataFrame) -> pd.DataFrame:
    cleaned = raw_df.copy()
    
    # Strip commas and symbols from Price and cast to int
    if 'Price' in cleaned.columns:
        # Replace non-digit characters with empty string, convert to numeric, fill NaN with 0, cast to int
        cleaned['Price'] = pd.to_numeric(cleaned['Price'].astype(str).str.replace(r'\D+', '', regex=True), errors='coerce').fillna(0).astype(int)

        
    # Extract floats from Rating and handle "NEW" / "-"
    if 'Rating' in cleaned.columns:
        def parse_rating(val):
            val_str = str(val).strip().upper()
            if val_str in ('NEW', '-', 'NAN', '') or pd.isna(val):
                return 3.5
            try:
                return float(val_str.split('/')[0])
            except ValueError:
                return 3.5
        cleaned['Rating'] = cleaned['Rating'].apply(parse_rating)
        
    # Cast Votes to integers, assigning 0 where missing
    if 'Votes' in cleaned.columns:
        cleaned['Votes'] = pd.to_numeric(cleaned['Votes'], errors='coerce').fillna(0).astype(int)
        
    # Deduplicate by Name and Location, keeping the entry with the highest Votes
    if all(col in cleaned.columns for col in ['Name', 'Location', 'Votes']):
        cleaned = cleaned.sort_values('Votes', ascending=False).drop_duplicates(subset=['Name', 'Location'], keep='first')
        
    return cleaned

import urllib.request
import os

def load_data(filepath: str = "dataset.csv"):
    global global_df
    
    # Hugging Face Direct Download URL
    hf_url = os.getenv("HF_DATASET_URL", "https://huggingface.co/datasets/ManikaSaini/zomato-restaurant-recommendation/resolve/main/zomato.csv")
    
    if not os.path.exists(filepath):
        print(f"Dataset not found locally. Downloading from Hugging Face: {hf_url}")
        print("This is a ~500MB file, please wait. It will only be downloaded once...")
        try:
            urllib.request.urlretrieve(hf_url, filepath)
            print("Download complete!")
        except Exception as e:
            print(f"Failed to download dataset: {e}")
            global_df = pd.DataFrame(columns=['Name', 'Location', 'Format', 'Price', 'Cuisine', 'Rating', 'Votes'])
            return

    try:
        raw_df = pd.read_csv(filepath)
        
        # Check if the CSV has the expected zomato columns and rename/map them if necessary
        # The zomato dataset typically has columns like: name, location, rest_type, approx_cost(for two people), cuisines, rate, votes
        # We need to standardize them to our expected columns: Name, Location, Format, Price, Cuisine, Rating, Votes
        rename_map = {
            'name': 'Name',
            'location': 'Location',
            'rest_type': 'Format',
            'approx_cost(for two people)': 'Price',
            'cuisines': 'Cuisine',
            'rate': 'Rating',
            'votes': 'Votes'
        }
        raw_df.rename(columns=rename_map, inplace=True)
        
        global_df = clean_data(raw_df)
        print(f"Data successfully loaded and cleaned. Rows: {len(global_df)}")
    except Exception as e:
        print(f"Error loading dataset: {e}")
        global_df = pd.DataFrame(columns=['Name', 'Location', 'Format', 'Price', 'Cuisine', 'Rating', 'Votes'])

def get_data() -> pd.DataFrame:
    global global_df
    if global_df is None:
        raise ValueError("Dataset not loaded. Please ensure load_data() was called on startup.")
    return global_df
