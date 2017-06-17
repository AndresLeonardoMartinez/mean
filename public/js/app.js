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
                templateUrl: "listaLugares.html"
                    
                
            })
                
           
           
            .when("/lugar/:lugarId", {
                controller: "EditLugarController",
                templateUrl: "lugar-form-edit.html",
                
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
       
        // $scope.data={
        //             nombre:'',
        //             palabrasClaves:'',
        //             descripcion:''
        //         };
        $scope.data = latitudService.data;
        $scope.back = function() {
            $location.path("#/");
        };

        $scope.saveLugar = function(lugar) {
            Lugares.createLugar(lugar).then(function(doc) {
                var lugarUrl = "/lugar/" + doc.data._id;
                $location.path("#/");
                // $scope.data={
                //     nombre:'',
                //     palabrasClaves:'',
                //     descripcion:''
                // };
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
    .factory('latitudServiceParaEditar', function(){
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
    .controller("EditLugarController", function($scope, $location,$routeParams,Lugares,$http,latitudServiceParaEditar) {
        //obtengo el valor de la base de datos y lo actualizo
        // console.log(data);
        // console.log($scope);
        var latBD,longBD;
        var id = $routeParams.lugarId;
        var patch=("/lugares/"+id);
       //console.log(patch);
        $http.get(patch)
            .then(function mySuccess(response) {
            var latBD=response.data.latitude;
            var longBD=response.data.longitude;
            latitudServiceParaEditar.update(latBD,longBD);
         //   console.log("deberia updatear con los valores"+latBD);
            //$scope.$apply();
            // console.log("coordenadas"+latBD);
        }, function myError(response) {
            console.log('error');
        });
        
        var data= $scope.data = latitudServiceParaEditar.data;

        Lugares.getLugar($routeParams.lugarId).then(function(doc) {
            $scope.lugar = doc.data;
        }, function(response) {
            alert(response);
        });
        // console.log($routeParams.lugarId);
        // $scope.toggleEdit = function() {
        //     $scope.editMode = true;
        //     $scope.contactFormUrl = "contact-form.html";
        // };

        $scope.back = function() {
            $location.path("#/");
        };

        $scope.saveLugar = function(lugar) {
            var coords =$scope.data;
            lugar.latitude=coords.latitude;
            lugar.longitude=coords.longitude;
            Lugares.editLugar(lugar);
            $scope.editMode = false;
            $scope.contactFormUrl = "";
        };

        $scope.deleteLugar = function(lugarId) {
            Lugares.deleteLugar(lugarId);
        }
    });
    