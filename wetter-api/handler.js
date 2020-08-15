'use strict';

const axios = require('axios');

module.exports.getTemp = async event => {

  // City name passed through query string parameter in GET request
  // Used to make specific request to weather API
  let cityName = event.queryStringParameters.stadt

  const apiURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=b13002d47c5a135d4b791e6e956f1137&units=metric&q='
    + `${cityName}`;

  const weatherInfo = await axios.get(apiURL);
  const city = weatherInfo.data.name;
  const temp = weatherInfo.data.main.temp;
  const country = weatherInfo.data.sys.country;

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
    };
  } else {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(
        {
          summary: `Eigentlich reagiert der Endpoint ja nur auf deutsche Städtenamen... Aber wo wir schon dabei sind: In ${city} hat es gerade ${temp} °C`
        },
      )
    };
  }
};
