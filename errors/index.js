const { MakeErrorClass } = require('fejl');
const codes = {
	//	1xxxx series - command errors
	MissingArgumentError: { code: 'CPRNET10000', message: 'The argument is required' },
	InvalidArgumentError: { code: 'CPRNET10001', message: 'One or more arguments are not valid' },
	InvalidArgumentCountError: { code: 'CPRNET10002', message: 'The number of arguments is invalid' },
	OnCooldownError: { code: 'CPRNET10003', message: 'An active cooldown is preventing this action from executing' },
	InsufficientPermissionsError: { code: 'CPRNET10004', message: 'User has insufficient permissions to perform this action' },
	RefugeeCommandUsageError: { code: 'CPRNET10005', message: 'The command may not be executed in the refugee camp channel' },
	InvalidCommandLocationError: { code: 'CPRNET10006', message: 'The command may not be executed in this context' },
	GuildOnlyCommandError: { code: 'CPRNET10007', message: 'Commands may only be executed in my server https://discord.gg/xw624a8' },

	//	2xxxx series - database errors
	DocumentExistsError: { code: 'CPRNET20000', message: 'The document already exists in the database' },
	DocumentNotFoundError: { code: 'CPRNET20001', message: 'The document could not be found in the database' },
};

class OnCooldownError extends MakeErrorClass(codes['OnCooldownError'].message, { code: codes['OnCooldownError'].code }) {}
class MissingArgumentError extends MakeErrorClass(codes['MissingArgumentError'].message, { code: codes['MissingArgumentError'].code }) {}
class InvalidArgumentError extends MakeErrorClass(codes['InvalidArgumentError'].message, { code: codes['InvalidArgumentError'].code }) {}
class InvalidArgumentCountError extends MakeErrorClass(codes['InvalidArgumentCountError'].message, { code: codes['InvalidArgumentCountError'].code }) {}
class InsufficientPermissionsError extends MakeErrorClass(codes['InsufficientPermissionsError'].message, { code: codes['InsufficientPermissionsError'].code }) {}
class InvalidCommandLocationError extends MakeErrorClass(codes['InvalidCommandLocationError'].message, { code: codes['InvalidCommandLocationError'].code }) {}
class GuildOnlyCommandError extends MakeErrorClass(codes['GuildOnlyCommandError'].message, { code: codes['GuildOnlyCommandError'].code }) {}

class DocumentExistsError extends MakeErrorClass(codes['DocumentExistsError'].message, { code: codes['DocumentExistsError'].code }) {}
class DocumentNotFoundError extends MakeErrorClass(codes['DocumentNotFoundError'].message, { code: codes['DocumentNotFoundError'].code }) {}

module.exports = {
	OnCooldownError,
	MissingArgumentError,
	InvalidArgumentError,
	InvalidArgumentCountError,
	InsufficientPermissionsError,
	InvalidCommandLocationError,
	GuildOnlyCommandError,

	DocumentExistsError,
	DocumentNotFoundError,

	codes,
};