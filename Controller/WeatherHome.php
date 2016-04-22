<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/1/2016
 * Time: 5:27 PM
 */

namespace weather\Controller;




use weather\Model\CurrentWeatherModel;
use weather\Model\getAllCityWeather;
use weather\Model\WeatherForecast;
use weather\Model\YouTubeAPIModel;

class WeatherHome
{
    static $citys=[];

    public function __construct()
    {

    }
    /*
     * website initialization

     *
     */
    public function index()
    {

        //$currentWeather = new CurrentWeatherModel();
        //$weatherForecast = new WeatherForecast();

       // $weatherForecast->weatherForecastNextDay(['lat' => 43.5942778, 'lon' => -79.6622719]);

        require_once "./View/WeatherHomeLoading.html";
    }

    /*
    * ajax call this function from weather.js
    *show current location weather report on the website.
    *
    */

    public function weatherInCurrentLocation($lat, $lon, $unit)
    {
        $currentWeather = new CurrentWeatherModel($unit);
        $weatherForecast = new WeatherForecast($unit);
        $weatherFor3days = $weatherForecast->weatherForecast(['lat' => $lat, 'lon' => $lon], 5);
        $weatherNext3Hours = $weatherForecast->weatherForecastNext3Hours(['lat' => $lat, 'lon' => $lon]);
        $weatherNestDay = $weatherForecast->weatherForecastNextDay(['lat' => $lat, 'lon' => $lon]);
        $cw = $currentWeather->getCurrentWeather(['lat' => $lat, 'lon' => $lon]);
        $weatherInfo = new \stdClass();

        $weatherInfo->weatherCurrent = $cw;
        $weatherInfo->weatherFor3days = $weatherFor3days;
        $weatherInfo->weatherNext3Hours = $weatherNext3Hours;
        $weatherInfo->weatherNextDay = $weatherNestDay;
        echo json_encode($weatherInfo);

    }

    /*
     * search function
     * using ajax call to get the hint when user typing
     *
     */
    function weatherSearch($search){
        self::convertJsonToArray();
        //var_dump(self::$citys);
        $hint =[];
        if($search!=""){
            $search = strtolower($search);
            $len=strlen($search);
            foreach (self::$citys as $key=>$value){
                if (stristr($search, substr($key,0,$len))) {
                    $hint[] = "<a href='#' name='$value' class='city'>$key</a>";
                }
            }
        }

        echo json_encode($hint);
    }

    /*
     * get city weather by city id
     * if find city
     * return a weather information json to js.
     *
     */
    function findWeatherById($id,$unit){
        $currentWeather = new CurrentWeatherModel($unit);
        $weatherForecast = new WeatherForecast($unit);
        $weatherFor3days = $weatherForecast->weatherForecast($id, 5);
        $weatherNext3Hours = $weatherForecast->weatherForecastNext3Hours($id);
        $weatherNestDay = $weatherForecast->weatherForecastNextDay($id);
        $cw = $currentWeather->getCurrentWeather($id);
        $weatherInfo = new \stdClass();

        $weatherInfo->weatherCurrent = $cw;
        $weatherInfo->weatherFor3days = $weatherFor3days;
        $weatherInfo->weatherNext3Hours = $weatherNext3Hours;
        $weatherInfo->weatherNextDay = $weatherNestDay;
        echo json_encode($weatherInfo);
    }

    /*
     * find all cities weather conditions in cities array and send it back to js
     *
     */

    function showAllCityFWeather($unit){
        $allCityWeather = new getAllCityWeather();
        echo $allCityWeather->getCitiesWeather($unit);
    }

    /*
     * search city weather video by city name
     *
     */

    function searchWeatherVideo($cityName){
          $weatherReportVideo = new YouTubeAPIModel();
          echo $weatherReportVideo->SearchVideo($cityName);
    }

    /*
     * change canada cities information from CanadaCity.json to array
     *
     *
     */

    static function convertJsonToArray(){
        $string = file_get_contents("./City/CanadaCity.json");
        $citys = json_decode($string, true);
        //var_dump($citys);
        foreach($citys as $city){
            self::$citys[$city['name']]= $city['_id'];
        }

       // var_dump(self::$citys);
    }


}