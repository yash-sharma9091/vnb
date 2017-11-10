const STATUS_CODE = {
	'UNPROCESSABLE_ENTITY': 422,
	'BAD_REQUEST': 400,
	'INTERNAL_SERVER_ERROR': 500
};

function required (obj) {
	return {
		errors: {
			message: obj.message
		}
	}
}

function error (obj) {
	return {
		errors: obj
	}
}

function success (obj) {
	return {
		records: obj
	}
}

module.exports = {
	STATUS_CODE: STATUS_CODE,
	required: required,
	error: error,
	success: success
};