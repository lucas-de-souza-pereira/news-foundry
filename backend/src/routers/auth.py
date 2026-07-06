from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import Session, select
import jwt
from jwt.exceptions import InvalidTokenError
from database import get_db
from models import User
from schemas import Token, TokenData, LoginRequest
from security import (
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
from utils.routes import API_BASE_ROUTE, AUTH_ROUTES

router = APIRouter(prefix=API_BASE_ROUTE["auth"], tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=API_BASE_ROUTE["auth"] + "/login-swagger")
@router.post(AUTH_ROUTES["login"], response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    statement = select(User).where(User.email == credentials.email)
    user = db.exec(statement).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token, token_type="bearer")

@router.post("/login-swagger", response_model=Token, include_in_schema=False)
def login_swagger(credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    statement = select(User).where(User.email == credentials.username)
    user = db.exec(statement).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token, token_type="bearer")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
        
    statement = select(User).where(User.email == token_data.email)
    user = db.exec(statement).first()
    if user is None:
        raise credentials_exception
    return user