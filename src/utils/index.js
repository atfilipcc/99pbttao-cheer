function onAuthorizeSuccess(data, accept) {
	accept();
}

function onAuthorizeFail(data, message, error, accept) {
	if (error) accept(new Error(message));
}

module.exports = {onAuthorizeSuccess, onAuthorizeFail}
