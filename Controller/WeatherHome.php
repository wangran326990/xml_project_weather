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

class WeatherHome
{

    public function __construct()
    {

    }

    public function index()
    {
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
        $weatherForecast->weatherForecastNextDay(['lat' => 43.5942778, 'lon' => -79.6622719]);
        require_once "./View/WeatherHomeLoading.html";
    }

    public function weatherInCurrentLocation($lat, $lon)
    {
        $currentWeather = new CurrentWeatherModel();
        $weatherForecast = new WeatherForecast();
        $weatherFor3days = $weatherForecast->weatherForecast(['lat' => $lat, 'lon' => $lon], 3);
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

    function weatherSearch($search){
        $citys=[
            'Hamilton'=>5969782,
            'Kingston'=>5992495,
            'Mississauga'=>6075357,
            'Niagara Falls'=>6087892,
            'Barrie'=>5894171,
            'Belleville'=>5897885,
            'Brampton'=>5907364,
            'Brant'=>5907983,
            'Brantford'=>5907990,
            'Brockville'=>5909294,
            'Burlington'=>4849826,
            'Cambridge'=>5913695,
            'Dryden'=>5942913,
            'Elliot Lake'=>5947866,
            'Greater Sudbury'=>5964700,
            'Guelph'=>5967629,
            'Haldimand County'=>5969093,
            'Kawartha Lakes'=>5989818,
            'Kenora'=>5991055,
            'Kitchener'=>5992996,
            'London'=>6058560,
            'Markham'=>2650379,
            'Norfolk County'=>6089125,
            'North Bay'=>6089426,
            'Orillia'=>6094325,
            'Oshawa'=>6094578,
            'Ottawa'=>6094817,
            'Owen Sound'=>6095645,
            'Pembroke'=>6100832,
            'Peterborough'=>6101645,
            'Pickering'=>6104111,
            'Port Colborne'=>6111704,
            'Prince Edward County'=>6113355,
            'Quinte West'=>6115355,
            'Sarnia'=>6141190,
            'Sault Ste. Marie'=>6141439,
            'St. Thomas'=>6158357,
            'Stratford'=>6157977,
            'Temiskaming Shores'=>6162659,
            'Thorold'=>6165719,
            'Thunder Bay'=>6166142,
            'Timmins'=>6166739,
            'Toronto'=>6167865,
            'Vaughan'=>4599503,
            'Waterloo'=>6176823,
            'Welland'=>6177869,
            'Windsor'=>6182958,
            'Woodstock'=>6184364

        ];

        $hint =[];
        if($search!=""){
            $search = strtolower($search);
            $len=strlen($search);
            foreach ($citys as $key=>$value){
                if (stristr($search, substr($key, 0, $len))) {
                    $hint[] = "<a href='#' name='$value' class='city'>$key</a>";
                }
            }
        }

        echo json_encode($hint);
    }

    function findWeatherById($id){
        $currentWeather = new CurrentWeatherModel();
        $weatherForecast = new WeatherForecast();
        $weatherFor3days = $weatherForecast->weatherForecast($id, 3);
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

    function showAllCityFWeather(){
        $allCityWeather = new getAllCityWeather();
        echo $allCityWeather->getCitiesWeather();
    }


}