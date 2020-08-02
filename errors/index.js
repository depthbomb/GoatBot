const { MakeErrorClass } = require('fejl');
const codes = {
	//	1xxxx series - command errors
	MissingArgumentError: { code: 'CPRNET10000', message: 'The argument is required' },
	InvalidArgumentError: { code: 'CPRNET10001', message: 'One or more arguments are not valid' },
	InvalidArgumentCountError: { code: 'CPRNET10002', message: 'The number of arguments is invalid' },
	OnCooldownError: { code: 'CPRNET10003', message: 'An active cooldown is preventing this action from executing' },
	InsufficientPermissionsError: { code: 'CPRNET10004', message: 'User has insufficient permissions to perform this action' },
	RefugeeCampCommandInvocationError: { code: 'CPRNET10005', message: 'The command may not be executed in the refugee camp channel' },

	//	2xxxx series - database errors
	DocumentExistsError: { code: 'CPRNET20000', message: 'The document already exists in the database' },
	DocumentNotFoundError: { code: 'CPRNET20001', message: 'The document could not be found in the database' },
};

class OnCooldownError extends MakeErrorClass(codes['OnCooldownError'].message, { code: codes['OnCooldownError'].code }) {}
class MissingArgumentError extends MakeErrorClass(codes['MissingArgumentError'].message, { code: codes['MissingArgumentError'].code }) {}
class InvalidArgumentError extends MakeErrorClass(codes['InvalidArgumentError'].message, { code: codes['InvalidArgumentError'].code }) {}
class InvalidArgumentCountError extends MakeErrorClass(codes['InvalidArgumentCountError'].message, { code: codes['InvalidArgumentCountError'].code }) {}
class InsufficientPermissionsError extends MakeErrorClass(codes['InsufficientPermissionsError'].message, { code: codes['InsufficientPermissionsError'].code }) {}
class RefugeeCampCommandInvocationError extends MakeErrorClass(codes['RefugeeCampCommandInvocationError'].message, { code: codes['RefugeeCampCommandInvocationError'].code }) {}

class DocumentExistsError extends MakeErrorClass(codes['DocumentExistsError'].message, { code: codes['DocumentExistsError'].code }) {}

module.exports = {
	OnCooldownError,
	MissingArgumentError,
	InvalidArgumentError,
	InvalidArgumentCountError,
	InsufficientPermissionsError,
	RefugeeCampCommandInvocationError,

	DocumentExistsError,

	codes,
};