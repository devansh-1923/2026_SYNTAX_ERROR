import requests

NASA_TAP_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"


QUERY = """
SELECT
    pl_name,
    hostname,
    pl_rade,
    pl_bmasse,
    pl_orbper,
    pl_orbsmax,
    pl_eqt,
    pl_insol,
    pl_dens,
    st_teff,
    st_rad,
    st_mass,
    st_lum,
    st_spectype
FROM pscomppars
WHERE pl_name IS NOT NULL
"""


def get_planets():
    response = requests.get(
        NASA_TAP_URL,
        params={
            "query": QUERY,
            "format": "json"
        },
        timeout=30
    )

    response.raise_for_status()

    return response.json()