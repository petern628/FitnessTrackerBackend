const client = require("./client");

// database functions

// user functions

// MAN HOW YA'LL GONNA NOT RETURN THE ID IN THIS AND
// THEN  USE IT ON A TEST CMON BRUH
async function createUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users (username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING id, username;`, [username, password]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {

  try {
    const { rows: [user] } = await client.query(`SELECT * FROM users WHERE username = '${username}'`);

    if (user.password === password) {
      user.password = null;
      return user;
    }
    else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const { rows: [user] } = await client.query(`SELECT id, username FROM users WHERE id = '${id}'`);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const { rows: [user] } = await client.query(`SELECT id, username FROM users WHERE username = '${username}'`);

    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
