import os
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

#Routers have to be imported after the environment variables are loaded.
from routers import formValidator

app = FastAPI()

#Include routers
app.include_router(formValidator.router)

origins = [
    f"http://{os.getenv('WEB_APP_HOST')}:{os.getenv('WEB_APP_PORT')}",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # List of origins allowed to make cross-origin requests
    allow_credentials=True,  # Whether to allow credentials (cookies, authorization headers, etc.)
    allow_methods=["*"],  # List of HTTP methods allowed to be used when accessing the resource
    allow_headers=["*"],  # List of headers allowed to be sent by the client
)

if __name__ == "__main__":
    uvicorn.run(app, host=os.getenv('FORM_VALIDATION_SERVER_HOST'), port=int(os.getenv('FORM_VALIDATION_SERVER_PORT')))