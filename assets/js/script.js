let cityInputEl = document.querySelector('#city-input');
let searchCityEl = document.querySelector('#search-button');
let pastCityEl = document.querySelector('#past-city-p');
var iterator = 0;
var currentWeatherObj = {};
var weeklyWeatherObj = {};

//searches for city and saves to local storage. Also converts the city into actual coordinates for getCityWeather()
searchCityEl.addEventListener('click', function(event) {
    event.preventDefault();

    let cityKey = `City${iterator++}`;
    let cityValue = cityInputEl.value;

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
    let pastCityKey = Object.keys(localStorage).sort();
    pastCityEl.innerHTML = null;

    for (let i = 0; i < pastCityKey.length; i++){
        let pastCityValue = localStorage.getItem(pastCityKey[i]);
        pastCityArr.push(pastCityValue);

        let breakTag = document.createElement('br')
        let button = document.createElement('input');
        button.type = 'button';
        button.value = pastCityValue;
        

        button.addEventListener('click', function(event) {
            event.preventDefault();

            convertCityToCoordinates(localStorage.getItem(`City${i}`));
        });

        pastCityEl.appendChild(breakTag);
        pastCityEl.appendChild(button);
    };
    iterator = pastCityKey.length;
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

        getCityWeather(latitude, longitude);
        getCityWeatherWeek(latitude,longitude);
    });
};

//Calls the API for a city at a specfic latitude and longitude
function getCityWeather(lat, lon){
    let cityWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=aaf9cc374cf52ab84d2a9ad1a36540fc`;
    fetch(cityWeather)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        currentWeatherObj = data;
        displayCurrentWeather();
    });
};

function displayCurrentWeather() {
    let currentCityName = document.getElementById('city-name')
    let currentCityTemp = document.getElementById('temp');
    let currentCityWind = document.getElementById('wind');
    let currentCityHumidity = document.getElementById('humidity');

    currentCityName.innerHTML = currentWeatherObj.name;
    currentCityTemp.innerHTML = `Current Temperature: ${currentWeatherObj.main.temp}°F`;
    currentCityWind.innerHTML = `Wind: ${currentWeatherObj.wind.speed} MPH`;
    currentCityHumidity.innerHTML = `Humidity: ${currentWeatherObj.main.humidity}%`;
};

function getCityWeatherWeek(lat, lon){
    let cityWeatherWeek = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=aaf9cc374cf52ab84d2a9ad1a36540fc`;
    fetch(cityWeatherWeek)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        weeklyWeatherObj = data;
        displayWeatherWeek();
    });
};

function displayWeatherWeek() {
    let parentDiv = document.getElementById('weekly-forecast');
        parentDiv.innerHTML = null;

    for (let i = 4; i < 44; i = i + 8) {
        let div = document.createElement('div');
        let dateP = document.createElement('p');
        let tempP = document.createElement('p');
        let windP = document.createElement('p');
        let humidityP = document.createElement('p');
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let timeStamp = new Date(((new Date(0)).setUTCSeconds(weeklyWeatherObj.list[i].dt)));

        dateP.innerHTML = '<b>' + timeStamp.toLocaleDateString("en-US", options) +'</b>';
        tempP.innerHTML = `Temperature: ${weeklyWeatherObj.list[i].main.temp}°F`;
        windP.innerHTML = ` Wind: ${weeklyWeatherObj.list[i].wind.speed} MPH`;
        humidityP.innerHTML = `Humidity: ${weeklyWeatherObj.list[i].main.humidity}%`;

        div.appendChild(dateP);
        div.appendChild(tempP);
        div.appendChild(windP);
        div.appendChild(humidityP);

        parentDiv.appendChild(div);
    }
};

window.onload = () => {
    let returnValue = '';

    for (let i = 0; i < localStorage.length; i++) {
        let key = `City${i}`;
        returnValue += localStorage.getItem(key) + '\n';
    }
    savePastCities();
};