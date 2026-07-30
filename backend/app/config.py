from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str
    
    # Application
    SECRET_KEY: str
    PROJECT_NAME: str = "Task Management System"
    API_VERSION: str = "v1"
    
    # Server
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: str = '["http://localhost:3000"]'
    
    @property
    def allowed_origins_list(self) -> List[str]:
        return json.loads(self.ALLOWED_ORIGINS)
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()