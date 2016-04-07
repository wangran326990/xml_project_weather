var currentWeather;
var weatherFordays;
var weatherNext3Hours;
var weatherNextDay;
//var marker;
var map;
//$(document).ready(
//	function(){
//
//		//hideWeatherDetail();
//		if(navigator.geolocation){
//			navigator.geolocation.getCurrentPosition(getWeatherInfo);
//		}else{
//
//		}
//		hideWeatherDetail();
//		searchCity();
//	}
//);


function init(){

		//hideWeatherDetail();
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(getWeatherInfo);
		}else{

		}
		getWeatherInfoByCity();
		hideWeatherDetail();
		searchCity();
}
	

function getWeatherInfo(position){
	$url ="./index.php?route=WeatherHome/weatherInCurrentLocation/"+position.coords.latitude+'/'+position.coords.longitude;
	console.log($url);
	var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
	$.get($url,function(data, status){
		var obj = JSON.parse(data);
		//console.log(obj);
		currentWeather= obj.weatherCurrent;
		weatherFordays= obj.weatherFor3days;
		weatherNext3Hours = obj.weatherNext3Hours;
		weatherNextDay =obj.weatherNextDay;
		var content = displayCurrentWeatherMap(currentWeather);
		displayCurrentWeather(currentWeather);
		displayNext3Hours(weatherNext3Hours);
		displayNextDay(weatherNextDay);
		displayNextDays(weatherFordays);
		map.setCenter(pos);
		var googleInfoWindow = getInfoWindow(content);
		var marker = getMarker(map,pos);
		console.log(marker);
		marker.addListener('click', function() {
			googleInfoWindow.open(map, marker);
		});

	});
}


function getWeatherInfoByCity(){
	$(".city").click(function(){
		var id = $(this).attr("name");
		var url= "./index.php?route=WeatherHome/findWeatherById/"+id;
		$.get(url, function(data,success){
			var obj = JSON.parse(data);
			console.log(obj);
		})
	});
}

//function getCurrentWeatherInfo(position, map){
//	//var content;
//	$url ="./index.php?route=WeatherHome/weatherInCurrentLocation/"+position.lat+'/'+position.lng;
//	console.log($url);
//	$.get($url,function(data, status){
//		var obj = JSON.parse(data);
//		//console.log(obj);
//		var currentWeather1 = obj.weatherCurrent;
//		content = displayCurrentWeather(currentWeather1);
//		var googleInfoWindow = getInfoWindow(content);
//		var marker = getMarker(map,position);
//		console.log(marker);
//		marker.addListener('click', function() {
//			googleInfoWindow.open(map, marker);
//		});
//	});
//
//
//}




function hideWeatherDetail(){

	$("body").on("click",".button-image",function(event){
		//alert('');
		//$(".weather-desc").slideUp(400);
		var $selected =$(this).parent().parent().next();
		$(".weatherHide").not($selected).slideUp(400);
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
		//console.log(html);
		return html;

}

function displayCurrentWeatherMap(currentWeather){
	//console.log(currentWeather);
	var html ="";

	html ="<img src="+"'"+currentWeather.weatherIcon+"'"+"/>";
	html+="<span class='temp-font'>"+currentWeather.temperature+"</span>";
	html+="<p class='desc'>"+"windspeed "+currentWeather.windspeed+" "+currentWeather.weatherDescription+"</p>";
	$("#currentWeather").removeClass('Loading').html(html);
	//console.log(html);
	return html;

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
		html +="<div class='row weatherHide'>"
		$.each(item, function(j,detail){
			html += "<div class='col-md-3 weather-daily weather-desc'><div class='row'><div class='col-lg-12'>";
			html +="<h4>from:"+detail.from+" to:"+detail.to+"</h4>";
			html +="<p>"+detail.weather.Description+"</p>";
			html +="<p><img src= "+"'"+detail.weather.iconUrl+"'"+"></p>";
			html +="<p><span>humidity:</span>"+detail.humidity+"</p>";
			html +="<p><span>pressure:</span>"+detail.pressure+"</p>";
			html +="<p><span>temperature:</span>"+detail.temperature+"</p>";
			html +="<p><span>wind:</span>"+detail.windDirection+" "+detail.windSpeed+"</p>";
			html +="<p><span>cloud:</span>"+detail.cloud.Description+" "+detail.cloud.Value+"</p></div></div></div>";
		});
		html +="</div>";
	});
	html+="</div>";
	$("#next-five").html(html);
	$(".weatherHide").hide();
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

function searchCity(){
	$('#searchBox').keyup(function(){
		var hint='';
		var str = $(this).val();
		$url = "./index.php?route=WeatherHome/weatherSearch/"+str;
		$.get($url, function(date){
			var obj	=JSON.parse(date);
			for(var i=0; i<obj.length; i++){
				hint +="<p>"+obj[i]+"</p>";
			}
			$("#livesearch").css("1px solid #A5ACB2");
			$("#livesearch").html(hint);
		})
	})

}


//Google Map API

// The following example creates a marker in Stockholm, Sweden using a DROP
// animation. Clicking on the marker will toggle the animation between a BOUNCE
// animation and no animation.



function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center:{lat: -34.397, lng: 150.644}
	});
	init();
	//var country = "Canada";

 			//getCurrentLocation(map);
}


function MapByCountry(country){
	var geocoder;
	geocoder = new google.maps.Geocoder();
	geocoder.geocode( {'address' : country}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
		}
	});
}



function getMarker(map,pos) {

			marker = new google.maps.Marker({
				map: map,
				draggable: true,
				animation: google.maps.Animation.DROP,
				position: pos
			});
			marker.addListener('click', toggleBounce);
			return marker;

}

function toggleBounce() {
	if (marker.getAnimation() !== null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

function getInfoWindow(info){
	var infowindow = new google.maps.InfoWindow({
		content: info
	});
	return infowindow;
}


function getCurrentLocation(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude

			};

			map.setCenter(pos);

		})
	}
}