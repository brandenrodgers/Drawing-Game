/**
 * Created by branden on 4/26/16.
 */

module.exports = function(mongoose) {

    var userSchema = mongoose.Schema({
        username: String,
        password: String,
        facebook:   {
            id:    String,
            token: String
        }
    }, {collection: 'user'});

    return userSchema;
};