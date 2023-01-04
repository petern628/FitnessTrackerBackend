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
      RETURNING *;`, [username, password]);

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {

  try {
    const { rows: [user] } = await client.query(`
    SELECT username, password
    FROM users;
    `)
    console.log(user, "HELOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
