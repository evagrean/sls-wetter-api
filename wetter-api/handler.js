const axios = require('axios');

'use strict';

module.exports.getWeather = async event => {

  // City name supplied as path parameter
  let city = event.pathParameters.cityName;

  // OpenWeatherMap API endpoint
  // added metric to units query parameter to use Celsius
  const openweatherURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=b13002d47c5a135d4b791e6e956f1137&units=metric'
    + `&q=${city}`;

  const weatherInfo = await axios.get(openweatherURL);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(
      { summary: `In ${weatherInfo.data.name} sind es heute ${weatherInfo.data.main.temp} Grad Celsius` },
      null,
      2
    ),
  };

};