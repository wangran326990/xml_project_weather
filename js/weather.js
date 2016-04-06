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
		//console.log(obj);
		var currentWeather = obj.weatherCurrent;
		var weatherFordays = obj.weatherFor3days;
		var weatherNext3Hours = obj.weatherNext3Hours;
		var weatherNextDay =obj.weatherNextDay;
		displayCurrentWeather(currentWeather);
		displayNext3Hours(weatherNext3Hours);
		displayNextDay(weatherNextDay);
		displayNextDays(weatherFordays);
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
		//console.log(currentWeather);
		var html ="";

		html ="<div class='row'><div class='col-md-3'><img src="+"'"+currentWeather.weatherIcon+"'"+"/></div>";
		html+="<div class='col-md-9'><span class='temp-font'>"+currentWeather.temperature+"</span></div></div>";
		html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+currentWeather.windspeed+" "+currentWeather.weatherDescription+"</p></div>";
		$("#currentWeather").removeClass('Loading').html(html);

}

function displayNext3Hours(Weather){
	//console.log(Weather);
	var html ="";

	html = "<div class='row'><div class='col-md-3'><img src="+"'"+Weather.Next3Hours.weather.iconUrl+"'"+"/></div>";
	html+="<div class='col-md-9'><span class='temp-font'>"+Weather.Next3Hours.temperature+"</span></div></div>";
	html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+Weather.Next3Hours.windSpeed+" "+Weather.Next3Hours.weather.Description+"</p></div>";
	$("#Next3HourWeather").removeClass('Loading').html(html);

}


function displayNextDay(Weather){
	//console.log(Weather);
	var html ="";

	html = "<div class='row'><div class='col-md-3'><img src="+"'"+Weather.NextDay.weather.iconUrl+"'"+"/></div>";
	html+="<div class='col-md-9'><span class='temp-font'>"+Weather.NextDay.temperature+"</span></div></div>";
	html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+Weather.NextDay.windSpeed+" "+Weather.NextDay.weather.Description+"</p></div>";
	$("#NextDayWeather").removeClass('Loading').html(html);

}

function displayNextDays(Weather){
	console.log(Weather);
	var date = new Date();
	var html="";
	var objweather ={};

	$.each(Weather,function(i,item){
		//console.log(i);
		html +="<div class='weather-detail'><div class='row weather-decoration'><div class='col-sm-2'>";
		if(formatDate(date) == i) {
			html += "<h4>Today</h4>";
		}else{
			//console.log(i);
			//console.log(new Date(i));
			html +="<h4>"+getWeekDayName(new Date(i).getDay())+"</h4></div>";
		}
		html +="<div class='col-sm-1'><img src="+"'"+item[0].weather.iconUrl+"'"+"/></div>";
		html +="<p class='col-sm-3 weather-p'>"+item[0].weather.Description+"</p>";
		objweather = getHandLTemp(item);
		html +="<div class='col-sm-6 weather-p'><span>"+objweather.min+"</span><div class='temperature-range' style='width:"+objweather.long+"'"+"></div><span>"+objweather.max+"</span>";
		html +="<img class='button-image' src='./images/plusButton.png'></div></div>";
		$.each(item, function(j,detail){
			console.log(detail);
		});
	});

	$("#next-five").html(html);
}


function formatDate(date) {
	var
		month = '' + (date.getMonth() + 1),
		day = '' + date.getDate(),
		year = date.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

function getWeekDayName(weekday){
	//console.log(weekday);
	weekday++;
	var weekdays = new Array(7);
	weekdays[0]=  "Sunday";
	weekdays[1] = "Monday";
	weekdays[2] = "Tuesday";
	weekdays[3] = "Wednesday";
	weekdays[4] = "Thursday";
	weekdays[5] = "Friday";
	weekdays[6] = "Saturday";

	return weekdays[weekday];
}

function getHandLTemp(item){
	var max=0, min=0,maxTemp="",minTemp="", long=0;

	$.each(item, function(j,detail){
			if(j==0){
				max = detail.temperatureValue;
				min = detail.temperatureValue;
				maxTemp = detail.temperature;
				minTemp =detail.temperature;
			}else{
				if(detail.temperatureValue>=max){
					max=detail.temperatureValue;
					maxTemp = detail.temperature;
				}else if(detail.temperatureValue<=min){
					min=detail.temperatureValue;
					minTemp =detail.temperature;
				}
			}
		});
		long = (max-min)*20;
		long += "px";

		return {
			long:long,
			max:maxTemp,
			min:minTemp
		}


}
