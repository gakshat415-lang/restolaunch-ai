# RestoLaunch AI - Evaluation & Testing Strategy

This document outlines the evaluation criteria, specific test scenarios, and pass/fail thresholds for each implementation phase defined in the `testimplementation-plan.md`.

## Phase 1: Project Initialization & Infrastructure

### Scenario: Core Environment Health Check
*   **Test:** Run the FastAPI dev server (`uvicorn`) and the React dev server (`vite`). Hit the backend `/health` endpoint and load the React `localhost:5173` page.
*   **Expected Behavior:** Backend returns a `{"status": "ok"}` JSON response. Frontend loads the default Vite React application without browser console errors.
*   **Pass/Fail Criteria:** 
    *   **Pass:** Both servers start without dependency errors, port conflicts, or missing environment variables.
    *   **Fail:** Application crashes on boot due to missing modules, `python-dotenv` failures, or Vite configuration errors.

## Phase 2: Data Ingestion & Memory Caching

### Scenario: Data Cleaning Integrity
*   **Test:** Feed a mock dataset with edge-case strings to the Data Cleaning Pipeline during startup. Mock rows include: Price `"₹1,200"`, Rating `"NEW"`, Rating `"-"`, Votes `"N/A"`, and an empty Votes string.
*   **Expected Behavior:** 
    *   Price `"₹1,200"` becomes integer `1200`.
    *   Ratings `"NEW"` and `"-"` become float `3.5`.
    *   Null/missing Votes become integer `0`.
*   **Pass/Fail Criteria:** 
    *   **Pass:** The final Pandas DataFrame has strict column types (`int`, `float`, `int`) and absolutely no `NaN` values in the operational columns.
    *   **Fail:** Type casting throws a `ValueError` stopping the server, or `NaN` values leak into the active DataFrame.

## Phase 3: The Filtering Funnel

### Scenario: The Budget Bracket Constraint
*   **Test:** Send a `RestaurantRequest` for `budget=1000`. Test against a mock database with competitors priced at 600, 700, 1000, 1300, and 1400.
*   **Expected Behavior:** The filter calculates the range `[700, 1300]`. It includes the 700, 1000, and 1300 restaurants. It strictly excludes 600 and 1400.
*   **Pass/Fail Criteria:** 
    *   **Pass:** The exact boundary conditions (inclusive) are calculated and filtered correctly.
    *   **Fail:** Restaurants outside the 30% margin are returned, or the slice boundary behaves exclusively (`> 700` instead of `>= 700`).

### Scenario: Empty Filter Result
*   **Test:** Send a query for an impossible combination (e.g., "Fine Dining" format in a purely "Residential Village" location).
*   **Expected Behavior:** The filter returns an empty subset.
*   **Pass/Fail Criteria:** 
    *   **Pass:** The system handles the empty DataFrame gracefully, bypassing the math engine, and returns an empty list/state to the frontend.
    *   **Fail:** Pandas throws an `IndexError` or the API returns a 500 error.

## Phase 4: The Core Scoring Engine (Math Layer)

### Scenario: Division-by-Zero Safeties (Step B & Step D)
*   **Test 1 (Step B):** Run calculations on a neighborhood where *all* matching cuisine competitors have `0` votes (triggering exclusion).
*   **Test 2 (Step D):** Run calculations on a neighborhood with `0` existing competitors ($C=0$).
*   **Expected Behavior:** 
    *   **Test 1:** Step B calculates 0 valid local competitors and correctly triggers the city-wide fallback Average MDS.
    *   **Test 2:** Step D calculates `Opportunity Index = Average MDS / sqrt(0 + 1)`. The denominator `sqrt(1)` evaluates to `1`, leaving the OI intact.
*   **Pass/Fail Criteria:** 
    *   **Pass:** No `ZeroDivisionError` is raised and numeric outputs are structurally valid floats.
    *   **Fail:** The app crashes, throws a math exception, or returns `NaN` / `Infinity` to the frontend.

### Scenario: MDS Calculation Accuracy
*   **Test:** Feed a mock competitor with Rating `4.0` and Votes `99`.
*   **Expected Behavior:** $MDS = (4.0^2) \times \log_{10}(99 + 1) = 16.0 \times 2.0 = 32.0$.
*   **Pass/Fail Criteria:** 
    *   **Pass:** The Python output strictly matches the manual mathematical equation to at least 4 decimal places.
    *   **Fail:** Incorrect order of operations alters the final score.

## Phase 5: Groq LLM Integration (The Verdict)

### Scenario: API Hallucination & Timeout Resilience
*   **Test 1:** Force a mock network timeout (e.g., > 3 seconds) for the Groq API call.
*   **Test 2:** Mock an LLM response containing invalid markdown lists or 5 paragraphs of text instead of two sentences.
*   **Expected Behavior:** 
    *   **Test 1:** The backend catches the timeout exception and returns a hardcoded safe default sentence (e.g., "Market data processed successfully, but strategic insights are temporarily unavailable.").
    *   **Test 2:** The backend cleanly truncates or regex-extracts only the required text, discarding the excess.
*   **Pass/Fail Criteria:** 
    *   **Pass:** The main API request completes and returns the numeric payload despite LLM failures.
    *   **Fail:** The entire API endpoint fails with a 500 status code purely because the third-party LLM failed.

## Phase 6: Frontend Development & API Binding

### Scenario: End-to-End User Flow
*   **Test:** Fill the React input form with valid test data and click submit.
*   **Expected Behavior:** The form disables the submit button and displays a loading spinner. The backend processes the JSON, calculates the index, calls Groq, and returns the payload. The frontend then drops the loading state and renders the Verdict Card and Top 5 table.
*   **Pass/Fail Criteria:** 
    *   **Pass:** The UI maps the API JSON accurately without `undefined` variable errors, handling asynchronous state perfectly.
    *   **Fail:** The form allows double-submission, lacks a loading indicator, or missing data in the Top 5 table breaks the React component tree (White Screen of Death).

## Phase 7: Testing & Final Review

### Scenario: Production Build Readiness
*   **Test:** Run the React production build (`npm run build`). Start the FastAPI server using the production WSGI server configuration (`uvicorn --workers 4`). Hit the live endpoints with a load-testing script (e.g., 50 concurrent requests).
*   **Expected Behavior:** React serves optimized, minified static files. FastAPI handles concurrent mock requests without memory leaking the cached 51k dataset.
*   **Pass/Fail Criteria:** 
    *   **Pass:** The production build completes without TypeScript or Linting errors, and the API maintains sub-second response times under load.
    *   **Fail:** The API drops requests or the global DataFrame state becomes corrupted under concurrent access.
