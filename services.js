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
    const query = 'SELECT data FROM sessions';
    const db = await dbLoader();
    const [rows] = await db.execute(query);

    const sessionData = rows.map((row) => {
      const { data } = row;
      const parsedData = JSON.parse(data);
      const username = parsedData.data.user.username;

      return { ...parsedData, username };
    });

    return sessionData;
  } catch (error) {
    console.error('Failed to get session data:', error);
    throw error;
  }
}
