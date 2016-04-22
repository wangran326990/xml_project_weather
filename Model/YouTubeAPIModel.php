<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/8/2016
 * Time: 1:59 PM
 */

namespace weather\Model;


use Cmfcmf\OpenWeatherMap\Fetcher\CurlFetcher;

class YouTubeAPIModel
{
    private $searchUrl="https://www.googleapis.com/youtube/v3/search?";
    private $part = "snippet";
    private $q = '';
    private $apiKey ='';
    private $fetcher ='';
    public function __construct($part='',$q='', $apiKey=''){
        $this->part = $part!=''?$part:"snippet";
        $this->q = $q;
        $this->apiKey = $apiKey!=''?$apiKey:"AIzaSyD03BUPUsVOstRlUIYbE-SwoED9Z0vRZl8";
    }

/*
 * build url
 *
 */


    public function urlBuilder($url){
        $url.="part=$this->part";
        $url.="&q=$this->q";
        $url.="&key=$this->apiKey";

        return $url;
    }

    /**
     * @param $cityName
     * @return video result
     *
     */

    public function SearchVideo($cityName){
        $this->q = $cityName . " Weather Report";
        $this->q=urlencode($this->q);
        $url = $this->urlBuilder($this->searchUrl);
        //var_dump($url);
        //  Initiate curl
        $result = $this->curlFetcher($url);

        return $result;
    }

    public function curlFetcher($url){
        $ch = curl_init();
// Disable SSL verification
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Will return the response, if false it print the response
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Set the url
        curl_setopt($ch, CURLOPT_URL,$url);
// Execute
        $result=curl_exec($ch);
// Closing
        curl_close($ch);

// Will dump a beauty json :3
        return $result;
    }
}