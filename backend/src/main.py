from database import init_db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from contextlib import asynccontextmanager
import os
import mlflow
from routers.auth import router as auth_router
from routers.chat import router as chat_router


logger = logging.getLogger("uvicorn.error")

mlflow_uri = os.getenv("MLFLOW_TRACKING_URI", "http://localhost:5000")
mlflow.set_tracking_uri(mlflow_uri)

try:
    import mlflow.pydantic_ai
    mlflow.pydantic_ai.autolog()
    logger.info(f"MLflow activé. URI: {mlflow_uri}")
except ImportError as e:
    logger.warning(f"Impossible d'activer MLflow : {str(e)}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db() 
    logger.info("Server started successfully")
    logger.info("Swagger Documentation : http://localhost:8000/docs")
    logger.info("MLflow UI : http://localhost:5000")
    yield

app = FastAPI(lifespan=lifespan)


allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(chat_router)


@app.get("/")
async def hello():
    return {"message": "👋"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
