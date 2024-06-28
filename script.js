const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const cityHide = document.querySelector('.city-hide');

search.addEventListener('click', () => {
    const APIKey = '';
    const city = document.querySelector('.search-box input').value;

    if(city === ''){
        return;
    }

    const getDataByCity = () => eventManager(getByCity(city,APIKey));
    getDataByCity();

    const getDataByCityHourly = () => eventManager(getByCityHourly(city, APIKey));
    getDataByCityHourly();
});

async function getByCity(city, APIKey){
    container.classList.remove('active'); // without auto clear
    if(cityHide.textContent === city){
        return;
    }
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json => {


        if (json.cod == '404') {
                cityHide.textContent = city;
                container.style.height = '400px';
                weatherBox.classList.remove('active');
                weatherDetails.classList.remove('active');
                error404.classList.add('active');
                return;
            }

            cityHide.textContent = city; // delete if you need search same city again

            container.style.height = '600px';
            container.classList.add('active');
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.classList.remove('active');

            // setTimeout(()=>{ // with auto clear
            //     container.classList.remove('active');
            // },2500);

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            const weather = {
                'Clear': 'images/clear.png',
                'Rain': 'images/rain.png',
                'Snow': 'images/snow.png',
                'Clouds': 'images/cloud.png',
                'Mist': 'images/mist.png',
                'Haze': 'images/mist.png'
            }
        image.src = //`https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/${json.weather[0].icon}.png`; // icons
            weather[json.weather[0].main] || 'images/default.png'; // png images

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
            description.innerHTML = `${json.weather[0].description}`;
            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseFloat(json.wind.speed)}Km/h`;

            // city transition
            const infoWeather = document.querySelector('info-weather');
            const infoHumidity = document.querySelector('info-humidity');
            const infoWind = document.querySelector('info-wind');

            const cloneInfoWeather = infoWeather.cloneNode(true);
            const cloneInfoHumidity = infoHumidity.cloneNode(true);
            const cloneInfoWind = infoWind.cloneNode(true);

            cloneInfoWeather.id = 'clone-info-weather';
            cloneInfoWeather.classList.add('active-clone');

            cloneInfoHumidity.id = 'clone-info-humidity';
            cloneInfoHumidity.classList.add('active-clone');

            cloneInfoWind.id = 'clone-info-wind';
            cloneInfoWind.classList.add('active-clone');

            setTimeout(()=>{
                infoWeather.insertAdjacentElement("afterend",cloneInfoWeather);
                infoHumidity.insertAdjacentElement("afterend", cloneInfoHumidity);
                infoWind.insertAdjacentElement("afterend", cloneInfoWind);
            },2200);

            const fcloneInfoWeather = document.querySelectorAll('.info-weather.active-clone');
            const totalCloneInfoWeather = fcloneInfoWeather.length;
            const cloneInfoWeatherFirst = fcloneInfoWeather[0];

            const fcloneInfoHumidity = document.querySelectorAll('.info-humidity.active-clone');
            const cloneInfoHumidityFirst = fcloneInfoHumidity[0];

            const fcloneInfoWind = document.querySelectorAll('.info-wind.active-clone');
            const cloneInfoWindFirst = fcloneInfoWind[0];

            if(totalCloneInfoWeather > 0){
                cloneInfoWeatherFirst.classList.remove('active-clone');
                cloneInfoHumidityFirst.classList.remove('active-clone');
                cloneInfoWindFirst.classList.remove('active-clone');

                setTimeout(()=>{
                    cloneInfoWeatherFirst.remove();
                    cloneInfoHumidityFirst.remove();
                    cloneInfoWindFirst.remove();
                },2200);
            }

        })
}

function getByCityHourly(city, APIKey){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${APIKey}`)
    .then(response => response.json())
    .then(json =>{
        displayHourlyForecast(json)
    })
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    hourlyForecastDiv.innerHTML = '';

    const next24Hours = hourlyData['list'].slice(0, 8); // Display the next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function eventManager(fn) {
    let executing = false;

    return async () => {
        if (!executing) {
            await fn();
            setTimeout(
                () => {
                    executing = false
                },
                2000);
        }
    }
}
