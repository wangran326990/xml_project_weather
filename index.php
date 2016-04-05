<?php
/**
 * Created by PhpStorm.
 * User: ran
 * Date: 4/4/2016
 * Time: 11:42 PM
 */




// Must point to composer's autoload file.
require './libs/OpenWeatherAPI/vendor/autoload.php';
require_once './autoloader.php';
require_once "./config.php";


use weather\libs\Router;
new Router();