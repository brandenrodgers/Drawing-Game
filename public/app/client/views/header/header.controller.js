/**
 * Created by branden on 2/18/16.
 */
(function(){
    angular
        .module("app")
        .controller("HeaderController", headerController);

    function headerController(UserService, $location){
    	var vm = this;

        vm.logout = logout;

        function logout(){
            UserService
                .logout()
                .then(function(){
                    UserService.setCurrentUser(null);
                    $location.url("/login");
                });
        }
    }
})();