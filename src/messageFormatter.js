'use strict';

const MessageFormatter = ({ type, data }, config) => {
  let message = '';
  if (config.server_name) {
    message = `\n\n<b>Server : <u>${config.server_name}</u></b>\n`;
  }
  if (type === 'EVENT') {
    const serviceName = data.process.name;
    let event = '';
    switch (data.event) {
      case 'start':
        if (!config.lifecycle) {
          return null;
        }
        event = 'has started';
        break;
      case 'stop':
        if (!config.lifecycle) {
          return null;
        }
        event = 'has stopped';
        break;
      case 'restart':
        if (!config.lifecycle) {
          return null;
        }
        event = 'has restarted';
        break;
      case 'online':
        if (!config.lifecycle) {
          return null;
        }
        event = 'is online';
        break;
      case 'restart overlimit':
        if (!config.error) {
          return null;
        }
        event = 'has been stopped. Check and fix the issue.';
        break;
      case 'exit':
          return null;
    }
    message += `<i>${serviceName}</i> ${event}\n`;
  }

  if (type === 'LOG_ERROR') {
    if (!config.error_log || config.ignored_apps.includes(data.process.name)) {
      return null;
    }
    const serviceName = data.process.name;
    let log = data.data || "";
    if (log.length > 3500) {
      const logId = `LOG_ID-${parseInt(Math.random()*1000000000,10)}${new Date().getTime()}`;
      console.log(logId);
      console.log('\n');
      console.log(log);
      log =`${logId}\n${log.substring(0, 3500)}`;
    }
    message += `<i>${serviceName}</i> log\n<code>${log}</code>\n`;
  }
  return message
};

module.exports = MessageFormatter;