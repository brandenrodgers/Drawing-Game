/**
 * Created by branden on 4/26/16.
 */
(function() {
    angular
        .module("app")
        .controller("ProfileController", profileController);

    function profileController(GameService, $rootScope, $location) {
        var vm = this;

        vm.currentUser = $rootScope.currentUser;
        vm.createNewGame = createNewGame;
        vm.navToJoinGame = navToJoinGame;

        function createNewGame(){
            GameService
                .createNewGame(vm.currentUser)
                .then(function(response){
                    if(response.data){
                        $rootScope.sessionId = response.data;
                        $location.url("/startlobby/" + response.data + "/master");
                    }
                    else {
                        vm.message = "Error creating new game";
                    }
                });
        }

        function navToJoinGame() {
            $location.url("/join");
        }


    }

})();
