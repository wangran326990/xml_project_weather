<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/5/2016
 * Time: 1:34 AM
 */

namespace weather\Model;


use Cmfcmf\OpenWeatherMap;

class WeatherForecast
{

    private static $owm;
    // Language of data (try your own language here!):
    //
    private $lang = '';

// Units (can be 'metric' or 'imperial' [default]):
    private $units = '';

    private $apiKey = OPENWEATHER_APIKEY;

    private $day;
    public function __construct($units='',$day=5, $apiKey='', $lang=''){
        $this->apiKey = $apiKey!=''?$apiKey:OPENWEATHER_APIKEY;
        self::$owm = new OpenWeatherMap($this->apiKey);
        $this->lang = $lang!=''?$lang:'en';
        $this->units = $units!=''?$units:'imperial';
        $this->day = $day;
    }
    /*
     * get weather report less 5 days every 3 hours;
     *
     */
    public function weatherForecast($query,  $days){

           $weatherForecast = self::$owm->getWeatherForecast($query,$this->units,$this->lang,$this->apiKey, $this->day);
           $forecastDate =[];
           foreach($weatherForecast as $forecast){
               //var_dump($forecast);
               $Date=$forecast->time->day->format('Y-m-d');
               $forecastDate[$Date]=[];

           }
            foreach ($forecastDate as $key=>$value) {
                $count = 0;
                foreach ($weatherForecast as $forecast) {
                    if ( $key == $forecast->time->day->format('Y-m-d')) {
                        $current = $forecast;
                            $forecastDate[$key][$count] = new \stdClass();
                            $forecastDate[$key][$count]->from = $current->time->from->format('H:i:s');
                            $forecastDate[$key][$count]->to = $current->time->to->format('H:i:s');
                            $forecastDate[$key][$count]->temperature = $current->temperature->now->getFormatted();
                            $forecastDate[$key][$count]->humidity = $current->humidity->getFormatted();
                            $forecastDate[$key][$count]->pressure = $current->pressure->getFormatted();
                            $forecastDate[$key][$count]->windSpeed = $current->wind->speed->getFormatted();
                            $forecastDate[$key][$count]->windDirection = $current->wind->direction->getDescription();
                            $forecastDate[$key][$count]->cloud = ['Value' => $current->clouds->getFormatted(),
                                                                  'Description' => $current->clouds->getDescription()];
                            $forecastDate[$key][$count]->weather = ['Description' => $current->weather->description,
                                'icon' => $current->weather->icon,
                                'iconUrl' => $current->weather->getIconUrl()];
                            $forecastDate[$key][$count]->temperatureValue = $current->temperature->getValue();
                        $count++;
                    }
                }


            }
            $forecastWeather=[];
            foreach ($forecastDate as $key=>$value){

                $days--;
                $forecastWeather[$key] = $value;
                if($days==0){
                    break;
                }
            }

            return $forecastWeather;


    }

    /*
     * get weather report for next 3 hours
     *
     */
    public function weatherForecastNext3Hours($query){
        $forecastNext3Hours =[];
       $forecastWeather =  $this->weatherForecast($query, 1);
        foreach ($forecastWeather as $key=>$value){

            $forecastNext3Hours["Next3Hours"]=$value[0];
            break;
        }
        return $forecastNext3Hours;

    }

    public function weatherForecastNextDay($query){
        $forecastNextDay =[];
        $forecastWeather =  $this->weatherForecast($query, 4);
        $date =date('Y-m-d');
        $NextDate =  date('Y-m-d', strtotime($date .' +1 day'));
        //var_dump($NextDate);
        foreach ($forecastWeather as $key=>$value){
            if($NextDate ==$key) {
                $forecastNextDay["NextDay"] = $value[0];
                break;
            }
        }
        return $forecastNextDay;

    }

}