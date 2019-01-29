window.addEventListener('offline', () => {
	console.log('Ops! We are offline');
});
window.addEventListener('online', () => {
	console.log('Back Online');
});

let inCity = document.querySelector('.city');
let inDegree = document.querySelector('.number');
let inFeedback = document.querySelector('.feedback');
let inHumidity = document.querySelector('.humidity-number');
let inWind = document.querySelector('.wind-number');
let background = document.querySelector('.img');
let searchResult = document.querySelector('.search-result');

(function() {
	fetchData();
	getLocation();
})();

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				const {
					coords: { latitude, longitude },
				} = position;
				const current = {
					lat: latitude,
					lon: longitude,
				};
				fetchData('', current);
			},
			function(error) {
				if (error.code == error.PERMISSION_DENIED) console.log('LOCATION PERMISSION DENIED');
			},
		);
	} else {
		console.log('Geolocation is not supported by this browser.');
	}
}

function fetchData(city, current) {
	hideResults();
	const appid = 'c03e0659c419001e805baf0a4eb7a11a';
	let query = 'q=Karachi';

	if (city) query = `q=${city}`;

	if (current) {
		const { lat, lon } = current;
		query = `lat=${lat}&lon=${lon}`;
	}

	fetch(
		`https://api.openweathermap.org/data/2.5/weather?${query}&units=metric&appid=${appid}`,
	)
		.then(res => res.json())
		.then(res => {
			inCity.value = res.name;
			inDegree.innerHTML = `${
				res.main.temp
			} <span class="degree">&#176;</span>`;
			inFeedback.innerHTML = res.weather[0].description;
			inHumidity.innerHTML = `${res.main.humidity}%`;
			inWind.innerHTML = res.wind.speed;
			background.style = `background: url('./images/forecast/${
				res.weather[0].icon
			}.jpg'); background-size: cover`;
		})
		.catch(err => {
			alert('We are offline');
			console.log(err);
		});
}

function typing(elem) {
	searchResult.style = 'display: block';

	const result = cities[cities.findIndex(x => x.city.includes(elem.value))];
	if (result && Object.keys(result).length > 1) {
		searchResult.innerHTML = `
		<li onclick="fetchData('${result.city}')">${result.city}</li>
		`;
	} else {
		searchResult.innerHTML = `
		<li>Nothing Found!</li>
		`;
	}
}

function hideResults() {
	searchResult.style = 'display: none';
}
