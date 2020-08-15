'use strict';

const axios = require('axios');

module.exports.getTemp = async event => {

  // City name passed through query string parameter 
  // If nothing provided or with first visit default is set to 'firstVisit'

  let cityName = 'firstVisit';

  if (event.queryStringParameters && event.queryStringParameters.stadt && event.queryStringParameters.stadt !== "") {
    cityName = event.queryStringParameters.stadt;
  }

  // Display first message
  if (cityName === 'firstVisit') {
    return {
      body: JSON.stringify(
        {
          message: `Mit den Query String Parametern stadt=[EINE_DEUTSCHE_STADT_DEINER_WAHL] erfährst du die aktuelle Temperatur dort`
        },
      ),
    }
  }

  // Request URL to weather API
  const apiURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=b13002d47c5a135d4b791e6e956f1137&units=metric&q='
    + `${cityName}`;
  // Get weather info with given city parameter
  const weatherInfo = await axios.get(apiURL);

  const city = weatherInfo.data.name;
  const temp = weatherInfo.data.main.temp;
  const country = weatherInfo.data.sys.country;

  // Display weather info 
  if (country === 'DE') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(
        {
          summary: `In ${city} hat es heute ${temp} °C`
        },
      ),
    }
  } else if (country == ! 'DE') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(
        {
          summary: `Interessiert am Wetter in ${city}, obwohl keine deutsche Stadt? Aktuell hier gerade ${temp} °C`
        },
      )
    };
  }
};
