from fastapi import FastAPI

from app.routes import router

app = FastAPI(
    title="ENSO Monitor API",
    description="Indice ONI de la NOAA : observations, filtrage par période et comparaison d'épisodes.",
    version="1.0.0",
)
app.include_router(router)
