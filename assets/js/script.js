let cityInputEl = document.querySelector('#city-input');
let searchCityEl = document.querySelector('#search-button');
let pastCityEl = document.querySelector('#past-city-p');

searchCityEl.addEventListener('click', function(event) {
    event.preventDefault();

    let cityKey = 'City';
    let cityValue = cityInputEl.value;

    console.log(cityKey + ' + ' + cityValue);

    if (!cityValue){
        alert('Please enter a city name!');
    } else {
        localStorage.setItem(cityKey, cityValue);
    }

    savePastCities();
    convertCityToCoordinates(cityInputEl.value);
});

//saves ALL cities to local storage by using an array
function savePastCities(){
    let pastCityArr = [];
    let pastCityKey = Object.keys(localStorage);

    for (let i = 0; i < pastCityKey.length; i++){
        let pastCityValue = localStorage.getItem(pastCityKey[i]);
        pastCityArr.push(pastCityValue);

        
        pastCityEl.innerHTML += `<br><button>${pastCityValue}</button><br />`
    };
    return pastCityArr;
};
//Converts a user's city input into coordinates in order to run getCityWeather()
function convertCityToCoordinates(city) {
    let cityCoordinates = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=aaf9cc374cf52ab84d2a9ad1a36540fc`

   fetch(cityCoordinates)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        //accesses the latitude and longitude of a city to be used in getCityWeather()
        latitude = data[0].lat;
        longitude = data[0].lon;

        console.log(`${latitude} and ${longitude}`);
     getCityWeather(latitude, longitude);
    });
};

//Calls the API for a city at a specfic latitude and longitude
function getCityWeather(lat, lon){
    let cityWeather = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=61ee82860cefb2a3f3a53b06c73c83a6`;
    fetch(cityWeather)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(cityWeather);
    });
};