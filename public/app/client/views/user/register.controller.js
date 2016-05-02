(function() {
    angular
        .module("app")
        .controller("RegisterController", registerController);

    function registerController(UserService, $rootScope, $location) {
        var vm = this;

        vm.user = {};
        vm.error = null;
        vm.register = register;

        function init(){
            if ($rootScope.currentUser){
                $location.url("/profile/" + $rootScope.currentUser.username);
            }
        }
        init();

        function register(user){
            if (!user.username) {
                vm.error = "Enter a username";
                return;
            }
            if (!user.password) {
                vm.error = "Enter a password";
                return;
            }
            if (!user.password2) {
                vm.error = "Verify password";
                return;
            }
            if (user.password !== user.password2) {
                vm.error = "Passwords do not match";
                return;
            }
            UserService
                .register(user)
                .then(
                    function(response){
                        if (response.data) {
                            UserService.setCurrentUser(response.data);
                            $location.url("/profile/" + response.data.username);
                        }
                    },
                    function(err){
                        vm.error = "Failed to register";
                    }
                )
        }
    }

})();
