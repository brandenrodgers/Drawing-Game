/**
 * Created by branden on 3/3/16.
 */
(function(){
    angular
        .module("app")
        .factory("GameService", gameService);

    function gameService($http) {
        var api = {
            createNewGame: createNewGame,
            join: join,
            startGame: startGame,
            getPlayers: getPlayers,
            sendDrawing: sendDrawing,
            getMidLobby: getMidLobby,
            sendGuess: sendGuess,
            startNextRound: startNextRound,
            getNextData: getNextData
        };
        return api;

        function createNewGame(user) {
            return $http.post("/api/create", user);
        }

        function join(joinData) {
            return $http.post("/api/join", joinData);
        }

        function startGame(sessionId) {
            return $http.post("/api/start", {sessionId: sessionId});
        }

        function getPlayers(sessionId) {
            return $http.get("/api/players/" + sessionId);
        }

        function getMidLobby(sessionId) {
            return $http.get("/api/lobby/mid/" + sessionId);
        }

        function sendDrawing(sessionId, user, image, prompt) {
            return $http.post("/api/drawing/new", {sessionId: sessionId, user: user, image: image, prompt: prompt});
        }

        function sendGuess(sessionId, user, guess) {
            return $http.post("/api/guess/new", {sessionId: sessionId, user: user, guess: guess});
        }

        function startNextRound(sessionId) {
            return $http.post("/api/next/" + sessionId);
        }

        function getNextData(sessionId, userId){
            return $http.get("/api/get/next/" + sessionId + "/" + userId);
        }

    }
})();