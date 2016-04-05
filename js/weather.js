$(document).ready(
	function(){
		hideWeatherDetail();
	}
);
	



function hideWeatherDetail(){
	$(".weather-desc").hide();
	$(".button-image").click(
		function(){
		//$(".weather-desc").slideUp(400);
			var $selected =$(this).parent().parent().next();
			$(".weather-desc").not($selected).slideUp(400);
			$selected.slideToggle(400);
		});	
}