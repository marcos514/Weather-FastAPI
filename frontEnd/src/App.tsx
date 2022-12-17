import React, {useState} from 'react';
import './App.css';
import { Button, Input, List, Icon,Card, Image } from 'semantic-ui-react'

interface IFavoriteZipCodes {
  city: string;
  zipCode: number;
}

interface IWeather {
  zip_code: number;
  mainWeather: string;
  weatherIcon: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  city: string
}


function App() {
  const [zipCode, setZipCode] = useState('')
  const [favoriteZipCodes, setFavoriteZipCodes] = useState<IFavoriteZipCodes[]>(JSON.parse(sessionStorage.getItem('favoriteZipCodes') || '[]') as IFavoriteZipCodes[])
  const [weather, setWeather] = useState<IWeather>()

  const removeFavorite = (zipCode: number) => {
    setFavoriteZipCodes(current=>{
      const zipCodes = current.filter(zip=> zip.zipCode !== zipCode)
      sessionStorage.setItem('favoriteZipCodes', JSON.stringify(zipCodes))
      return zipCodes
    })
  }

  const addFavorite = (weather: IWeather) => {
    setFavoriteZipCodes(current=>{
      const newFavorite = [...current.filter(zip=> zip.zipCode !== weather.zip_code), {
        city: weather.city,
        zipCode: weather.zip_code,
      } as IFavoriteZipCodes]
      sessionStorage.setItem('favoriteZipCodes', JSON.stringify(newFavorite))
      return newFavorite
    })
  }

  const getWeather = async () => {
    const weather_response = await fetch(`/weather/us/${zipCode}`, {
        method: 'GET',
        mode: 'no-cors'
    })
    setWeather(await weather_response.json())
    setZipCode('')
  }
  
  return (
    <div className="App">
      <div style={{
        maxWidth: '46rem',
        margin: 'auto',
        color: '#777'
      }}>
        <div style={{
          width: '100%',
          justifyContent: 'flex-end',
          display: 'flex',
          backgroundColor: '#f8f9fa',
          padding: '0.5rem 1rem',
        }}>
          <Input className='zipCodeInput' type="number" list="fav" value={zipCode} onChange={(e) => setZipCode(e.target.value)} placeholder="Zip Code" aria-label="Zip Code"></Input>
          <datalist id="fav">
            {
              favoriteZipCodes.map(zipCode=> <option value={zipCode.zipCode} />)
            }
          </datalist>
          <Button inverted disabled={Number(zipCode)<=9999 || Number(zipCode)>=100000} color='green' positive onClick={()=>getWeather()}>Search</Button>
        </div>
        <List size='huge' verticalAlign='middle' >
          {favoriteZipCodes.map(zipCode => <List.Item style={{ border: '1px solid rgba(0, 0, 0, 0.125)', padding: '1rem 1rem'}}>
            <List.Content floated='right'>
              <Button icon onClick={()=> removeFavorite(zipCode.zipCode)}><Icon name='close'/></Button>
            </List.Content>
            <List.Content style={{display:'flex'}}><p>{zipCode.city}</p></List.Content>
          </List.Item>)}
        </List>

        {
          weather && <Card style={{width: '100%'}}>
            <Card.Content>
              <Card.Header>
                <h4 style={{fontSize: '2rem', color: '#777'}}>{weather.city}
                <Image
                  style={{backgroundColor: 'lightgray'}}
                  size='tiny'
                  verticalAlign='middle'
                  floated='right'
                  circular
                  src={`http://openweathermap.org/img/wn/${weather.weatherIcon}@2x.png`}
                />
                </h4>
              </Card.Header>

              <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <h1 style={{fontSize: '2.5rem', margin: '0px'}}>
                    {Math.round(weather.temperature)} °
                  </h1>
                  <h6 style={{fontSize: '1.2rem', margin: '0px'}}>Fair</h6>
                </div>

                <div style={{marginRight: '10%'}}>
                  <h5 className='weatherStats'>{weather.mainWeather}</h5>
                  <h5 className='weatherStats'>Humidity: {weather.humidity}%</h5>
                  <h5 className='weatherStats'>Wind: {weather.windSpeed}mph</h5>
                </div>
              </div>
            </Card.Content>
            <Card.Content extra>
              <Button primary onClick={()=>addFavorite(weather)}>
                Add to favorites
              </Button>
            </Card.Content>
          </Card>
        }

      </div>
    </div>
  );
}

export default App;
