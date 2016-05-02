(function() {
    angular
        .module("app")
        .controller("LoginController", loginController);

    function loginController(UserService, $rootScope, $location) {
        var vm = this;

        vm.user = {};
        vm.error = $rootScope.errorMessage;
        vm.login = login;
        vm.navToRegister = navToRegister;

        function init(){
            if ($rootScope.currentUser){
                $location.url("/profile/" + $rootScope.currentUser.username);
            }
        }
        init();

        function login(user){
            UserService
                .login(user)
                .then(
                    function(response){
                        UserService.setCurrentUser(response.data);
                        $location.url("/profile/" + response.data.username);
                    },
                    function(err){
                        vm.error = "Invalid credentials";
                    }
                )


        }

        function navToRegister(){
            $location.url("/register");
        }
    }

})();
