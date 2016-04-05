<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/5/2016
 * Time: 12:05 AM
 */

namespace weather\Model;

use Cmfcmf\OpenWeatherMap;
use Cmfcmf\OpenWeatherMap\Exception as OWMException;

class CurrentWeatherModel
{
   private static $owm;
    // Language of data (try your own language here!):
    //
    private $lang = '';

// Units (can be 'metric' or 'imperial' [default]):
    private $units = '';

    private $apiKey = OPENWEATHER_APIKEY;
    public function __construct($apiKey='', $lang='', $units=''){
        $this->apiKey = $apiKey!=''?$apiKey:OPENWEATHER_APIKEY;
        self::$owm = new OpenWeatherMap($this->apiKey);
        $this->lang = $lang!=''?$lang:'en';
        $this->units = $units!=''?$units:'imperial';

    }

    public function getCurrentWeather($query){
        $cw = [];
        $currentWeather = self::$owm->getWeather($query, $this->units, $this->lang);
        $cw['POP'] = $currentWeather->precipitation->getFormatted();
        $cw['temperature'] = $currentWeather->temperature->getFormatted();
        $cw['humidity'] = $currentWeather->humidity->getFormatted();
        $cw['pressure'] = $currentWeather->pressure->getFormatted();
        $cw['windspeed'] = $currentWeather->wind->speed->getFormatted();
        $cw['windDirect'] = $currentWeather->wind->direction->getDescription();
        $cw['weatherDescription']= $currentWeather->weather->description;
        $cw['weatherIcon'] = $currentWeather->weather->getIconUrl();

        return $cw;
    }
}