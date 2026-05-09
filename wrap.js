process.on('exit', (code) => console.log('EXITING WITH CODE', code));
process.on('uncaughtException', (err) => { console.error('UNCAUGHT EXCEPTION', err); });
process.on('unhandledRejection', (reason, promise) => { console.error('UNHANDLED REJECTION', reason); });
require('next/dist/bin/next');
