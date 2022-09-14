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

