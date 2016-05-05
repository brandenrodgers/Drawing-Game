/**
 * Created by branden on 4/26/16.
 */
(function() {
    angular
        .module("app")
        .controller("ProfileController", profileController);

    function profileController(GameService, PromptService, $rootScope, $location) {
        var vm = this;

        vm.currentUser = $rootScope.currentUser;
        vm.createNewGame = createNewGame;
        vm.navToJoinGame = navToJoinGame;
        vm.prompt = null;
        vm.addPrompt = addPrompt;

        function createNewGame(){
            GameService
                .createNewGame(vm.currentUser)
                .then(function(response){
                    if(response.data){
                        $rootScope.sessionId = response.data;
                        $location.url("/lobby/start/" + response.data + "/master");
                    }
                    else {
                        vm.message = "Error creating new game";
                    }
                });
        }

        function navToJoinGame() {
            $location.url("/join");
        }

        function addPrompt(prompt){
            if (prompt) {
                var promptObject = {value: prompt};
                PromptService.create(promptObject)
                    .then(function (response) {
                        if (response.data) {
                            vm.prompt = null;
                        }
                    })
            }
        }
    }

})();
