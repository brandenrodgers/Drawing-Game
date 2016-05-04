/**
 * Created by branden on 3/4/16.
 */
module.exports = function(app, gameModel) {
    app.post("/api/create", createNewGame);
    app.post("/api/join", joinGame);
    app.post("/api/start", startGame);
    app.get("/api/players/:sessionId", getPlayers);
    app.get("/api/lobby/mid/:sessionId", getPlayersInMidLobby);
    app.post("/api/drawing/new", addNewDrawing);
    app.post("/api/guess/new", addNewGuess);
    app.post("/api/next/:sessionId", startNextRound);
    app.get("/api/get/next/:sessionId/:userId", getNextData);

    function createNewGame(req, res) {
        var user = req.body;
        var sessionId = gameModel.createNewGame(user);
        res.json(sessionId);
    }

    function joinGame(req, res) {
        var joinData = req.body;
        var playerData = gameModel.joinGame(joinData);
        res.json(playerData);
    }

    function startGame(req, res) {
        var sessionId = req.body.sessionId;
        var response = gameModel.startGame(sessionId);
        res.json(response);
    }

    function getPlayers(req, res) {
        var sessionId = req.params.sessionId;
        var players = gameModel.getPlayersForSession(sessionId);
        res.json(players);
    }

    function getPlayersInMidLobby(req, res) {
        var sessionId = req.params.sessionId;
        var players = gameModel.getPlayersInLobby(sessionId);
        res.json(players);
    }

    function addNewDrawing(req, res) {
        var data = req.body;
        var response = gameModel.addNewDrawing(data);
        res.send(response);
    }

    function addNewGuess(req, res) {
        var data = req.body;
        var response = gameModel.addNewGuess(data);
        res.send(response);
    }

    function startNextRound(req, res) {
        var sessionId = req.params.sessionId;
        var round = gameModel.startNextRound(sessionId);
        res.json(round);
    }

    function getNextData(req, res) {
        var sessionId = req.params.sessionId;
        var userId = req.params.userId;
        var data = gameModel.getNextData(sessionId, userId);
        res.json(data);
    }

};