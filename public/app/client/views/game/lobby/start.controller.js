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
        vm.lobbyPlayers = [];
        vm.startGame = startGame;

        function init(){
            if (!vm.master) {
                SocketService.emit('player:joined', {
                    username: vm.currentUser.username
                });
            }

            GameService
                .getPlayers(vm.sessionId)
                .then(function(response){
                    if (response.data){
                        vm.lobbyPlayers = response.data.map(function(player){
                            return player.username;
                        });
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
        SocketService.on('new:player', function(data) {
            vm.lobbyPlayers.push(data.username);
        });

        // When the game is started
        SocketService.on('game:started', function(data) {
            $rootScope.gamePlayers = data.gamePlayers;
            $rootScope.round = 0;
            $location.url('/drawing/' + vm.sessionId + "/first");
        });

        function startGame(){
            if (vm.lobbyPlayers.length > 1) {
                GameService
                    .startGame(vm.sessionId)
                    .then(function (response) {
                        if (response.data) {
                            //Send game start to socket to broadcast
                            SocketService
                                .emit('game:startclick', {
                                    gamePlayers: vm.lobbyPlayers
                                });
                            $rootScope.gamePlayers = vm.lobbyPlayers.slice();
                            $rootScope.master = true;
                            $rootScope.round = 0;
                            $location.url('/drawing/' + vm.sessionId + "/first");
                        }
                    });
            }
        }

    }

})();