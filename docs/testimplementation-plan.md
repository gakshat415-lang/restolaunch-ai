# RestoLaunch AI - Implementation Plan

This document outlines the phased implementation strategy for building the RestoLaunch AI platform, referencing the logic from `testcontext.md` and the system design from `testarchitecture.md`.

---

## Phase 1: Project Initialization & Infrastructure
**Goal:** Set up the foundational environment for both the frontend client and the backend server.

*   **Backend Setup (Python/FastAPI):**
    *   Initialize a Python virtual environment.
    *   Install core dependencies: `fastapi`, `uvicorn`, `pandas`, `pydantic`, `python-dotenv`, `groq`.
    *   Set up the basic FastAPI application structure (`main.py`, `routers/`, `services/`, `models/`).
*   **Frontend Setup (React/Vite):**
    *   Initialize a Vite React (TypeScript) project.
    *   Install Tailwind CSS and configure the theme variables.
    *   Set up routing (if needed) and Axios/Fetch for API communication.
*   **Version Control:** Initialize the Git repository and define `.gitignore` for both environments.

## Phase 2: Data Ingestion & Memory Caching
**Goal:** Successfully load and clean the 51,000+ restaurant dataset so the math engine can run instantly.

*   **Data Loading:** Create a Python service that loads the raw dataset (e.g., CSV or Parquet) into a global Pandas DataFrame upon FastAPI startup (`@app.on_event("startup")`).
*   **Data Cleaning Pipeline:**
    *   Write functions to strip commas from the `Price` column and cast to `int`.
    *   Write functions to extract floats from the `Rating` column (e.g., converting `"4.2/5"` to `4.2`).
    *   Implement logic to assign a `3.5` default score to `"NEW"` or `"-"` ratings.
    *   Cast the `Votes` column to integers, assigning `0` where missing.

## Phase 3: The Filtering Funnel
**Goal:** Build the endpoint that takes user input and narrows the 51k records down to the hyper-local 200-400 competitors.

*   **API Model:** Create a Pydantic model (`RestaurantRequest`) to enforce the four inputs: `location` (str), `format` (str), `budget` (int), `cuisine` (str).
*   **Filtering Logic:**
    *   Apply exact match filters for `Location` and `Format` using Pandas slicing.
    *   **Budget Bracket Logic:** Calculate `min_budget = budget * 0.7` and `max_budget = budget * 1.3`. Filter the dataset to keep only restaurants falling within this range.

## Phase 4: The Core Scoring Engine (Math Layer)
**Goal:** Translate the 4-step mathematical loop into robust Python code.

*   **Step A (MDS):** Create a vectorized Pandas operation to calculate the Market Demand Score: `MDS = (Rating ** 2) * np.log10(Votes + 1)`.
*   **Step B (Baseline Demand):** 
    *   Filter the local subset to only those matching the target `Cuisine`.
    *   Exclude restaurants where `Votes == 0`.
    *   Calculate the `Average MDS`.
    *   *Error Handling:* Implement the City-Wide Fallback query if the resulting subset is empty.
*   **Step C (Supply Saturation):** Count the total number of physical units serving the target `Cuisine` in the filtered list (ensuring `0`-vote restaurants are included here).
*   **Step D (Opportunity Index):** Calculate `OI = Average MDS / math.sqrt(Competitors + 1)`.
*   **Sorting:** Sort the competitor list descending by `MDS` and slice the top 5 to return to the frontend.

## Phase 5: Groq LLM Integration (The Verdict)
**Goal:** Hook up the external AI to generate human-readable context.

*   **API Connection:** Authenticate the Groq Python SDK using an environment variable (`GROQ_API_KEY`).
*   **Prompt Engineering:** Design a strict, system-instructed prompt template that ingests the `Opportunity Index`, `Competitor Count`, and user variables to output exactly two sentences of strategic business advice.
*   **Error Handling:** Implement a fallback timeout message in case the Groq API fails, so the user still receives the hard numbers without the app crashing.

## Phase 6: Frontend Development & API Binding
**Goal:** Build the user-facing dashboard.

*   **Input Form:** Build a clean, conversion-optimized form component to capture the 4 variables.
*   **State Management:** Handle loading states while waiting for the FastAPI response.
*   **Results Dashboard:**
    *   Design a "Verdict Card" that heavily highlights the Opportunity Index and the Groq-generated text.
    *   Design a minimalistic "Top 5 Competitors" data table showing Names, Ratings, Votes, and individual MDS.

## Phase 7: Testing & Final Review
**Goal:** Guarantee system stability before pushing to production.

*   **Unit Testing (Math):** Write `pytest` scripts specifically validating the division-by-zero safeguards and the `0`-vote exclusion logic.
*   **Integration Testing:** Ensure the Frontend successfully parses the JSON payload from the Backend.
*   **Deployment Preparation:** Containerize the backend with Docker (optional) and set up hosting configurations (e.g., `render.yaml` and Vercel build commands).
