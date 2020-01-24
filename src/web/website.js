const path    = require('path');
const chalk = require('chalk');
const compression = require('compression');
const express = require('express');
const exphbs  = require('express-handlebars');

// Route modules
const core = require('./routes/core');

module.exports = client => {
	const app = express();
	const prod = !client.localMode;
	const port = prod ? 80 : client.config.website.port;

	app.engine('handlebars', exphbs({ helpers: require('./helpers') }));

	app.set('env', prod ? 'production' : 'development');
	app.set('case sensitive routing', true);
	app.set('strict routing', false);
	app.set('json spaces', 4);
	app.set('views', path.join(client.webPath, 'resources', 'views'));
	app.set('view engine', 'handlebars');
	app.set('view cache', prod);
	app.set('x-powered-by', false);

	app.use(express.static(path.join(client.webPath, 'public'), { maxAge: prod ? 31557600 : 0 }));

	if (prod) app.use(compression());

	app.use((req, res, next) => {
		req.client = client;
		next();
	});

	app.use('/', core);

	client.express = app;

	return {
		boot: () => {
			if (client.config.website.enabled)
				app.listen(port, () => console.log(chalk.bgGreen.whiteBright(`Website started on port ${port}.`)));
			else
				console.log(chalk.bgYellow.black('Website disabled'));
		}
	};
};