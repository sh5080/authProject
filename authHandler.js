import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import dotenv from 'dotenv';

dotenv.config();
export const key = process.env.KEY;
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const sessionStore = new MySQLStore({
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      data: 'data',
      expires: 'expires',
    },
  },
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const initializeSession = session({
  name: 'sessionID',
  secret: key,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
  },
});
