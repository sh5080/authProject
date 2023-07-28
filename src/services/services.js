import { dbLoader } from '../index.js';

export const signupUser = async (userData) => {
  try {
    const query = `INSERT INTO users (name, username, password, email) VALUES (?, ?, ?, ?)`;
    const db = await dbLoader();
    await db.execute(query, [userData.name, userData.username, userData.hashedPassword, userData.email]);
  } catch (error) {
    console.error('Failed to signup user:', error);
    throw error;
  }
};

export async function authenticateUser(username) {
  try {
    const query = `SELECT * FROM users WHERE username = ?`;
    const db = await dbLoader();
    const [rows] = await db.execute(query, [username]);
    return rows[0];
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    throw error;
  }
}

export async function getAllSessionData() {
  try {
    const query = 'SELECT * FROM sessions';
    const db = await dbLoader();
    const [rows] = await db.execute(query);

    return rows;
  } catch (error) {
    console.error('Failed to get session data:', error);
    throw error;
  }
}

export async function getRequestsFromDB(sessionID) {
  try {
    const db = await dbLoader();
    const query = 'SELECT * FROM requests WHERE `key` = ?';
    const [rows] = await db.execute(query, [sessionID]);
    return rows;
  } catch (error) {
    console.error('Failed to get requests from DB:', error);
    throw error;
  }
}
