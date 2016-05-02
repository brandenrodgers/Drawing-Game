(function() {
    angular
        .module("app")
        .controller("JoinController", joinController);

    function joinController(GameService, SocketService, $rootScope, $location) {
        var vm = this;

        vm.currentUser = $rootScope.currentUser;
        vm.error = null;
        vm.joinGame = joinGame;


        function joinGame(sessionId){
            if (!sessionId) {
                vm.error = "Enter Session Id";
                return;
            }
            GameService
                .join({sessionId: sessionId, user: vm.currentUser})
                .then(function(response){
                    if(response.data){
                        SocketService.emit('player:joined', {
                            username: response.data.username
                        });
                        $rootScope.sessionId = sessionId;
                        $location.url("/startlobby/" + sessionId)
                    }
                    else {
                        vm.error = "Unable to join game";
                    }
                });

        }
    }

})();
