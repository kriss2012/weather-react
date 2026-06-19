import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import { Input,Button,Icon ,Container,Segment,Menu} from 'semantic-ui-react';
import './App.css';
import Form from './Form';
import Weather from './Weather';
import "semantic-ui-css/semantic.min.css";
import { Header,Step} from 'semantic-ui-react';
import { Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import as from './as.gif';



function App() {
  const style = {
    h1: {
      marginTop: '3em',
    },
    h2: {
      margin: '4em 0em 2em',
    },
    h3: {
      marginTop: '2em',
      padding: '2em 0em',
    },
    last: {
      marginBottom: '300px',
    },
  }
  

  const [weather,setWeather] = useState([])
  const APIKEY = 'c2514daffcbd261b8f9940d30fc01d0a'

  async function fetchData(e) {
    const city = e.target.elements.city.value
   
      e.preventDefault()
    const apiData = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKEY}`)
      .then( res => res.json())
      .then(data => data)
      if(city ) {
      setWeather({
        data: apiData,
        city: apiData.name,
        icon: apiData.weather[0].icon,
        description: apiData.weather[0].description,
        temperature: Math.round(apiData.main.temp_min -273.15),
        temperaturef: Math.round((Math.round(apiData.main.temp_min -273.15))*1.8+32),
        error:""
      }
      )} else {
        setWeather({
          data: '',
          city: '',
         
          description: '',
          temperature: '',
          error:"Please Type A City And Country"
      }
      )}
    
  }
  var src;
  if(weather.description === 'few clouds'){
    src = `https://source.unsplash.com/1820x900/?weather,cloud` ;
  
  }
  else  if(weather.description === 'clear sky'){
    src = `https://source.unsplash.com/1820x900/?weather,clearsky` ;
  
  }
  else  if(weather.description === 'scattered clouds'){
    src = `https://source.unsplash.com/1820x900/?weather,scatteredclouds` ;
  
  }
  else  if(weather.description === 'broken clouds'){
    src = `https://source.unsplash.com/1820x900/?weather,brokenclouds` ;
  
  }
  else  if(weather.description === 'shower rain'){
    src = `https://source.unsplash.com/1820x900/?weather,showerrain` ;
  
  }else  if(weather.description === 'thunderstorm'){
    src = `https://source.unsplash.com/1820x900/?weather,	thunderstorm` ;
  
  }else  if(weather.description === 'snow'){
    src = `https://source.unsplash.com/1820x900/?weather,snow` ;
  
  }else  if(weather.description === 'mist'){
    src = `https://source.unsplash.com/1820x900/?weather,mist` ;
  
  }else  if(weather.description === 'smoke'){
    src = `https://source.unsplash.com/1820x900/?weather,smoke` ;
  
  }
  else{
    src = as ;
  }
 


  return (
   
    <div className="App" style ={{  backgroundImage:`url(${src})` }}>
     
      <div className="Navbar" >
    
    <span className ='wes' style={{color : 'orange' }}>24</span><Icon name='x'/><span className ='wes'>7 </span><span className ='wes'>CLOUDY</span><span className ='wes' style={{color : 'orange' }}>LIVE.com</span> <Icon name='cloud'/> 
   
   
  </div>
      <Form getWeather={fetchData} />
      <Weather
      icon ={weather.icon}
      city={weather.city}
      description={weather.description}
      temperature={weather.temperature}
      temperaturef={weather.temperaturef}
      error={weather.error}
      />
      {console.log(weather.data)}
      <div className='footer'>
      <h3>Get Code At:</h3>
      <span className= 'element'>
      <a a href ='https://github.com/djangobaby2015/weather-react '> <Icon size='large' name ='github'></Icon></a> 
    </span>
    </div>
    </div>

  );
}

export default App;
