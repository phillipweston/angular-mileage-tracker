var app = angular.module("mileageTracker", ['ui.date']);

app.controller("TripCrtl", function ($scope){

	$scope.newTrip = {};
	$scope.exportTrips = {};
	$scope.trips = [];

	var Trip = $data.define("Trip", {
		origin: String,
		destination: String,
		miles: Number,
		date: Date		
	});

	Trip.readAll().then(function(trips){
		$scope.$apply(function(){
			$scope.trips = trips;
		});
	});

	$scope.addTrip = function(trip) {

		Trip.save(trip).then(function(trip){
			$scope.$apply(function(){
				$scope.trips.push(trip);
				$scope.newTrip = {};
			});
		});
	};

	$scope.remove = function(trip) {
		trip.remove()
			.then(function(){
				$scope.$apply(function(){
					var trips = $scope.trips;
					trips.splice(trips.indexOf(trip), 1);
				});
			})
			.fail(function(){
				alert("Error deleting trip.");
			});
	}

	$scope.copy = function(trip) {
		var copy = angular.copy(trip);

		$scope.newTrip = {
				origin: copy.origin, 
				destination: copy.destination, 
				miles: copy.miles
		}
	}

	$scope.export = function(exportTrips) {
		var numTrips = parseInt($scope.trips.length);
		var range = parseInt(exportTrips.end - exportTrips.start);
		var start = parseInt(exportTrips.start);
		var average = range / numTrips;
		var csvString = '';

		var sortedTrips = _.sortBy($scope.trips, 'date');

		angular.forEach(sortedTrips, function(trip){
			var miles = parseInt(trip.miles);
			trip.start = start;
			trip.end = start + miles;
			start += average - miles;
			
			var curr_date = trip.date.getDate();
    	var curr_month = trip.date.getMonth() + 1;
    	var curr_year = trip.date.getFullYear();
    	var date = curr_year + '-' + curr_month + '-' + curr_date;

			csvString += trip.origin + ',';
			csvString += trip.destination + ',';
			csvString += Math.floor(trip.start) + ',';
			csvString += Math.floor(trip.end) + ',';
			csvString += date + ',';
			csvString += '\n';
		});

		var fileName = 'hehehe.csv';
		var dataUrl = 'data:text/csv;utf-9,' + encodeURI(csvString);
	  var link = document.createElement('a');
	  angular.element(link)
	    .attr('href', dataUrl)
	    .attr('download', fileName)
	  link.click();
	}

});