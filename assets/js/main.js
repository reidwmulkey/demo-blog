$(document).ready(function(){
	$('#newsletterForm').submit(function(event){
		event.preventDefault();
		var email = $('#newsletterForm #email');
		var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		console.log(email.val());
		if(!emailRegex.test(email.val()))
			alert(email.val() + " is not a valid email address. Please enter a valid email address and try again.");
		else
			alert(email.val() + " has been added to our newsletter!");
	});
});