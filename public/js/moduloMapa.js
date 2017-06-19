var app= angular.module('moduloMapa', ['uiGmapgoogle-maps'])
 .controller('mainCtrl', function ($scope, latitudService) {
    $scope.data = latitudService.data;
    latitudService.update('','');


    
    angular.extend($scope, {
        map: {
            center: {
                latitude: -38.7167,
                longitude:-62.2833
            },
            zoom: 13,
            markers: [],
            events: {
            click: function (map, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(),lon = e.latLng.lng();
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: lat,
                        longitude: lon
                    }
                };
                //$scope.map.markers.push(marker);
                $scope.map.markers[0]=marker;
                $('html, body').animate({
                scrollTop: $('#formulario').offset().top
                }, 'slow');    
                latitudService.update(marker.coords.latitude,marker.coords.longitude);
                
                //console.log($scope.map.markers);
                $scope.$apply();
            }
        }
        }
    });
})
.controller('mostrarLugares', function ($scope , $http) {
 $scope.map = { 
      center: {
                latitude: -38.7167,
                longitude:-62.2833
            },
      zoom: 13
   };
$scope.markers = [];
   
  $http.get("/lugares")
   .then(function(response) {
     var markers = response.data;
     _.forEach(markers, function(marker) {
       marker.coords = {
         latitude: marker.latitude,
         longitude: marker.longitude
       }
    //    marker.events = {
    //        click: function(mapModel, eventName, originalEventArgs) {
    //            console.log("user defined event: " + eventName, mapModel, originalEventArgs);
               
    //        }
    //    }
     })
    $scope.markers = markers;
   })
})

.controller('editCtrl', function ($scope ,latitudServiceParaEditar,$http) {
    // // console.log($scope);
    $scope.markers = [];
     var a=0;
     var coords= $scope.data=latitudServiceParaEditar.data;
     console.log(coords);
    var unregister =  $scope.$watch(function(scope){ 
        console.log("estoy viendo todo");
         if (scope.data.latitude !== 0 && a===0){
        // console.log(scope.data.latitude);
            //var coords= latitudServiceParaEditar.data;
            //$scope.markers = [];
            var marker ={};
            marker.id=Date.now();
            marker.coords = {
                latitude: coords.latitude,
                longitude: coords.longitude
            }
            a++;
            $scope.markers[0]=marker;
            unregister();    
        }

      }
      );

        
       
    angular.extend($scope, {
        map: {
            center: {
                latitude: -38.7167,
                longitude:-62.2833
            },
            zoom: 13,
            
            markers: $scope.markers,
            events: {
            click: function (map, eventName, originalEventArgs) {
                var e = originalEventArgs[0];
                var lat = e.latLng.lat(),lon = e.latLng.lng();
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: lat,
                        longitude: lon
                    }
                };
                //$scope.map.markers.push(marker);
                $scope.markers[0]=marker;
                $('html, body').animate({
                scrollTop: $('#formulario').offset().top
                }, 'slow');    
                latitudServiceParaEditar.update(marker.coords.latitude,marker.coords.longitude);
                
                //console.log($scope.map.markers);
                $scope.$apply();
            }
        }
        }
    });

}
);








