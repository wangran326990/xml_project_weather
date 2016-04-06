<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/1/2016
 * Time: 5:27 PM
 */

namespace weather\Controller;




use weather\Model\CurrentWeatherModel;
use weather\Model\WeatherForecast;

class WeatherHome
{

    public function __construct()
    {

    }

    public function index(){
        $currentWeather = new CurrentWeatherModel();
        $weatherForecast = new WeatherForecast();


       //
        //get weather by city name;
        //
      // $cw = $currentWeather->getCurrentWeather('Toronto');

       //get weather by lat and lon;
      //  $cw = $currentWeather->getCurrentWeather(['lat'=>43.5942778,'lon'=> -79.6622719]);



        //$weatherForecast->weatherForecast('Toronto',3);
        //$weatherForecast->weatherForecastNext3Hours('Toronto');
        $weatherForecast->weatherForecastNextDay(['lat'=>43.5942778,'lon'=> -79.6622719]);
        require_once "./View/WeatherHomeLoading.html";
        //var_dump($cw);
    }

    public function weatherInCurrentLocation($lat, $lon){
        $currentWeather = new CurrentWeatherModel();
        $weatherForecast = new WeatherForecast();
        $weatherFor3days = $weatherForecast->weatherForecast(['lat'=>$lat, 'lon'=>$lon],3);
        $weatherNext3Hours = $weatherForecast->weatherForecastNext3Hours(['lat'=>$lat, 'lon'=>$lon]);
        $weatherNestDay = $weatherForecast->weatherForecastNextDay(['lat'=>$lat, 'lon'=>$lon]);
        $cw = $currentWeather->getCurrentWeather(['lat'=>$lat, 'lon'=>$lon]);
        $weatherInfo = new \stdClass();

        $weatherInfo->weatherCurrent = $cw;
        $weatherInfo->weatherFor3days = $weatherFor3days;
        $weatherInfo->weatherNext3Hours = $weatherNext3Hours;
        $weatherInfo->weatherNextDay = $weatherNestDay;
        echo json_encode($weatherInfo);

    }

}