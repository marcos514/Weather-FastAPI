import os

import requests

from typing import Union

from fastapi import FastAPI, HTTPException

from pydantic import BaseModel

app = FastAPI()

class Weather(BaseModel):
    zip_code: int
    mainWeather: str
    # http://openweathermap.org/img/wn/10d@2x.png
    weatherIcon: str
    temperature: float
    humidity: float
    windSpeed: float
    city: str




@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/weather/{country}/{zip_code}")
def get_weather_by_zip(country:str, zip_code: int):
    weather_response = requests.get('https://api.openweathermap.org/data/2.5/weather', params = {
        "zip":f"{zip_code},{country}",
        "appid": os.environ.get("WEATHER_API_KEY"),
        "units": "imperial"
    })
    if weather_response.status_code != 200:
        error_message = weather_response.json().get["message"]
        raise HTTPException(status_code=weather_response.status_code, detail=error_message)
    
    weather_json = weather_response.json()
    weather: Weather = {
        'zip_code': zip_code,
        'mainWeather': weather_json['weather'][0]['main'],
        'weatherIcon': weather_json['weather'][0]['icon'],
        'temperature': weather_json['main']['temp'],
        'humidity': weather_json['main']['humidity'], 
        'windSpeed': weather_json['wind']['speed'],
        'city': weather_json['name'],
    }

    return weather