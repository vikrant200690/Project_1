from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Add CORS middleware to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Default Vite React port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fake_users_db = {}

class User(BaseModel):
    username: str
    password: str

@app.post("/signup")
def signup(user: User):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    fake_users_db[user.username] = user.password
    return {"message": "User created successfully! You can now log in."}

@app.post("/login")
def login(user: User):
    if user.username not in fake_users_db or fake_users_db[user.username] != user.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    return {"message": f"Welcome back, {user.username}! Login successful."}