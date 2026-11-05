import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import router

load_dotenv()

app = FastAPI(
    title="ENSO Monitor API",
    description="Indice ONI de la NOAA : observations, filtrage par période et comparaison d'épisodes.",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["GET"],
)
app.include_router(router)
