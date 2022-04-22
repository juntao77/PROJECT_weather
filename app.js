
// let city = 'beijing';


// function fetchOpenWeather() {
//     fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=3&appid=52a9aa914e80922eca0a090fdb5fcf16`
//     ,{mode: 'cors'}
//     )
//     .then(function(res) {
//         // console.log(res.json())
//         return res.json();

//     })
//     .catch(function(e){
//         return e; 
//     }) 
// }

// console.log(fetchOpenWeather('beijing'))

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const country = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const API_KEY = '52a9aa914e80922eca0a090fdb5fcf16';

setInterval(()=>{
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hourIn12Hrs = hour >= 13 ? hour %12: hour;
    const minute = time.getMinutes();
    const ampm= hour >=12 ? 'PM' : 'AM';

    timeEl.innerHTML = hourIn12Hrs + ':' + minute + ' ' + `<span id="am-pm">${ampm}</span>`;
    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month];
},1000)

function getWeatherData(){
    navigator.geolocation.getCurrentPosition((success)=> {
        let {latitude, longitude} = success.coords;

        fetch (`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`,{mode: 'cors'})
            .then(res=> res.json())
            .then(data=>{
                console.log(data)
                showWeatherData(data);
        })
    })
}

getWeatherData();

function showWeatherData(data){
    let {humidity, pressure, temp, feels_like, wind_speed} = data.current;

    timezone.innerHTML = data.timezone;
    

    currentWeatherItemsEl.innerHTML = 
    `    <div class="weather-item">
             <div>Temperature</div>
             <div>${Math.floor(temp)}&#176;C</div>
         </div>
         <div class="weather-item">
             <div>Feels Like</div>
             <div>${Math.floor(feels_like)}&#176;C</div>
         </div>
       <div class="weather-item">
           <div>humidity</div>
           <div>${humidity}%</div>
       </div>
       <div class="weather-item">
           <div>wind</div>
           <div>${Math.floor(wind_speed)}km/hr</div>
       </div>
       <div class="weather-item">
           <div>pressure</div>
           <div>${pressure}hPa</div>
       </div>`;

       let otherDayForcast = ''
       data.daily.forEach((day, idx) => {
           if(idx == 0){
               currentTempEl.innerHTML = `
               <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
               <div class="other">
                   <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                   <div class="temp"> ${Math.floor(day.temp.max)}&#176;C</div>
                   <div class="temp"> ${Math.floor(day.temp.min)}&#176;C</div>
               </div>
               
               `
           }else{
               otherDayForcast += `
               <div class="weather-forecast-item">
                   <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                   <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                   <div class="temp"> ${Math.floor(day.temp.max)}&#176;C</div>
                   <div class="temp"> ${Math.floor(day.temp.min)}&#176;C</div>
               </div>
               
               `
           }
       })
   
   
       weatherForecastEl.innerHTML = otherDayForcast;
   }
