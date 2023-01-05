/* eslint-disable no-useless-catch */
const client = require("./client");
const bcrypt = require("bcrypt");

// database functions

// user functions

// MAN HOW YA'LL GONNA NOT RETURN THE ID IN THIS AND
// THEN  USE IT ON A TEST CMON BRUH
async function createUser({ username, password }) {
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const { rows: [user] } = await client.query(`
      INSERT INTO users (username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;`, [username, hashedPassword]);
    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {

  if (!username || !password) {
    return;
  }

  try {
    const user = await getUserByUsername(username)
    const hashedPassword = user.password;
    let passwordsMatch = await bcrypt.compare(password, hashedPassword);

    if (passwordsMatch) {
      delete user.password;
      return user;
    }
    else {
      return;
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [user], } = await client.query(`
  SELECT username, id
  FROM users
  WHERE id = ${userId};
  `,);

    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}


async function getUserByUsername(userName) {

  try {
    const { rows: [user] } = await client.query(`
    SELECT *
    FROM users
    WHERE username = $1
    `, [userName]);

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
