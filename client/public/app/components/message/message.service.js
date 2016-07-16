/*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
	console.log(fromState);
	if(fromState.name === "message-list")
		disconnect();
})*/

(function(){
	'use strict';

	angular.module('message')
	.service('Message', ['$q', '$window', 'Communication', '$rootScope', MessageService]);

	function MessageService($q, $window, Communication, $rootScope){
		var socket;		

		function connect(connectCB, disconnectCB){
			if(socket && socket.connected){
				socket.removeAllListeners();
				console.log('reloading');
				socket.emit('reload');
			}
			else {
				console.log('connecting');
			//socket = io.connect('ws://ineedtotalk.org:9001', 
			//socket = io.connect('wss://dev.ineedtotalk.org', 
				socket = io.connect('', 
				{
					// secure: true,
					query: 'token=' + $window.localStorage.accessToken
				});

				socket.on('connect', function () {
					console.log('authenticated');
					connectCB();
				}).on('disconnect', function () {
					console.log('disconnected');
					disconnectCB();
				});
			}
		}

		function disconnect(callback){
			socket.disconnect();
			socket = null;
			callback();
		}

		function joinSupportGroup(supportGroupName){
			socket.emit('supportGroup-join', supportGroupName);
		}

		function leaveSupportGroup(supportGroupName){
			socket.emit('supportGroup-leave', supportGroupName);
		}

		function init(){
			socket.emit('socket-init');
		}

		function send(recipient, message){
			socket.emit('message-send', {
				recipient: recipient,
				body:message
			});
		}

		function receive(fcn){
			socket.on('message-receive', fcn);
		}

		function supportGroupJoined(fcn){
			socket.on('supportGroup-joined', fcn);
		}

		function messageLoad(fcn){
			socket.on('message-load', fcn);
		}

		return {
			connect: connect,
			disconnect: disconnect,
			send: send,
			init: init,
			receive: receive,
			joinSupportGroup: joinSupportGroup,
			leaveSupportGroup: leaveSupportGroup,
			supportGroupJoined: supportGroupJoined,
			messageLoad: messageLoad
		};
	}
})();
