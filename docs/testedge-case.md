# Edge Cases & Corner Scenarios: RestoLaunch AI

This document outlines the critical edge cases and corner scenarios that the RestoLaunch AI system must handle gracefully to ensure stability and accuracy.

## 1. Data Ingestion & Cleaning
*   **Malformed Prices:** The `Price` column contains currency symbols (e.g., "₹1,200"), text (e.g., "Price on Request"), decimals ("1200.50"), or null values. The parser must gracefully default or clean these without crashing.
*   **Irregular Ratings:** Non-numeric ratings beyond just "NEW" or "-" (e.g., "N/A", empty strings, or invalid values like `6.0/5`).
*   **Vote Value Anomalies:** Votes formatted as strings with suffixes (e.g., "1.5k", "10k+") instead of raw integers, or negative vote counts due to upstream database errors.

## 2. Filtering Funnel
*   **Typographical & Case Mismatches:** Slight spelling variations or case differences in user input vs. database strings (e.g., "Indira Nagar" vs "Indiranagar", "Café" vs "Cafe"). 
*   **Extreme Budget Brackets:** An extremely low or high proposed budget where the +/- 30% bracket yields exactly 0 total competitors in the vicinity, leaving nothing to analyze.
*   **Empty Initial Filter:** A hyper-niche combination of Location and Format (e.g., a "Fine Dining" format in a purely residential neighborhood) that returns an empty subset before cuisine filtering even begins.

## 3. Mathematical & Scoring Engine
*   **The "All-New" Neighborhood (Zero Valid Votes):** A scenario where all matching competitors for a cuisine have exactly 0 votes. Step B excludes 0-vote entries, meaning the valid competitor count for Average MDS calculation is 0. This must seamlessly trigger the city-wide fallback.
*   **The City-Wide Vacuum:** If the fallback is triggered but there are NO valid restaurants serving that target cuisine *anywhere* in the city (city-wide total is also 0), the system must avoid a division-by-zero error and output a safe default (like an Opportunity Index of 0 or a "Market Untested" flag).
*   **Monopoly Skew:** A single dominant competitor has an exceptionally massive vote count (e.g., 100,000 votes) which, even with logarithmic smoothing, significantly skews the Average MDS for that cuisine in a small neighborhood.
*   **Perfect Vacuum (Zero Competitors):** When $C = 0$ (no physical competitors in the area for the given cuisine), ensuring the denominator `sqrt(0 + 1)` correctly evaluates to 1, preserving the city-wide baseline demand without math errors.

## 4. LLM Integration & External Services
*   **Groq API Timeouts/Failures:** The Groq API is unreachable, times out, or returns a 5xx error. The application must catch the exception, bypass the verdict generation, and render the mathematical results and Top 5 table using a default generic message.
*   **LLM Hallucinations & Formatting:** The LLM ignores the prompt constraints and returns a 4-paragraph essay, markdown lists, or JSON instead of exactly two concise sentences. The UI must be able to truncate or safely handle unexpected text volume.

## 5. User Input Validation
*   **Missing or Invalid Inputs:** The API receives a request with a missing required parameter, an empty string, or a budget of `0` or negative numbers. The system should return an HTTP 422/400 response before any calculations begin.
