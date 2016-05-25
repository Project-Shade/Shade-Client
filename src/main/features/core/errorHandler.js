process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception: %j', error);
  if (global.DEV_MODE) return;
  Emitter.sendToWindowsOfName('main', 'error', {
    error: {
      message: error.message,
      stack: error.stack,
    },
  });
});
