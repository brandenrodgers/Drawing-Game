/**
 * Created by branden on 4/26/16.
 */
(function(){
    angular
        .module("app")
        .controller("MidLobbyController", midLobbyController);


    function midLobbyController(GameService, SocketService, $rootScope, $routeParams, $location){
        var vm = this;

        vm.sessionId = $routeParams.sessionId;
        vm.master = $rootScope.master;
        vm.currentUser = $rootScope.currentUser;
        vm.lobbyPlayers = [];
        vm.unfinishedPlayers = [];
        vm.finalRound = false;
        vm.nextRound = nextRound;
        vm.results = results;

        function init(){
            SocketService.emit('player:joined', {
                username: vm.currentUser.username
            });

            GameService
                .getMidLobby(vm.sessionId)
                .then(function(response){
                    if (response.data){
                        vm.lobbyPlayers = response.data;
                        vm.finalRound = $rootScope.round >= ($rootScope.gamePlayers.length - 1);
                        //Find all players that we're still waiting on
                        vm.unfinishedPlayers = $rootScope.gamePlayers.filter(function(player){
                            return vm.lobbyPlayers.indexOf(player) < 0;
                        });
                    }
                });

        }
        init();

        // When a new player joins the lobby
        SocketService.on('new:player', function(data) {
            vm.lobbyPlayers.push(data.username);
            vm.unfinishedPlayers.splice(vm.unfinishedPlayers.indexOf(data.username), 1);
        });

        // When the game is started
        SocketService.on('game:next', function(data) {
            $rootScope.round = data.round;
            if (data.round % 2 == 0) {
                $location.url("/drawing/" + vm.sessionId);
            } else {
                $location.url("/guessing/" + vm.sessionId)
            }
        });

        function nextRound(){
            GameService
                .startNextRound(vm.sessionId)
                .then(
                    function(response){
                        if (response.data){
                            $rootScope.round = response.data;
                            SocketService.emit('game:nextclick', {
                                round: $rootScope.round
                            });
                            if ($rootScope.round % 2 == 0) {
                                $location.url("/drawing/" + vm.sessionId);
                            } else {
                                $location.url("/guessing/" + vm.sessionId)
                            }
                        }
                    },
                    function(err){
                        console.log("error in next round");
                        // TODO maybe throw an error
                    }
                );

        }

        function results(){
            $location.url("/lobby/end/" + vm.sessionId);
        }


    }

})();