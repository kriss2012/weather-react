import React from 'react'
import { Header,Segment,Container} from 'semantic-ui-react';
import './weather.css';

const Weather = ({description, city,  error, temperature,icon, temperaturef}) => {
    return (
        <div >
            <img src ={"http://openweathermap.org/img/wn/"+icon+"@2x.png"}/>
           
            <br></br>
            <div >

    <Segment circular >
      <Header as='h2'>
        {temperature}°C
       
      </Header>
    </Segment>
    <Segment circular inverted >
      <Header as='h2' inverted>
      
      {temperaturef}°F
      </Header>
       
    </Segment>
    <br></br>
  </div>
  <div className ='ayu'>
  {city && <h3 >{city}</h3>}
            {description && <h3> Conditions: {description}</h3>}
            {error && <h3>{error}</h3>}
        </div>
        </div>
    )
}

export default Weather; 