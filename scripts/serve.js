const path = require('path');
const server = require('live-server');

server.start({
	root: path.resolve(__dirname, '../build'),
	mount: [['/assets', path.resolve(__dirname, '../assets')]],
	open: false
});