const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => res.render('index', { ver: req.client.config.version }));

router.get('/commands/:commandname?', (req, res) => {
	const input = req.params.commandname;
	const level = req.query.level || 5;
	const commands = req.client.commands.filter(c => c.conf.enabled && c.conf.permLevel <= level).array();
	if (input) {
		const command = commands.find(c => c.help.name === input);
		if (command) {
			return res.render('commands/view', {
				command,
				title: command.help.name,
				prefix: req.client.config.prefix
			});
		} else {
			return res.status(404).send('That command does not exist.');
		}
	} else {
		const categories = commands.reduce((r, a) => {
			r[a.help.category] = r[a.help.category] || [];
			r[a.help.category].push(a);
			return r;
		}, Object.create(null));

		return res.render('commands/index', {
			categories,
			title: 'Commands',
			prefix: req.client.config.prefix
		});
	}
});

router.get('/users', (req, res) => {
	const users = req.client.users.filter(!u.bot).array();
	res.render('users', {
		users,
		layout: 'global'
	});
});

module.exports = router;