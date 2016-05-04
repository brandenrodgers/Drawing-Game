(function() {
    angular
        .module("app")
        .controller("DrawingController", drawingController)
        .directive("drawing", drawing);

    function drawingController(GameService, UserService, $rootScope, $routeParams, $location) {
        var vm = this;

        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');
        vm.sessionId = $routeParams.sessionId;
        vm.first = $routeParams.first;
        vm.currentUser = $rootScope.currentUser;
        vm.guessToDraw = null;
        vm.error = null;
        vm.reset = reset;
        vm.save = save;

        function init(){
            if (vm.first) {
                vm.promptList = $rootScope.prompts.map(function(prompt){
                    return prompt.value;
                });
            } else {
                GameService
                    .getNextData(vm.sessionId, vm.currentUser._id)
                    .then(
                        function (response) {
                            if (response.data) {
                                vm.guessToDraw = response.data;
                            }
                        },
                        function (err) {
                            vm.error = "Error retrieving guess";
                        }
                    );
            }
        }
        init();

        function reset(){
            context.clearRect(0, 0, canvas.width, canvas.height);
        }

        function save() {
            var image = canvas.toDataURL("image/png");
            GameService
                .sendDrawing(vm.sessionId, vm.currentUser, image, vm.selectedPrompt)
                .then(
                    function(response){
                        if (response.data){
                            $location.url("/lobby/mid/" + vm.sessionId);
                        }
                    },
                    function(err){
                        vm.error = "Error saving drawing";
                    }
                );
        }

    }

    function drawing(){

        return {
            restrict: "A",
            link: function(scope, element){
                var ctx = element[0].getContext('2d');

                // variable that decides if something should be drawn on mousemove
                var drawing = false;

                // the last coordinates before the current move
                var lastX;
                var lastY;

                element.bind('touchstart', drawStart.bind(event));
                element.bind('mousedown', drawStart.bind(event));
                element.bind('touchmove', drawMove.bind(event));
                element.bind('mousemove', drawMove.bind(event));
                element.bind('touchend', drawEnd.bind(event));
                element.bind('mouseup', drawEnd.bind(event));

                function drawStart(event){
                    event.preventDefault();
                    if (event.type == "mousedown") {
                        if (event.offsetX !== undefined) {
                            lastX = event.offsetX;
                            lastY = event.offsetY;
                        } else { // Firefox compatibility
                            lastX = event.layerX - event.currentTarget.offsetLeft;
                            lastY = event.layerY - event.currentTarget.offsetTop;
                        }
                    }
                    else {
                        lastX = event.originalEvent.targetTouches[0].pageX - (element[0].offsetLeft + element[0].offsetParent.offsetLeft);
                        lastY = event.originalEvent.targetTouches[0].pageY - (element[0].offsetTop + element[0].offsetParent.offsetTop);
                    }

                    // begins new line
                    ctx.beginPath();

                    drawing = true;
                }

                function drawMove(event){
                    if(drawing){
                        var currentX;
                        var currentY;
                        // get current mouse position
                        if (event.type == "mousemove") {
                            if (event.offsetX !== undefined) {
                                currentX = event.offsetX;
                                currentY = event.offsetY;
                            } else {
                                currentX = event.layerX - event.currentTarget.offsetLeft;
                                currentY = event.layerY - event.currentTarget.offsetTop;
                            }
                        }
                        else {
                            currentX = event.originalEvent.targetTouches[0].pageX - (element[0].offsetLeft + element[0].offsetParent.offsetLeft);
                            currentY = event.originalEvent.targetTouches[0].pageY - (element[0].offsetTop + element[0].offsetParent.offsetTop);
                        }

                        draw(lastX, lastY, currentX, currentY);

                        // set current coordinates to last one
                        lastX = currentX;
                        lastY = currentY;
                    }

                }

                function drawEnd(event){
                    // stop drawing
                    drawing = false;
                }

                function draw(lX, lY, cX, cY){
                    // line from
                    ctx.moveTo(lX,lY);
                    // to
                    ctx.lineTo(cX,cY);
                    // color
                    ctx.strokeStyle = "black";
                    // draw it
                    ctx.stroke();
                }
            }
        };
    }

})();
