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

  if (weatherInfo.data.sys.country === 'DE') {
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
          summary: `${city} ist keine deutsche Stadt.... Aber es hat dort gerade ${temp} °C`
        },
      )
    };
  }
};