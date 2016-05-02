/**
 * Created by branden on 3/3/16.
 */
 //TODO maybe add 'use strict';
(function(){
    angular
        .module("app")
        .factory("SocketService", socketService);

    function socketService($rootScope) {
        var socket = io.connect();

        var api = {
            on: on,
            emit: emit
        };
        return api;

        function on(eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        }

        function emit(eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }

    }
})();