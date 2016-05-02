/**
 * Created by branden on 3/1/16.
 */
(function(){
    angular
        .module("app")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/login", {
                templateUrl: "app/client/views/user/login.view.html",
                controller: "LoginController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkCurrentUser
                }
            })
            .when("/register", {
                templateUrl: "app/client/views/user/register.view.html",
                controller: "RegisterController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkCurrentUser
                }
            })
            .when("/profile/:username?", {
                templateUrl: "app/client/views/user/profile.view.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/join", {
                templateUrl: "app/client/views/game/join.view.html",
                controller: "JoinController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/startlobby/:sessionId/:master?", {
                templateUrl: "app/client/views/game/lobby/start.view.html",
                controller: "StartLobbyController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/midlobby/:sessionId/:master?", {
                templateUrl: "app/client/views/game/lobby/mid.view.html",
                controller: "MidLobbyController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/endlobby/:sessionId/:master?", {
                templateUrl: "app/client/views/game/lobby/end.view.html",
                controller: "EndLobbyController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/drawing/:sessionId/:first?", {
                templateUrl: "app/client/views/game/drawing.view.html",
                controller: "DrawingController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/guessing/:sessionId", {
                templateUrl: "app/client/views/game/guessing.view.html",
                controller: "GuessingController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .otherwise({
                redirectTo: "/login"
            });
    }

    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            // User is Not Authenticated
            else
            {
                $rootScope.errorMessage = 'You need to log in';
                deferred.reject();
                $location.url('/login');
            }
        });

        return deferred.promise;
    };


    var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();

        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
            }
            deferred.resolve();
        });

        return deferred.promise;
    };

})();