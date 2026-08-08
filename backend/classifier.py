from typing import Any


def classify_planet(planet: dict[str, Any]) -> dict[str, Any]:
    """
    Explainable habitability-potential screening.

    IMPORTANT:
    This is NOT a claim that a planet supports life.
    It evaluates whether available parameters are broadly
    compatible with conditions often considered favorable
    for potentially habitable worlds.
    """

    factors = []
    favorable = 0
    unfavorable = 0
    uncertain = 0

    # ---------------------------------------------------------
    # 1. PLANET SIZE
    # ---------------------------------------------------------

    radius = planet.get("pl_rade")

    if radius is None:
        uncertain += 1

        factors.append({
            "factor": "Planet size",
            "status": "unknown",
            "value": None,
            "explanation": "Planet radius is not available."
        })

    elif 0.5 <= radius <= 1.8:
        favorable += 1

        factors.append({
            "factor": "Planet size",
            "status": "favorable",
            "value": radius,
            "unit": "Earth radii",
            "explanation": (
                "The planet's radius falls within the selected "
                "screening range for small planets."
            )
        })

    else:
        unfavorable += 1

        factors.append({
            "factor": "Planet size",
            "status": "unfavorable",
            "value": radius,
            "unit": "Earth radii",
            "explanation": (
                "The planet's radius is outside the selected "
                "screening range."
            )
        })

    # ---------------------------------------------------------
    # 2. EQUILIBRIUM TEMPERATURE
    # ---------------------------------------------------------

    temperature = planet.get("pl_eqt")

    if temperature is None:
        uncertain += 1

        factors.append({
            "factor": "Equilibrium temperature",
            "status": "unknown",
            "value": None,
            "explanation": (
                "Equilibrium temperature is unavailable, "
                "so thermal conditions cannot be screened."
            )
        })

    elif 200 <= temperature <= 350:
        favorable += 1

        factors.append({
            "factor": "Equilibrium temperature",
            "status": "favorable",
            "value": temperature,
            "unit": "K",
            "explanation": (
                "The estimated equilibrium temperature is within "
                "the selected screening range."
            )
        })

    else:
        unfavorable += 1

        factors.append({
            "factor": "Equilibrium temperature",
            "status": "unfavorable",
            "value": temperature,
            "unit": "K",
            "explanation": (
                "The estimated equilibrium temperature lies "
                "outside the selected screening range."
            )
        })

    # ---------------------------------------------------------
    # 3. STELLAR TEMPERATURE
    # ---------------------------------------------------------

    stellar_temp = planet.get("st_teff")

    if stellar_temp is None:
        uncertain += 1

        factors.append({
            "factor": "Host-star temperature",
            "status": "unknown",
            "value": None,
            "explanation": "Host-star effective temperature is unavailable."
        })

    elif 3000 <= stellar_temp <= 7000:
        favorable += 1

        factors.append({
            "factor": "Host-star temperature",
            "status": "favorable",
            "value": stellar_temp,
            "unit": "K",
            "explanation": (
                "The host star's effective temperature falls within "
                "the selected broad stellar screening range."
            )
        })

    else:
        unfavorable += 1

        factors.append({
            "factor": "Host-star temperature",
            "status": "unfavorable",
            "value": stellar_temp,
            "unit": "K",
            "explanation": (
                "The host star's effective temperature falls outside "
                "the selected screening range."
            )
        })

    # ---------------------------------------------------------
    # 4. STELLAR FLUX / INSOLATION
    # ---------------------------------------------------------

    insolation = planet.get("pl_insol")

    if insolation is None:
        uncertain += 1

        factors.append({
            "factor": "Stellar irradiation",
            "status": "unknown",
            "value": None,
            "explanation": (
                "Incident stellar flux is unavailable."
            )
        })

    elif 0.25 <= insolation <= 2.0:
        favorable += 1

        factors.append({
            "factor": "Stellar irradiation",
            "status": "favorable",
            "value": insolation,
            "unit": "Earth fluxes",
            "explanation": (
                "The estimated stellar irradiation falls within "
                "the selected screening range."
            )
        })

    else:
        unfavorable += 1

        factors.append({
            "factor": "Stellar irradiation",
            "status": "unfavorable",
            "value": insolation,
            "unit": "Earth fluxes",
            "explanation": (
                "The estimated stellar irradiation is outside "
                "the selected screening range."
            )
        })

    # ---------------------------------------------------------
    # 5. FINAL CLASSIFICATION
    # ---------------------------------------------------------

    if favorable >= 3 and unfavorable == 0:
        classification = "Potentially Habitable"

    elif unfavorable >= 2:
        classification = "Unfavorable"

    elif uncertain >= 2:
        classification = "Insufficient Data"

    else:
        classification = "Marginal / Uncertain"

    # Transparent score for visualization.
    total_known = favorable + unfavorable

    if total_known > 0:
        score = round((favorable / total_known) * 100)
    else:
        score = None

    return {
        "classification": classification,
        "screening_score": 100,
"score_label": "Screening factor match",
        "favorable_factors": favorable,
        "unfavorable_factors": unfavorable,
        "uncertain_factors": uncertain,
        "factors": factors,
        "disclaimer": (
            "This is an explainable habitability-potential screening "
            "and does not establish the presence of life or actual "
            "surface habitability."
        )
    }