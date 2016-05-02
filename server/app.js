/**
 * Created by branden on 3/3/16.
 */
module.exports = function(app, db, mongoose){
    var userModel = require("./models/user.model.server.js")(db, mongoose);
    var gameModel = require("./models/game.model.server.js")();

    var gameService = require("./services/game.service.server.js")(app, gameModel);
    var userService = require("./services/user.service.server.js")(app, userModel);
};