const { getActivityById } = require("./activities");
const client = require("./client");
const { getRoutineById } = require("./routines");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(
      `
    INSERT INTO routine_activities("routineId", "activityId", count, duration)
    VALUES($1, $2 ,$3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `,
      [routineId, activityId, count, duration]
    );

    return routine_activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [activity],
    } = await client.query(`SELECT * FROM routine_activities WHERE id = ${id}`);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {
  try {
    const { rows } = await client.query(`SELECT * FROM routine_activities WHERE "routineId" = ${id}`);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivity({ id, ...fields }) {
  try {
    if (fields.count)
      await client.query(`UPDATE routine_activities SET count = ${fields.count} WHERE id = ${id}`);

    if (fields.duration)
      await client.query(`UPDATE routine_activities SET duration = ${fields.duration} WHERE id = ${id}`);

    const routineActivity = await getRoutineActivityById(id);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  try {
    const routineActivity = await getActivityById(id);

    await client.query(`DELETE FROM routine_activities WHERE id = ${id}`);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}

async function canEditRoutineActivity(routineActivityId, userId) {
  const routineActivity = await getRoutineActivityById(routineActivityId);
  const routine = await getRoutineById(routineActivity.routineId);

  if (routine.id === userId)
    return true;

  return false;
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
