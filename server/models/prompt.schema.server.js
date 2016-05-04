/**
 * Created by branden on 4/26/16.
 */

module.exports = function(mongoose) {

    var promptSchema = mongoose.Schema({
        value: String,
        likes: {
            type: Number,
            default: 0
        }
    }, {collection: 'prompt'});

    return promptSchema;
};