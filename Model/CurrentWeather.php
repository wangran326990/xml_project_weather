<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/4/2016
 * Time: 1:17 AM
 */

namespace weather_website\Model;

use weather_website\libs\Unite\City;
use weather_website\libs\Unite\Sun;
use weather_website\libs\Unite\Temperature;
use weather_website\libs\Unite\Unit;
use weather_website\libs\Unite\Weather;
use weather_website\libs\Unite\Wind;

class CurrentWeather
{
    public $city;

    public $temperature;

    public $humidity;

    public $pressure;

    public $wind;

    public $clouds;

    public $precipitation;

    public $weather;

    public $lastUpdate;

    public function __construct($xml, $units){
        $this->city = new City($xml->city['id'],$xml->city['name'],$xml->coord['lon'],$xml->coord['lat'],$xml->country);
        $this->temperature = new Temperature(new Unit($xml->temperature['min'],$xml->temperature['unit']),
                                             new Unit($xml->temperature['max'],$xml->temperature['unit']),
                                             new Unit($xml->temperature['value'],$xml->temperature['unit'])

        );
        $this->humidity = new Unit($xml->humidity['value'],$xml->humidity['unit']);
        $this->pressure = new Unit($xml->pressure['value'],$xml->pressure['unit']);
        if($units =='metric'){
            $windSpeedUnit = 'm/s';

        }else{
            $windSpeedUnit = 'mph';
        }

        $this->wind = new Wind(new Unit($xml->wind->speed['value'], $windSpeedUnit, $xml->wind->speed['name']), new Unit($xml->wind->direction['value'], $xml->wind->direction['code'], $xml->wind->direction['name']));
        $this->clouds = new Unit($xml->clouds['value'], null, $xml->clouds['name']);
        $this->precipitation = new Unit($xml->precipitation['value'], $xml->precipitation['unit'], $xml->precipitation['mode']);
        $utctz = new \DateTimeZone('UTC');
        $this->sun = new Sun(new \DateTime($xml->city->sun['rise'], $utctz), new \DateTime($xml->city->sun['set'], $utctz));
        $this->weather = new Weather($xml->weather['number'], $xml->weather['value'], $xml->weather['icon']);
        $this->lastUpdate = new \DateTime($xml->lastupdate['value'], $utctz);

    }
}