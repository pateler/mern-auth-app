import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
}

const logFile = path.join(logsDir, 'app.log');

// Write log to file and console
export const log = (level, message, data = null) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        data,
    };

    // Log to console
    console.log(`[${timestamp}] [${level}] ${message}`);

    // Log to file
    fs.appendFileSync(
        logFile,
        JSON.stringify(logEntry) + '\n'
    );
};

export const info = (message, data = null) => {
    exports.log('INFO', message, data);
};

export const error = (message, data = null) => {
    exports.log('ERROR', message, data);
};

export const warn = (message, data = null) => {
    exports.log('WARN', message, data);
};

export const debug = (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
        exports.log('DEBUG', message, data);
    }
};