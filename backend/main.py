from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from services.data_service import load_data

load_dotenv()

app = FastAPI(title="RestoLaunch AI Backend")

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers.predict import router as predict_router
app.include_router(predict_router, prefix="/api")


@app.on_event("startup")
async def startup_event():
    # Load dataset into global memory upon startup
    # We pass the relative path (or it defaults to "dataset.csv")
    load_data("dataset.csv")

@app.get("/health")
def health_check():
    return {"status": "ok"}
