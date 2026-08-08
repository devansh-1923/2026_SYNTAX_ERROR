from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="HabitaX API",
    description="Exoplanet Habitability Explorer Backend",
    version="0.1.0"
)

# Allow our React frontend to communicate with this API.
# For development/hackathon use only.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "HabitaX backend is running"
    }


@app.get("/api/test")
def test():
    return {
        "status": "success",
        "message": "Frontend and backend are connected"
    }