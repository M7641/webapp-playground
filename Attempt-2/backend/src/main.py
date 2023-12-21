import time
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Test(BaseModel):
    field_1: str

async def get_tests():
    return [{"field_1": "foo"}]

async def post_test(test: Test):
    time.sleep(1)
    pass

@app.get("/tests", response_model=list[Test])
async def read_user_details():
    return await get_tests()

@app.post("/test")
async def put_user_details(test: Test):
    return await post_test(test)
