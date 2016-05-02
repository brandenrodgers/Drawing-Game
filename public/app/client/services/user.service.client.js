/**
 * Created by branden on 4/26/16.
 */
(function(){
    angular
        .module("app")
        .factory("UserService", userService);

    function userService($http, $rootScope) {
        var api = {
            login: login,
            logout: logout,
            updateUser: updateUser,
            register: register,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
        };

        return api;

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function updateUser(user) {
            return $http.put("/api/update/" + user._id, user);
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function getCurrentUser() {
            return $http.get("/api/loggedin");
        }


    }
})();