from fastapi import APIRouter, HTTPException, Query, Request, Response
import random

router = APIRouter(
    prefix="/formValidator",
    tags=["formValidator"],
    responses={404: {"description": "Not found"}}, #default response
)

@router.post('/isFormValid')
async def post(request: Request):
    data = await request.body()
    print(data)

    return {"isValid": random.randint(0, 1) == 0}


# @router.get('/isFormValid')
# async def get():
#     return {"isValid": random.randint(0, 1) == 0}