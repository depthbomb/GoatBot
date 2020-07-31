const { MakeErrorClass } = require('fejl');
const codes = {
	MissingArgumentError: { code: 'CPRNET100001', message: 'The argument is required' },
	InvalidArgumentError: { code: 'CPRNET100002', message: 'One or more arguments are not valid.' },
	InvalidArgumentCountError: { code: 'CPRNET100003', message: 'The number of arguments is invalid' },
	OnCooldownError: { code: 'CPRNET100004', message: 'An active cooldown is preventing this action from executing' },
	InsufficientPermissionsError: { code: 'CPRNET100005', message: 'User has insufficient permissions to perform this action' },
	RefugeeCampCommandInvocationError: { code: 'CPRNET100006', message: 'The command may not be executed in the refugee camp channel' },
};

class OnCooldownError extends MakeErrorClass(codes['OnCooldownError'].message, { code: codes['OnCooldownError'].code }) {}
class MissingArgumentError extends MakeErrorClass(codes['MissingArgumentError'].message, { code: codes['MissingArgumentError'].code }) {}
class InvalidArgumentError extends MakeErrorClass(codes['InvalidArgumentError'].message, { code: codes['InvalidArgumentError'].code }) {}
class InvalidArgumentCountError extends MakeErrorClass(codes['InvalidArgumentCountError'].message, { code: codes['InvalidArgumentCountError'].code }) {}
class InsufficientPermissionsError extends MakeErrorClass(codes['InsufficientPermissionsError'].message, { code: codes['InsufficientPermissionsError'].code }) {}
class RefugeeCampCommandInvocationError extends MakeErrorClass(codes['RefugeeCampCommandInvocationError'].message, { code: codes['RefugeeCampCommandInvocationError'].code }) {}

module.exports = {
	OnCooldownError,
	MissingArgumentError,
	InvalidArgumentError,
	InvalidArgumentCountError,
	InsufficientPermissionsError,
	RefugeeCampCommandInvocationError,
	codes,
};