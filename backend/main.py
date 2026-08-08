from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from classifier import classify_planet
from fastapi import FastAPI, Query

from nasa import get_planets


app = FastAPI(
    title="HabitaX API",
    description="Exoplanet Habitability Explorer Backend",
    version="0.1.0"
)


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


@app.get("/api/planets")
def planets():
    data = get_planets()

    return {
        "count": len(data),
        "planets": data
    }

@app.get("/api/planets/{planet_name}/analysis")
def analyze_planet(planet_name: str):
    planets = get_planets()

    for planet in planets:
        if planet.get("pl_name", "").lower() == planet_name.lower():
            analysis = classify_planet(planet)

            return {
                "planet": planet,
                "analysis": analysis
            }

    return {
        "error": "Planet not found"
    }

@app.get("/api/planets/search")
def search_planets(
    q: str = Query(..., min_length=1, description="Planet or host star name")
):
    planets = get_planets()

    query = q.lower().strip()

    results = []

    for planet in planets:
        planet_name = str(planet.get("pl_name") or "").lower()
        host_name = str(planet.get("hostname") or "").lower()

        if query in planet_name or query in host_name:
            results.append(planet)

    return {
        "query": q,
        "count": len(results),
        "planets": results
    }