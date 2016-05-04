/**
 * Created by branden on 4/26/16.
 */
module.exports = function(app, promptModel, gameModel) {

    app.post("/api/prompt/create", createPrompt);
    app.get("/api/prompt", getAllPrompts);
    app.get("/api/prompt/game/:sessionId", getGamePrompts);
    app.put("/api/prompt/like/:promptId", likePrompt);


    function createPrompt(req, res) {
        var prompt = req.body;
        promptModel.createPrompt(prompt)
            .then(
                function(prompt){
                    res.json(prompt);
                },
                function(err){
                    res.status(400).send(err);
                }
            );

    }

    function getAllPrompts(req, res) {
        promptModel.getAllPrompts()
            .then(
                function(prompts){
                    res.json(prompts);
                },
                function(err){
                    res.status(400).send(err);
                }
            );

    }

    function getGamePrompts(req, res) {
        var sessionId = req.params.sessionId;
        var currentPrompts = gameModel.getPromptIds(sessionId);
        promptModel.getGamePrompts(currentPrompts)
            .then(
                function(prompts){
                    var newPromptIds = prompts.map(function(prompt){
                        return prompt._id;
                    });
                    gameModel.addPrompts(sessionId, newPromptIds);
                    res.json(prompts);
                },
                function(err){
                    res.status(500).send(err);
                }
            );
    }

    function likePrompt(req, res) {
        var promptId = req.params.promptId;
        promptModel.likePrompt(promptId)
            .then(
                function(response){
                    res.send(200);
                },
                function(err){
                    res.status(500).send(err);
                }
            );

    }
};