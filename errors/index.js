const { MakeErrorClass } = require('fejl');
const codes = {
	MissingArgumentsError: { code: 'CPRNET100001', message: 'The argument is required' },
	InvalidArgumentError: { code: 'CPRNET100002', message: 'The argument is invalid' },
	InvalidArgumentCountError: { code: 'CPRNET100003', message: 'The number of arguments is invalid' },
	OnCooldownError: { code: 'CPRNET100004', message: 'You are currently under an active cooldown for this action' },
	InsufficientPermissionsError: { code: 'CPRNET100005', message: 'You have insufficient permissions to execute this command' },
	RefugeeCampCommandInvocationError: { code: 'CPRNET100006', message: 'Commands may not be executed in the refugee camp channel' },
};

class OnCooldownError extends MakeErrorClass(codes['OnCooldownError'].message, { code: codes['OnCooldownError'].code }) {}
class MissingArgumentsError extends MakeErrorClass(codes['MissingArgumentsError'].message, { code: codes['MissingArgumentsError'].code }) {}
class InvalidArgumentError extends MakeErrorClass(codes['InvalidArgumentError'].message, { code: codes['InvalidArgumentError'].code }) {}
class InvalidArgumentCountError extends MakeErrorClass(codes['InvalidArgumentCountError'].message, { code: codes['InvalidArgumentCountError'].code }) {}
class InsufficientPermissionsError extends MakeErrorClass(codes['InsufficientPermissionsError'].message, { code: codes['InsufficientPermissionsError'].code }) {}
class RefugeeCampCommandInvocationError extends MakeErrorClass(codes['RefugeeCampCommandInvocationError'].message, { code: codes['RefugeeCampCommandInvocationError'].code }) {}

module.exports = {
	OnCooldownError,
	MissingArgumentsError,
	InvalidArgumentError,
	InvalidArgumentCountError,
	InsufficientPermissionsError,
	RefugeeCampCommandInvocationError,
};