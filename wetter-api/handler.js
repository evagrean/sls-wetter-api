const axios = require('axios');

'use strict';

module.exports.hello = async event => {

  const weatherURL = 'http://api.openweathermap.org/data/2.5/weather?APPID=b13002d47c5a135d4b791e6e956f1137&units=metric&q=Berlin';

  const weatherInfo = await axios.get(weatherURL);

  let temperature = weatherInfo.data.main.temp;

  console.log(weatherInfo.data.temp);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(
      {
        message: `The temperature is ${temperature}`
      },
      null,
      2
    ),
  };
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

// const axios = require('axios');

// 'use strict';

// module.exports.getWeather = async event => {

//   // City name supplied as path parameter
//   let city = event.pathParameters.cityName;

//   // OpenWeatherMap API endpoint
//   // added metric to units query parameter to use Celsius
//   const endpoint = 'http://api.openweathermap.org/data/2.5/weather?APPID=b13002d47c5a135d4b791e6e956f1137&units=metric'
//     + `&q=${city}`;

//   const weatherInfo = await axios.get(endpoint);

//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//     body: JSON.stringify(
//       { summary: `In ${weatherInfo.data.name} sind es heute ${weatherInfo.data.main.temp} Grad Celsius` },
//       null,
//       2
//     ),
//   };

// };