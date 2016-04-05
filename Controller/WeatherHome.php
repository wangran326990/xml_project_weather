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



        $weatherForecast->weatherForecast('Toronto');

        //var_dump($cw);
    }

}