/**
 * Created by branden on 4/26/16.
 */
var random = require('mongoose-random');

module.exports = function(db, mongoose) {

    //load user schema
    var promptSchema = require('./prompt.schema.server.js')(mongoose);
    promptSchema.plugin(random, { path: 'r' });

    //create user model from schema
    var PromptModel = mongoose.model('Prompt', promptSchema);

    var api = {
        createPrompt: createPrompt,
        getGamePrompts: getGamePrompts,
        getAllPrompts: getAllPrompts,
        likePrompt: likePrompt,
        getMongooseModel: getMongooseModel
    };
    return api;

    function createPrompt(prompt) {
        return PromptModel.create(prompt);
    }

    function getMongooseModel() {
        return PromptModel;
    }

    function getGamePrompts(currentPromptIds){
        return PromptModel.findRandom({ _id: { $nin: currentPromptIds } }).limit(5);
    }

    function getAllPrompts() {
        return PromptModel.find();
    }

    function likePrompt(promptId) {
        return PromptModel.findOneAndUpdate({_id: promptId}, {$inc: {likes: 1}});
    }

};
