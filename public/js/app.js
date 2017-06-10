angular.module("lugaresApp", ['ngRoute','moduloMapa'])
    .config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    lugares: function(Lugares) {
                        return Lugares.getLugares();
                    }
                }
            })
            .when("/new/lugar", {
                controller: "NewLugarController",
                templateUrl: "contact-form.html"
            })
            .when("/lugar/todos", {
                controller: "mostrarLugares",
                templateUrl: "listaLugares.html",
                     resolve: {
                    lugares: function(Lugares) {
                        return Lugares.getLugares();
                    }
                }
                
            })
                
           
           
            .when("/lugar/:lugarId", {
                controller: "EditLugarController",
                templateUrl: "contact.html"
            })
            
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("Lugares", function($http) {
        this.getLugares = function() {
            return $http.get("/lugares").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error al buscar lugares.");
                });
        };
        this.createLugar = function(lugar) {
            return $http.post("/lugares", lugar).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error creating lugar.");
                });
        };
        this.getLugar = function(lugarId) {
            var url = "/lugares/" + lugarId;
            return $http.get(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding this lugar.");
                });
        };
        this.editLugar = function(lugar) {
            var url = "/lugares/" + lugar._id;
            console.log(lugar._id);
            return $http.put(url, lugar).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error editing this lugar.");
                    console.log(response);
                });
        };
        this.deleteLugar = function(lugarId) {
            var url = "/lugares/" + lugarId;
            return $http.delete(url).
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error deleting this lugar.");
                    console.log(response);
                });
        }
    })
    .controller("ListController", function(lugares, $scope, $location) {
        $scope.lugares = lugares.data;
        
        $scope.showLugar = function(lugar_id) {
            var lugarUrl = "/lugar/" + lugar_id;
            $location.path(lugarUrl);
        }
    })
    .controller("NewLugarController", function($scope, $location, Lugares,latitudService) {
         $scope.data = latitudService.data;
        $scope.back = function() {
            $location.path("#/");
        };

        $scope.saveLugar = function(lugar) {
            Lugares.createLugar(lugar).then(function(doc) {
                var lugarUrl = "/lugar/" + doc.data._id;
                $location.path(lugarUrl);
            }, function(response) {
                alert(response);
            });
        }
    })
    .factory('latitudService', function(){
    return {
        data: {
        latitude: '',
        longitude:''
    }, 
    update: function(lati,longi) {
      // Improve this method as needed
      this.data.latitude = lati;
      this.data.longitude = longi;
    }
        // Other methods or objects can go here
    };
    })
    .controller("EditLugarController", function($scope, $routeParams, Lugares) {
        Lugares.getLugar($routeParams.lugarId).then(function(doc) {
            $scope.lugar = doc.data;
        }, function(response) {
            alert(response);
        });

        $scope.toggleEdit = function() {
            $scope.editMode = true;
            $scope.contactFormUrl = "contact-form.html";
        };

        $scope.back = function() {
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        };

        $scope.saveLugar = function(lugar) {
            Lugares.editLugar(lugar);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        };

        $scope.deleteLugar = function(lugarId) {
            Lugares.deleteLugar(lugarId);
        }
    });
    