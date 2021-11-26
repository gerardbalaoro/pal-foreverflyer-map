const path = require('path');
const server = require('live-server');

server.start({
	root: path.resolve(__dirname, '../build'),
	open: false
});