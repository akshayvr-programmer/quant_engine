from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello Quant"}

@app.get("/hello")

def hello():
    return {"hello":"world"}

@app.get("/strategy/{id}")

def strategy(id:int):
    return {"strategy":id}

@app.get("backtest")

def backtest(days:int):
    return {"days":days}

@app.post("/strategy")

def create():
    return {"created" : True }

