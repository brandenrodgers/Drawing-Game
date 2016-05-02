/**
 * Created by branden on 4/26/16.
 */
(function(){
    angular
        .module("app")
        .controller("EndLobbyController", endLobbyController);


    function endLobbyController(GameService, $rootScope, $routeParams, $location){
        var vm = this;

        vm.sessionId = $routeParams.sessionId;
        vm.currentUser = $rootScope.currentUser;
        vm.players = [];

        function init(){
            GameService
                .getPlayers(vm.sessionId)
                .then(function(response){
                    if (response.data){
                        vm.players = response.data;
                    }
                })
        }
        init();

    }

})();