from pydantic import BaseModel

class RestaurantRequest(BaseModel):
    location: str
    format: str
    budget: int
    cuisine: str
