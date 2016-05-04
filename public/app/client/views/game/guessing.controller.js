/**
 * Created by branden on 4/26/16.
 */
(function() {
    angular
        .module("app")
        .controller("GuessingController", guessingController);

    function guessingController(GameService, UserService, $rootScope, $routeParams, $location) {
        var vm = this;

        vm.sessionId = $routeParams.sessionId;
        vm.currentUser = $rootScope.currentUser;
        vm.drawingToGuess = null;
        vm.error = null;
        vm.drawing = null;
        vm.save = save;

        function init() {
            GameService
                .getNextData(vm.sessionId, vm.currentUser._id)
                .then(
                    function (response) {
                        if (response.data) {
                            vm.drawingToGuess = response.data;
                        }
                    },
                    function (err) {
                        vm.error = "Error retrieving drawing";
                    }
                );
        }
        init();


        function save(guess) {
            if (!guess){
                vm.error = "Enter a guess";
                return;
            }
            GameService
                .sendGuess(vm.sessionId, vm.currentUser, guess)
                .then(
                    function (response) {
                        if (response.data) {
                            $location.url("/lobby/mid/" + vm.sessionId);
                        }
                    },
                    function (err) {
                        vm.error = "Error saving guess";
                    }
                );
        }

    }

})();