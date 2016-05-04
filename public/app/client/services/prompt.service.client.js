/**
 * Created by branden on 5/04/16.
 */
(function(){
    angular
        .module("app")
        .factory("PromptService", promptService);

    function promptService($http) {
        var api = {
            create: create,
            getAll: getAll,
            getGame: getGame,
            like: like,
        };

        return api;

        function create(prompt) {
            return $http.post("/api/prompt/create", prompt);
        }

        function getAll() {
            return $http.get("/api/prompt");
        }

        function getGame(sessionId) {
            return $http.get("/api/prompt/game/" + sessionId);
        }

        function like(promptId) {
            return $http.put("/api/prompt/like/" + promptId);
        }

    }
})();