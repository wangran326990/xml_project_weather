$(document).ready(
	function(){

		//hideWeatherDetail();
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(getWeatherInfo);
		}else{

		}
	}
);
	

function getWeatherInfo(position){
	$url ="./index.php?route=WeatherHome/weatherInCurrentLocation/"+position.coords.latitude+'/'+position.coords.longitude;
	console.log($url);
	$.get($url,function(data, status){
		var obj = JSON.parse(data);
		console.log(obj);
		var currentWeather = obj.weatherCurrent;
		var weatherFor3days = obj.weatherFor3days;
		var weatherNext3Hours = obj.weatherNext3Hours;
		var weatherNextDay =obj.weatherNextDay;
		displayCurrentWeather(currentWeather);
		displayNext3Hours(weatherNext3Hours);
		displayNextDay(weatherNextDay);
	});
}

function hideWeatherDetail(){
	$(".weather-desc").hide();
	$(".button-image").click(
		function(){
		//$(".weather-desc").slideUp(400);
			var $selected =$(this).parent().parent().next();
			$(".weather-desc").not($selected).slideUp(400);
			$selected.slideToggle(400);
		});	
}

function displayCurrentWeather(currentWeather){
		console.log(currentWeather);
		var html ="";

		html ="<div class='row'><div class='col-md-3'><img src="+"'"+currentWeather.weatherIcon+"'"+"/></div>";
		html+="<div class='col-md-9'><span class='temp-font'>"+currentWeather.temperature+"</span></div></div>";
		html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+currentWeather.windspeed+" "+currentWeather.weatherDescription+"</p></div>";
		$("#currentWeather").removeClass('Loading').html(html);

}

function displayNext3Hours(Weather){
	console.log(Weather);
	var html ="";

	html = "<div class='row'><div class='col-md-3'><img src="+"'"+Weather.Next3Hours.weather.iconUrl+"'"+"/></div>";
	html+="<div class='col-md-9'><span class='temp-font'>"+Weather.Next3Hours.temperature+"</span></div></div>";
	html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+Weather.Next3Hours.windSpeed+" "+Weather.Next3Hours.weather.Description+"</p></div>";
	$("#Next3HourWeather").removeClass('Loading').html(html);

}


function displayNextDay(Weather){
	console.log(Weather);
	var html ="";

	html = "<div class='row'><div class='col-md-3'><img src="+"'"+Weather.NextDay.weather.iconUrl+"'"+"/></div>";
	html+="<div class='col-md-9'><span class='temp-font'>"+Weather.NextDay.temperature+"</span></div></div>";
	html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+Weather.NextDay.windSpeed+" "+Weather.NextDay.weather.Description+"</p></div>";
	$("#NextDayWeather").removeClass('Loading').html(html);

}

