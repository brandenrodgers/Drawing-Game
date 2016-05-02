/**
 * Created by branden on 3/4/16.
 */
var games = require('./game.mock.json');
module.exports = function() {

    var api = {
        createNewGame: createNewGame,
        joinGame: joinGame,
        startGame: startGame,
        getPlayersForSession: getPlayersForSession,
        addNewDrawing: addNewDrawing,
        addNewGuess: addNewGuess,
        getPlayersInLobby: getPlayersInLobby,
        startNextRound: startNextRound,
        getNextData: getNextData,
        endGame: endGame
    };
    return api;

    function createNewGame(user) {
        var sessionId = (new Date()).getTime();
        var newSession = {
            sessionId: sessionId,
            round: 0,
            started: false,
            lobby: [],
            players: [{
                _id: user._id,
                username: user.username,
                prompt: null,
                chain: []
                }
            ]
        };
        games.push(newSession);
        return sessionId;
    }

    function joinGame(joinData) {
        for(var x in games) {
            if(games[x].sessionId == joinData.sessionId && !games[x].started) {
                var playerData = {
                    _id: joinData.user._id,
                    username: joinData.user.username,
                    prompt: null,
                    chain: []
                };
                games[x].players.push(playerData);
                return playerData;
            }
        }
        return null;
    }

    function startGame(sessionId){
        for(var x in games) {
            if(games[x].sessionId == sessionId) {
                games[x].started = true;
                return sessionId;
            }
        }
        return null;
    }

    function getPlayersForSession(sessionId){
        for(var x in games) {
            if(games[x].sessionId == sessionId) {
                return games[x].players;
            }
        }
        return null;
    }

    function getPlayersInLobby(sessionId){
        for(var x in games) {
            if(games[x].sessionId == sessionId) {
                return games[x].lobby;
            }
        }
        return null;
    }

    function addNewDrawing(data){
        for(var x=0; x < games.length; x++) {
            if(games[x].sessionId == data.sessionId) {
                for (var i=0; i < games[x].players.length; i++){
                    if (games[x].players[i]._id == data.user._id) {
                        var index = i;
                        if (games[x].round == 0){
                            games[x].players[i].prompt = data.prompt;
                        } else {
                            index = (i + games[x].round) % games[x].players.length;
                        }
                        games[x].players[index].chain.push(
                            {
                                username: data.user.username,
                                type: "drawing",
                                value: data.image
                            }
                        );
                        console.log("new drawing from " + data.user.username);
                        console.log( games[x]);
                        games[x].lobby.push(data.user.username);
                        return 200;
                    }
                }
            }
        }
        return 500;
    }

    function addNewGuess(data){
        for(var x=0; x < games.length; x++) {
            if(games[x].sessionId == data.sessionId) {
                for (var i=0; i < games[x].players.length; i++){
                    if (games[x].players[i]._id == data.user._id) {
                        var index = (i + games[x].round) % games[x].players.length;
                        games[x].players[index].chain.push(
                            {
                                username: data.user.username,
                                type: "guess",
                                value: data.guess
                            }
                        );
                        console.log("new guess from " + data.user.username);
                        console.log( games[x]);
                        games[x].lobby.push(data.user.username);
                        return 200;
                    }
                }
            }
        }
        return 500;
    }

    function startNextRound(sessionId) {
        for(var x in games) {
            if(games[x].sessionId == sessionId) {
                games[x].round += 1;
                games[x].lobby = [];
                console.log("start next round");
                console.log(games[x]);
                return games[x].round;
            }
        }
        return null;
    }

    function getNextData(sessionId, userId){
        for(var x=0; x < games.length; x++) {
            if(games[x].sessionId == sessionId) {
                for (var i=0; i < games[x].players.length; i++) {
                    if (games[x].players[i]._id == userId) {
                        var index = (i + games[x].round) % games[x].players.length;
                        var lastIndex = games[x].players[index].chain.length - 1;
                        return games[x].players[index].chain[lastIndex].value;
                    }
                }
            }
        }
        return null;
    }

    function endGame(sessionId) {
        for(var x in games) {
            if(games[x].sessionId == sessionId){
                games.splice(x,1);
                return sessionId;
            }
        }
        return null;
    }

};