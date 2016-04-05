<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/4/2016
 * Time: 1:31 AM
 */

namespace weather_website\Model;

use weather_website\libs\CurlFetcher;


class openWeatherMap
{
    private $weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?';
    private $fetcher;
    private $apiKey="";

    public function __construct($apiKey=''){
        if(!is_string($apiKey) || empty($apiKey)){
            $this->apiKey = OPENWEATHER_APIKEY;
        }else{
            $this->apiKey = $apiKey;
        }

        $fetcher = new CurlFetcher();

        $this->fetcher = $fetcher;
    }

    public function getApiKey(){
        return $this->apiKey;
    }

    //get current weather

    public function getWeather($query, $units ='imperial', $lang='en', $appid = '' ){
        $answer = $this->getRawWeatherData($query, $units, $lang, $appid, 'xml');

        $xml = $this->parseXML($answer);

        return new CurrentWeather($xml, $units);
    }



    public function getRawWeatherData($query, $units = 'imperial', $lang = 'en', $appid = '', $mode = 'xml'){
        $url = $this->buildUrl ($query, $units, $lang, $appid, $mode, $this->weatherUrl);
        return $this->fetchResult($url);
    }

    public function buildUrl($query, $units, $lang, $appid, $mode, $url){
        $queryUrl = $this->buildQueryUrlParameter($query);
        $url = $url."$queryUrl&units=$units&lang=$lang&mode=$mode&APPID=";
        $url .=empty($appid) ? $this->apiKey : $appid;

        return $url;
    }

    private function buildQueryUrlParameter($query){
        switch ($query){
            case is_array($query) && isset($query['lat']) && isset($query['lon']) && is_numeric($query['lat']) && is_numeric($query['lon']);
                return "lat={$query['lat']}&lon={$query['lon']}";
            case is_numeric($query):
                return "id=$query";
            case is_string($query):
                return 'q='.urlencode($query);
            default:
                return 'error';
        }
    }

    private function parseXML($answer){
        try{
            return new \SimpleXMLElement($answer);
        }catch(\Exception $e){
            echo 'Caught exception: ', $e->getMessage(), "\n";
        }
    }

    private function fetchResult($url){
        $result = $this->fetcher->fetcher($url);
        return $result;
    }


}
