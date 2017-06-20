

var lugares = angular.module("lugaresApp", ['ngRoute', 'moduloMapa'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "list.html",
                controller: "ListController",
                resolve: {
                    lugares: function (Lugares) {
                        return Lugares.getLugares();
                    }
                }
            })
            .when("/new/lugar", {
                controller: "NewLugarController",
                templateUrl: "lugar-form.html"
            })
            .when("/lugar/todos", {
                controller: "mostrarLugares",
                templateUrl: "listaLugares.html"
                
            })
            .when("/edit/:lugarId", {
                controller: "EditLugarController",
                templateUrl: "lugar-form-edit.html"
                
            })
            
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'loginController'
            })
            .when('/logout', {
                controller: 'logoutController'
            })
            .when('/ver/:lugarId', {
                templateUrl: "verLugar.html",
                controller: "EditLugarController",
                controllerAs: 'ver'
            })
            .when('/readme', {
                templateUrl: "readme.html"
            })
            .when('/integrantes', {
                templateUrl: "integrantes.html"
            })
        // .otherwise({
        //     redirectTo: "/"
        // })
    })
    .run(function ($rootScope, $location, servicioAutenticar) {
        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            if (($location.path() === '/new/lugar' || $location.path().includes('/edit/')) && !servicioAutenticar.isLoggedIn()) {
                $location.path('/login');
            }
        })
    })
    .service("Lugares", function ($http, $window) {
        this.getLugares = function () {
            return $http.get("/lugares").
                then(function (response) {
                    return response;
                }, function (response) {
                    alert("Error al buscar lugares.");
                });
        };
        this.createLugar = function (lugar) {
            var token = $window.localStorage['mean-token'];;
            return $http.post("/lugares", lugar, { headers: { 'x-access-token': token } }).
                then(function (response) {
                    //exito
                    return response;
                }, function (response) {
                    //error
                    return response;
                });
        };
        this.getLugar = function (lugarId) {
            var url = "/lugares/" + lugarId;
            return $http.get(url).
                then(function (response) {
                    return response;
                }, function (response) {
                    alert("Error finding this lugar.");
                });
        };
        this.editLugar = function (lugar) {
            var url = "/lugares/" + lugar._id;
            var token = $window.localStorage['mean-token'];;
            // console.log(lugar._id);
            return $http.put(url, lugar, { headers: { 'x-access-token': token } }).
                then(function (response) {
                    return response;
                }, function (response) {
                    alert("Error editing this lugar.");
                    // console.log(response);
                });
        };
        this.deleteLugar = function (lugarId) {
            var url = "/lugares/" + lugarId;
            var token = $window.localStorage['mean-token'];;
            return $http.delete(url, { headers: { 'x-access-token': token } }).
                then(function (response) {
                    return response;
                }, function (response) {
                    alert("Error deleting this lugar.");
                    // console.log(response);
                });
        };
        this.editLugarComentario = function (lugar) {
            var url = "/lugares/" + lugar._id;
            // console.log(lugar._id);
            return $http.put(url, lugar).
                then(function (response) {
                    return response;
                }, function (response) {
                    alert("Error cargando el comentario.");
                    // console.log(response);
                });
        };

    })
    .controller("ListController", function (lugares, $scope, $location, servicioAutenticar) {
        $scope.lugares = lugares.data;

        $scope.showLugar = function (lugar_id) {
            if (servicioAutenticar.isLoggedIn()) {
                var lugarUrl = "/edit/" + lugar_id;
                $location.path(lugarUrl);
            } else {
                var lugarUrl = "/ver/" + lugar_id;
                $location.path(lugarUrl);
            }



        }
    })
    .controller("NewLugarController", function ($scope, $location, Lugares, latitudService) {
        $scope.data = latitudService.data;

        //  console.log($scope);
        $scope.back = function () {
            $location.path("/");
        };

        $scope.saveLugar = function (lugar) {
            var coords = latitudService.data;
            // console.log(coords);
            lugar.latitude = coords.latitude;
            lugar.longitude = coords.longitude;
            lugar.comentarios = [];
            Lugares.createLugar(lugar).then(function (doc) {
                var data = doc.data;
                if (data.hasOwnProperty("latitude")) {
                    var lugarUrl = "/lugar/" + doc.data._id;
                    $scope.contactFormUrl = "";
                    $location.path("/");
                }
                else {
                    $scope.errorMessage = data.res;
                }
            });
        }
    })
    .factory('latitudService', function () {
        return {
            data: {
                latitude: '',
                longitude: ''
            },
            update: function (lati, longi) {
                // Improve this method as needed
                this.data.latitude = lati;
                this.data.longitude = longi;
            }
            // Other methods or objects can go here
        };
    })
    .factory('latitudServiceParaEditar', function () {
        return {
            data: {
                latitude: 0,
                longitude: 0
            },
            update: function (lati, longi) {
                // Improve this method as needed
                this.data.latitude = lati;
                this.data.longitude = longi
            }
            // Other methods or objects can go here
        };
    })

    .controller("EditLugarController", function ($scope, $location, $routeParams, Lugares, $http, latitudServiceParaEditar) {
        Lugares.getLugar($routeParams.lugarId).then(function (doc) {

            var lugar = $scope.lugar = doc.data;
            // console.log(lugar);
            latitudServiceParaEditar.update(lugar.latitude, lugar.longitude);


        }, function (response) {
            alert(response);
        });


        $scope.back = function () {
            latitudServiceParaEditar.update(0, 0);
            $location.path("/");
        };

        $scope.saveLugar = function (lugar) {
            var coords = latitudServiceParaEditar.data;
            lugar.latitude = coords.latitude;
            lugar.longitude = coords.longitude;
            Lugares.editLugar(lugar);
            // $scope.editMode = false;
            $scope.contactFormUrl = "";
            latitudServiceParaEditar.update(0, 0);
            $location.path("/");
        };

        $scope.deleteLugar = function (lugarId) {
            Lugares.deleteLugar(lugarId);
        }
    })

    .controller("loginController", function ($scope, $http, $location, servicioAutenticar) {

        $scope.autenticar = function (data) {
            servicioAutenticar.autenticar(data, function (result) {
                if (result === true) {
                    // console.log('llegue');
                    $location.path('/');
                    // $location.path('/');
                    // $location.replace();


                } else {
                    $scope.errorMessage = 'Username or password is incorrect';

                }
            })
        }
    })
    .controller("navegacion", function ($scope, $location, servicioAutenticar) {
        var vm = this;
        vm.isLoggedIn = servicioAutenticar.isLoggedIn();

        $scope.LogOut = function () {
            servicioAutenticar.Logout();
            $location.path('/login');
        };

    })
    .service('servicioAutenticar', function ($http, $window) {
        this.autenticar = function (data, callback) {
            $http.post('/api/authenticate', data).
                then(function mySuccess(response) {
                    // console.log('llegue adentro');
                    var rta = response.data;
                    if (rta.hasOwnProperty('token')) {
                        var token = rta.token;
                        $window.localStorage['mean-token'] = token;
                        $http.defaults.headers.common.Authorization = 'Bearer ' + token;
                        // $http.defaults.headers.common. = 'Bearer ' + token;
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                }, function myError(response) {
                    // console.log(response.statusText);
                });

        }
        this.Logout = function () {
            $window.localStorage.removeItem('mean-token');
            $http.defaults.headers.common.Authorization = '';
        }
        this.isLoggedIn = function () {
            var token = $window.localStorage['mean-token'];

            if (token) {
                // console.log("Hay tokennn");
                return true;
            }
            else {
                // console.log("NOOOO hay tokennn");
                return false;
            }
        }
    }
    )
    .factory('latitudService', function () {
        return {
            data: {
                latitude: '',
                longitude: ''
            },
            update: function (lati, longi) {
                // Improve this method as needed
                this.data.latitude = lati;
                this.data.longitude = longi;
            }
            // Other methods or objects can go here
        };
    })



    .controller('mainController', function ($scope) {
        $scope.sortType = 'nombre'; // set the default sort type
        $scope.sortReverse = false;  // set the default sort order
        $scope.buscaLugar = '';     // set the default search/filter term
    })
    .controller("ReviewController", function (Lugares, $routeParams, latitudServiceParaEditar, $location) {
        this.lugar = {};
        //    $scope.lugar.comentarios=[];
        Lugares.getLugar($routeParams.lugarId).then(function (doc) {

            this.lugar = doc.data;
            // console.log( $scope.lugar);
            latitudServiceParaEditar.update(lugar.latitude, lugar.longitude);


        }, function (response) {
            alert(response);
        });

        this.comentario = {};

        this.addReview = function (lugar) {

            // lugar=$scope.lugar;
            lugar.comentarios.push(this.comentario);
            Lugares.editLugarComentario(lugar).then(
                function (doc) {
                    // var lugarUrl = "/ver/" + lugar._id;
                    // $location.path(lugarUrl);
                    // $scope.lugar.comentarios.push(this.comentario);
                    // console.log($scope.lugar);
                    $('html, body').animate({
                        scrollTop: $('#comentario').offset().top
                    }, 'slow');
                },
                function (response) {
                    alert(response)
                }
            );
            // lugar.reviews.push(this.review);
            this.comentario = {};
        };



    })





