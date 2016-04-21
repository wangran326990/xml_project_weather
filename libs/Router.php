<?php
namespace weather\libs;
/**
 * Class Router, This class will find controller and action by compare the routeArray.
 * If find the controller and action, the action will be call
 *If not find the action 404 page will be showed.
 */
    Class Router{
        private $route;
        private $routeArray;
        public function __construct(){
//            echo "This is Router";
            $this->routeArray=[
                "WeatherHome"=>["index","weatherInCurrentLocation",'weatherSearch','findWeatherById','showAllCityFWeather','searchWeatherVideo']

            ];
            $this->route();
        }

        private function route(){
            $this->route =filter_input(INPUT_POST, 'route');
            if($this->route === NULL){

                    $this->route = filter_input(INPUT_GET,'route');
                    if($this->route === NULL){
                        $this->route=DEFAULT_ROUTE;
                }
            }
            $this->parseRoute();
        }



        private function parseRoute(){

            $this->route = explode("/",$this->route);
            //print_r($this->route);
            $controller = $this->route[0];
            $action = $this->route[1];
            $param=array_slice($this->route,2);

            //isset($this->route[2],$this->route)?$param=$this->route[2]:$param=null;
            $this->gotoAction($controller, $action, $param);

        }

        /*
         * going to specific controller and specific action
         * multi values /var1/var2/var3
         * $param[]
         */

        private function gotoAction($controllerName, $actionName, $param){

            $check =false;
            foreach($this->routeArray as $controller=>$actions){
//                    var_dump($controller);
//                    var_dump($controllerName);
                if($controller==$controllerName){

                    if(is_array($actions)){
                        foreach($actions as $action){
                            if($actionName == $action){
                                $check = true;

                                call_user_func_array(array(NAMESPACE_CONTROLLER.$controller,$action),$param);
                            }
                        }
                    }
                }

            }
            if($check==false){
                require_once "./View/Error404.php";
            }

        }


    }
?>