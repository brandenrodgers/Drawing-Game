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
        vm.players = [];
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
                        vm.players = response.data;
                        vm.finalRound = $rootScope.round >= ($rootScope.totalPlayers - 1);
                    }
                });

        }
        init();

        // When a new player joins the lobby
        SocketService.on('new:player', function(playerData) {
            vm.players.push(playerData.username);
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
                            console.log($rootScope.round);
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