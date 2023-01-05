/* eslint-disable no-useless-catch */
const { Router } = require("express");
const client = require("./client");
const { getUserByUsername } = require("./users");
//const attachActivitiesToRoutines = require("./activities");


async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const { rows: [routine] } = await client.query(`
    INSERT INTO routines("creatorId", "isPublic", name, goal)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const { rows: [routine] } = await client.query(`SELECT *
    FROM routines
     WHERE id = ${id}
     `);

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
  SELECT routines.*, users.username AS "creatorName"
  FROM routines
  JOIN users ON routines."creatorId" = users.id
  `);

    const { rows: activities } = await client.query(`
  SELECT activities.*, routine_activities.id 
  AS "routineActivityId", routine_activities."routineId", routine_activities.duration, routine_activities.count
  FROM activities
  JOIN routine_activities
  ON routine_activities."activityId" = activities.id
  `);

    for (const routine of routines) {
      const activitiesToAdd = activities.filter(
        (activity) => activity.routineId === routine.id
      );

      routine.activities = activitiesToAdd;
    }
    return routines;
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const routines = await getAllRoutines();
    const publicRoutines = routines.filter(x => x.isPublic == true);

    return publicRoutines;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    // const routines = await getAllRoutines();

    // let userRoutines = [];

    // routines.forEach(async routine => {
    //   const user = await getUserByUsername(username);

    //   if(user.id === routine.creatorId)
    //     userRoutines.push(routine);
    // });

    // return userRoutines;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) { }

async function getPublicRoutinesByActivity({ id }) { }

async function updateRoutine({ id, ...fields }) {
  const routine = await getRoutineById(id);

  // IF THE ISPUBLIC WE ARE PASSING IN IS NOT UNDEFINED
  // AND IF THE ISPUBLIC WERE ARE PASSING IN DOES NOT EQUAL THE ROUTINE'S CURRENT ISPUBLIC VALUE
  // UPDATE ISPUBLIC TO THE VALUE PASSED IN
  if (fields.isPublic !== undefined && fields.isPublic !== routine.isPublic) {
    routine.isPublic = fields.isPublic;
    await client.query(`UPDATE routines SET "isPublic" = ${fields.isPublic} WHERE id = ${id}`);
  }

  if (fields.name) {
    routine.name = fields.name;
    await client.query(`UPDATE routines SET name = '${fields.name}' WHERE id = ${id}`);
  }

  if (fields.goal) {
    routine.goal = fields.goal;
    await client.query(`UPDATE routines SET goal = '${fields.goal}' WHERE id = ${id}`);
  }

  return routine;
}

async function destroyRoutine(id) {
  await client.query(`DELETE FROM routine_activities WHERE "routineId" = ${id}`);
  await client.query(`DELETE FROM routines WHERE id = ${id}`);
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
