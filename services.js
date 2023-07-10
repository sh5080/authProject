import { dbLoader } from './index.js';

export async function authenticateUser(username, password) {
  try {
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const db = await dbLoader();
    const [rows] = await db.execute(query, [username, password]);
    return rows.length > 0;
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
