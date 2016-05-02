/**
 * Created by branden on 4/26/16.
 */

module.exports = function(db, mongoose) {

    //load user schema
    var userSchema = require('./user.schema.server.js')(mongoose);

    //create user model from schema
    var UserModel = mongoose.model('User', userSchema);

    var api = {
        createUser: createUser,
        findUserByUsername: findUserByUsername,
        findAllUsers: findAllUsers,
        findUserById: findUserById,
        updateUser: updateUser,
        deleteUser: deleteUser,
        getMongooseModel: getMongooseModel,
        findUserByFacebookId: findUserByFacebookId,
    };
    return api;

    function createUser(user) {
        return UserModel.create(user);
    }

    function getMongooseModel() {
        return UserModel;
    }

    function findUserByUsername(username){
        return UserModel.findOne({username: username});
    }

    function findAllUsers() {
        return UserModel.find();
    }

    function findUserById(userId) {
        return UserModel.findById(userId);
    }

    function updateUser(userId, user) {
        return UserModel.update({_id: userId}, {$set: user});
    }

    function deleteUser(userId) {
        return UserModel.findByIdAndRemove(userId);
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId});
    }


};
