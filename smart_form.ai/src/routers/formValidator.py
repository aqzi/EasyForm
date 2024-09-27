from fastapi import APIRouter, HTTPException, Query, Request, Response
import random
import os
import json
from datetime import datetime

router = APIRouter(
    prefix="/formValidator",
    tags=["formValidator"],
    responses={404: {"description": "Not found"}}, #default response
)

# Ensure the directory exists
log_dir = './data/logs'
os.makedirs(log_dir, exist_ok=True)

# Maximum number of log files
MAX_FORM_LOGS = 5

def remove_oldest_file(directory):
    files = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.json')]
    
    if len(files) > MAX_FORM_LOGS - 1:
        oldest_file = min(files, key=os.path.getctime)  # Get the oldest file based on creation time
        os.remove(oldest_file)

@router.post('/isFormValid')
async def post(request: Request):
    data = await request.json()

    # Remove the oldest file if more than MAX_FORM_LOGS files exist
    remove_oldest_file(log_dir)

    # Create a timestamped filename
    filename = f"form_data_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    file_path = os.path.join(log_dir, filename)
    
    # Write the data to the JSON file
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=4)

    return {"isValid": random.randint(0, 1) == 0}