var currentWeather;
var weatherFordays;
var weatherNext3Hours;
var weatherNextDay;
var markers=[];
var map;
var unit='imperial';
var unitAbb='F';
//var googleInfoWindow;

var citys={};



function init(){


		currentLocation();
		getWeatherInfoByCity();
		hideWeatherDetail();
		searchCity();
		showAllCityWeatherOnMap();
		submitFormOperation();
		changeUnit();

		//createVideo();
		getCitiesArray();
		loadGoogleChart();

}

/**
 * get current location
 */

function currentLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(getWeatherInfo);

	}
}

/**
 * prevent form submit and return search result by ajax
 *
 */

function submitFormOperation(){
	$("#searchform").submit(
		function() {

			var flag=0;
			var city=$("#searchBox").val();
			$("#searchBox").val('');
			console.log(city);
			$.each(citys, function(i,id){
				if(city.toUpperCase()=== i.toUpperCase()){
					$("#currentCity").html('');
					$("#currentCity").css("color","white");
					ajaxCityWeather(id,unit);
					flag=1;
				}
			});
			if(flag==0){
				$("#currentCity").css("color","red").html("no matched city");
			}

			return false;
		}
	)
}

/**
 *
 * @param position
 *
 * get Weatheer information by latitude and Longitude
 */

function getWeatherInfo(position){
	$url ="./index.php?route=WeatherHome/weatherInCurrentLocation/"+position.coords.latitude+'/'+position.coords.longitude+'/'+unit;
	//console.log($url);
	var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
	$.get($url,function(data, status){
		var obj = JSON.parse(data);
		console.log(obj);
		currentWeather= obj.weatherCurrent;
		weatherFordays= obj.weatherFor3days;
		weatherNext3Hours = obj.weatherNext3Hours;
		weatherNextDay =obj.weatherNextDay;
		var content = displayCurrentWeatherMap(currentWeather);
		displayCurrentWeather(currentWeather);
		displayNext3Hours(weatherNext3Hours);
		displayNextDay(weatherNextDay);
		displayNextDays(weatherFordays);
		//console.log(currentWeather.city);
		//////add chart/////////////////
		//loadGoogleChart();
		//getObjectValue();
		drawChart();
		////////////////////////////////
		ajaxYouTube(currentWeather.city);
		map.setCenter(pos);
		 var googleInfoWindow = getInfoWindow(content);
		var marker = getMarker(map,pos,currentWeather.weatherIcon, currentWeather.city);
		//console.log(marker);
		 marker.addListener('click', function() {
			googleInfoWindow.open(map, marker);
		});
		//ajaxYouTube()
	});
}

/**
 *
 * get City weather information by city id
 */

function getWeatherInfoByCity(){
	$("body").on("click",".city",function(){
		var id = $(this).attr("name");
		ajaxCityWeather(id,unit);
		$("#currentCity").css("color","white");
		$("#livesearch").html("");
	});
}

/**
 *
 * get City weather information by city id
 * ajax get infomation
 */

function ajaxCityWeather(id,unit){
	var url= "./index.php?route=WeatherHome/findWeatherById/"+id+"/"+unit;
	//console.log(url);
	$.get(url, function(data,success){
		var obj = JSON.parse(data);
		//console.log(obj);
		//


		currentWeather= obj.weatherCurrent;
		weatherFordays= obj.weatherFor3days;
		weatherNext3Hours = obj.weatherNext3Hours;
		weatherNextDay =obj.weatherNextDay;
		ajaxYouTube(currentWeather.city);
		deleteMarkers();
		var pos = {
			lat: currentWeather.lat,
			lng: currentWeather.lon
		};
		var content = displayCurrentWeatherMap(currentWeather);
		displayCurrentWeather(currentWeather);
		displayNext3Hours(weatherNext3Hours);
		displayNextDay(weatherNextDay);
		displayNextDays(weatherFordays);
		map.setCenter(pos);
		map.setZoom(13);
		var googleInfoWindow = getInfoWindow(content);
		var marker = getMarker(map,pos,currentWeather.weatherIcon,currentWeather.city);
		marker.setPosition(pos);
		marker.addListener('click', function() {
			googleInfoWindow.open(map, marker);
		});
		drawChart();
	})
}

/**
 * when click show ontarian weather button in the website
 * return weather information of all the cities
 *
 */


function showAllCityWeatherOnMap(){
	$('.F-button').click(function(){
		var url= "./index.php?route=WeatherHome/showAllCityFWeather/"+unit;
		console.log(url);
		$.get(url, function(data,success){
			var obj =JSON.parse(data);
			//console.log(obj);

			displayCitisWeahterOnMap(obj,unitAbb);
		})
	})
}

/**
 *
 * @param obj
 * @param units
 * display Cities Weather on google map
 */

function displayCitisWeahterOnMap(obj,units){
	console.log(units);
	$.each(obj.list, function(i,item){
		//console.log(item);
		var content ='';
		var weather =item.weather[0];
		var pos = {
			lat: item.coord.lat,
			lng: item.coord.lon
		};
		var iconLink = "http://openweathermap.org/img/w/"+weather.icon+".png";

		content +="<div><h5>"+item.name+"</h5>";
		content +="<p>"+item.main.temp+" "+units+"</p>";
		content +="<p>"+weather.description+"</p></div>";

		var googleInfoWindow = getInfoWindow(content);
		var marker = getMarker(map, pos, iconLink, item.name);
		map.setZoom(5);
		//console.log(marker);
		marker.addListener('click', function() {
			googleInfoWindow.open(map, marker);
		});


	});


}

/**
 * show or hide weather detial on the page
 */

function hideWeatherDetail(){

	$("body").on("click",".button-image",function(event){
		//alert('');
		//$(".weather-desc").slideUp(400);
		var $selected =$(this).parent().parent().next();
		$(".weatherHide").not($selected).slideUp(400);
		$selected.slideToggle(400);
	});

}
/**
 *
 * display current weather on the page
 * @param currentWeather
 * @returns {string}
 */

function displayCurrentWeather(currentWeather){
		//console.log(currentWeather);
		var html ="";
		$("#currentCity").html(currentWeather.city);
		html ="<div class='row'><div class='col-md-3'><img src="+"'"+currentWeather.weatherIcon+"'"+"/></div>";
		html+="<div class='col-md-9'><span class='temp-font'>"+currentWeather.temperature+"</span></div></div>";
		html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+currentWeather.windspeed+" "+currentWeather.weatherDescription+"</p></div>";
		$("#currentWeather").removeClass('Loading').html(html);
		//console.log(html);
		return html;

}

/**
 *
 * display current weather on the map
 * @param currentWeather
 * @returns {string}
 */

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

/**
 * display weather of Next 3 hours
 * @param Weather
 */

function displayNext3Hours(Weather){
	//console.log(Weather);
	var html ="";

	html = "<div class='row'><div class='col-md-3'><img src="+"'"+Weather.Next3Hours.weather.iconUrl+"'"+"/></div>";
	html+="<div class='col-md-9'><span class='temp-font'>"+Weather.Next3Hours.temperature+"</span></div></div>";
	html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+Weather.Next3Hours.windSpeed+" "+Weather.Next3Hours.weather.Description+"</p></div>";
	$("#Next3HourWeather").removeClass('Loading').html(html);

}

/**
 * display weather of Next day
 * @param Weather
 */
function displayNextDay(Weather){
	//console.log(Weather);
	var html ="";

	html = "<div class='row'><div class='col-md-3'><img src="+"'"+Weather.NextDay.weather.iconUrl+"'"+"/></div>";
	html+="<div class='col-md-9'><span class='temp-font'>"+Weather.NextDay.temperature+"</span></div></div>";
	html+="<div class='row'><p class='col-lg-12 desc'>"+"windspeed "+Weather.NextDay.windSpeed+" "+Weather.NextDay.weather.Description+"</p></div>";
	$("#NextDayWeather").removeClass('Loading').html(html);

}

/**
 * display weather of Next days
 * @param Weather
 */

function displayNextDays(Weather){
	//console.log(Weather);
	var date = new Date();
	var html="";
	var objweather ={};

	$.each(Weather,function(i,item){
		//console.log(i);
		html +="<div class='weather-detail'><div class='row weather-decoration'><div class='col-sm-2'>";
		if(formatDate(date) == i) {
			html += "<h4>Today</h4></div>";
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
		html+="</div>";
	});

	$("#next-five").html(html);
	$(".weatherHide").hide();
}

/**
 * change date format
 * @param date
 * @returns {string}
 */

function formatDate(date) {
	var
		month = '' + (date.getMonth() + 1),
		day = '' + date.getDate(),
		year = date.getFullYear();

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
}

/**
 * change date into Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturay;
 * @param weekday
 * @returns {*}
 */

function getWeekDayName(weekday){
	//console.log(weekday);
	weekday++;
	var weekdays = new Array(7);
	weekdays[7]=  "Sunday";
	weekdays[1] = "Monday";
	weekdays[2] = "Tuesday";
	weekdays[3] = "Wednesday";
	weekdays[4] = "Thursday";
	weekdays[5] = "Friday";
	weekdays[6] = "Saturday";

	return weekdays[weekday];
}
/**
 * get min and max temperatures
 *
 * @param item
 * @returns {{long: number, max: string, min: string}}
 */
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
		long = (max-min)*6;
		long += "px";

		return {
			long:long,
			max:maxTemp,
			min:minTemp
		}

}
/**
 * Search function
 *
 *
 */
function searchCity(){
	$('#searchBox').keyup(function(){
		var hint='';
		var str = $(this).val();
		$url = "./index.php?route=WeatherHome/weatherSearch/"+str;
		//console.log($url);
		$.get($url, function(date){
			var obj	=JSON.parse(date);
			//console.log(obj);
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
/**
 * init google map
 *
 */


function initMap() {

	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,
		center:{lat: -34.397, lng: 150.644}
	});
	init();
	//var country = "Canada";

 			//getCurrentLocation(map);
}


//function MapByCountry(country){
//	var geocoder;
//	geocoder = new google.maps.Geocoder();
//	geocoder.geocode( {'address' : country}, function(results, status) {
//		if (status == google.maps.GeocoderStatus.OK) {
//			map.setCenter(results[0].geometry.location);
//		}
//	});
//}
/**
 *
 * create a marker on google map
 * @param map
 * @param pos
 * @param icon
 * @param title
 * @returns {google.maps.Marker}
 */


function getMarker(map,pos,icon,title) {

			var markerMap = new google.maps.Marker({
				map: map,
				animation: google.maps.Animation.DROP,
				position: pos,
				icon: icon,
				title:title
			});
			//markerMap.addListener('click', toggleBounce);
			markers.push(markerMap);
			return markerMap;

}

/**
 * create information Window for marker on google map
 * @param info
 * @returns {google.maps.InfoWindow}
 */
function getInfoWindow(info){
	 var infowindow = new google.maps.InfoWindow({
		content: info
	});
	return infowindow;
}


//function getCurrentLocation(){
//	if (navigator.geolocation) {
//		navigator.geolocation.getCurrentPosition(function (position) {
//			var pos = {
//				lat: position.coords.latitude,
//				lng: position.coords.longitude
//
//			};
//
//			map.setCenter(pos);
//
//		})
//	}
//}

/**
 * clear all markers
 *
 * @param map
 */
function setMapOnAll(map) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

function clearMarkers() {
	setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
	clearMarkers();
	markers = [];
}

/*
	change between F and C.
 */
function changeUnit() {
	$('.f').click(
		function () {

			unit = "imperial";
			unitAbb = 'F';
			$('.c').removeClass('selected');
			$(this).removeClass('selected');
			$(this).addClass('selected');
			map.setZoom(13);
			deleteMarkers();
			currentLocation();
		}
	);

	$('.c').click(
		function () {
			unit = "metric";
			unitAbb = 'C';
			$('.f').removeClass('selected');
			$(this).removeClass('selected');
			$(this).addClass('selected');
			map.setZoom(13);
			deleteMarkers();
			currentLocation();
		}
	);

}


//YOUTUBE API

/**
 *
 * get video info from php
 * @param cityName
 */
function ajaxYouTube(cityName){
	//console.log(cityName);
	url="./index.php?route=WeatherHome/searchWeatherVideo/"+cityName;
	console.log(url);
	$.get(url, function(data, success){
			var obj = JSON.parse(data);
			var html = creatVideos(obj,2);
			$('#videos').html(html);
	})
}

/**
 * Great Video on web page
 * @param obj
 * @param number
 * @returns {string}
 */

function creatVideos(obj,number){
	var html="";
	//console.log(obj);
	$.each(obj.items, function(i,video){
		if(i<number) {
			console.log(video);
			var url = "https://www.youtube.com/embed/" + video.id.videoId;
			html += "<div class='col-lg-6'><h3>"+video.snippet.title+"</h3><iframe type='text/html' style='width:100%' height='390' src=" + "'" + url + "'" + "></iframe></div>";
		}
	});
	return html;
}

//parse CanadaCity.json convert it to array

function getCitiesArray(){
	$.get("./City/CanadaCity.json", function(data){
		//console.log(data);
		citys={};
		$.each(data, function(i,city){
			//console.log(city);

			citys[city.name] = city._id;

		});
		//console.log(citys);
	});
}



//////////Google Chart API
/**
 * Load Goolge Chart and Call drowChart function
 *
 */

function loadGoogleChart(){
	google.charts.load('current', {'packages':['corechart']});
	google.charts.setOnLoadCallback(drawChart);
}
/**
 *
 * draw a Line chart for temperature.
 */

function drawChart() {
	//weatherFordays
	var temperatures =getObjectValue();
//	console.log(temperatures);
	var data = google.visualization.arrayToDataTable(temperatures);

	var options = {
		title: 'Company Performance',
		curveType: 'function',
		legend: { position: 'bottom' },
		backgroundColor: '#F8F8F8',
		is3D: true
	};

	var chart = new google.visualization.LineChart(document.getElementById('displayChart'));

	chart.draw(data, options);
}

/**
 * get data for drow chart.
 *
 * @returns {*[]}
 */

function getObjectValue() {
	var temperature = [['Date','Temperature']];
	for (var key in weatherFordays) {
		var array = [key,weatherFordays[key][0].temperatureValue];
		temperature.push(array);
	}
	//console.log(temperature);
	return temperature;
}

$(window).resize(function(){
	drawChart();
});