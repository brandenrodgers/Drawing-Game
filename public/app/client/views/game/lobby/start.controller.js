/**
 * Created by branden on 4/26/16.
 */
(function(){
    angular
        .module("app")
        .controller("StartLobbyController", startLobbyController);


    function startLobbyController(GameService, SocketService, PromptService, $rootScope, $routeParams, $location){
        var vm = this;

        vm.sessionId = $routeParams.sessionId;
        vm.master = $routeParams.master;
        vm.currentUser = $rootScope.currentUser;
        vm.players = [];
        vm.startGame = startGame;

        function init(){
            GameService
                .getPlayers(vm.sessionId)
                .then(function(response){
                    if (response.data){
                        vm.players = response.data;
                    }
                });

            PromptService.getGame(vm.sessionId)
                .then(function(response){
                    if (response.data){
                       $rootScope.prompts = response.data;
                    }
                });

        }
        init();

        // When a new player joins the lobby
        SocketService.on('new:player', function(playerData) {
            vm.players.push(playerData);
        });

        // When the game is started
        SocketService.on('game:started', function(data) {
            $rootScope.totalPlayers = data.totalPlayers;
            $rootScope.round = 0;
            $location.url('/drawing/' + vm.sessionId + "/first");
        });

        function startGame(){
            if (vm.players.length > 1) {
                GameService
                    .startGame(vm.sessionId)
                    .then(function (response) {
                        if (response.data) {
                            //Send game start to socket to broadcast
                            SocketService
                                .emit('game:startclick', {
                                    totalPlayers: vm.players.length
                                });
                            $rootScope.totalPlayers = vm.players.length;
                            $rootScope.master = true;
                            $rootScope.round = 0;
                            $location.url('/drawing/' + vm.sessionId + "/first");
                        }
                    });
            }
        }

    }

})();