<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/7/2016
 * Time: 1:43 AM
 */

namespace weather\Model;


use Cmfcmf\OpenWeatherMap\Fetcher\CurlFetcher;

class getAllCityWeather
{
    private $citys;
    private $url = "http://api.openweathermap.org/data/2.5/group?";
    private $fetcher;
    private $apiKey = '';
    public function __construct($apiKey='')
    {
       $this->citys=[
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
        //$this->convertJsonToArray();
        $this->apiKey = $apiKey!=''?$apiKey:OPENWEATHER_APIKEY;
        $this->fetcher = new CurlFetcher();
    }

    public function getCitiesWeather($units = 'imperial', $lang = 'en', $appid = ''){
        $url = self::CombineUrl();
        $url.="&units=$units";
        $url.="&lang=$lang";
        if($appid==''){
            $url.="&appid=$this->apiKey";
        }else{
            $url.="&appid=$appid";
        }
        //var_dump($url);
       $content = $this->fetcher->fetch($url);
       return $content;
    }

    private function CombineUrl(){
        $id ="id=";
        $id.=implode(',',$this->citys);
        return $this->url.$id;
    }

    private function convertJsonToArray(){
        $string = file_get_contents("./City/CanadaCity.json");
        $citys = json_decode($string, true);
        //var_dump($citys);
        foreach($citys as $city){
            $this->citys[$city['name']]= $city['_id'];
        }

        // var_dump(self::$citys);
    }
}