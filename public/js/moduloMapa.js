var app= angular.module('moduloMapa', ['uiGmapgoogle-maps'])
 .controller('mainCtrl', function ($scope, latitudService) {
    $scope.data = latitudService.data;

    
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
                
                latitudService.update(marker.coords.latitude,marker.coords.longitude);
                
                //console.log($scope.map.markers);
                $scope.$apply();
            }
        }
        }
    });
})
.controller('mostrarLugares', function ($scope) {

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
                
                latitudService.update(marker.coords.latitude,marker.coords.longitude);
                
                //console.log($scope.map.markers);
                $scope.$apply();
            }
        }
        }
    });
}
);



