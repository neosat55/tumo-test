// Есть фильтр
// Изменение конкретного поля
// В ответе надо вернуть кол-во затронутых пользователей

/**
 * {
 *   filter: {
 *     city: 1
 *     firstName: "Test"
 *   },
 *   updatee: {
 *     city: 2,
 *     firstName: "12"
 *   }
 * }
 */

const {MassHistory} = require('../helpers/history');

/**
 * @param {Object} filter
 * @param {import('knex').Knex} db
 * @returns {Promise<Array<Object>>}
 */
async function findUsers(filter, db) {
  const model = db('users')
    .select('id');

  Object.keys(filter).forEach(key => {
    const val = filter[key];

    if (Array.isArray(val)) {
      model.whereIn(key, val);
    }

    model.where(key, val);
  });

  return model;
}

/**
 * @param {Object[]} usersIds
 * @param {string[]} columns
 * @param {import('knex').Knex} db
 * @returns {Promise<Array<Object>>}
 */
async function getPreviousData(usersIds, columns, db) {
  return db('users')
    .whereIn('id', usersIds)
    .select('id', ...columns);
}

/**
 * @param {Object[]} usersIds
 * @param {Object} updatee
 * @param {Object} ext
 * @returns {Promise<number>}
 */
async function updateUsers(usersIds, updatee, ext) {
  const {
    /**
     * @type {import('knex').Knex}
     */
    db,
    /**
     * @type {MassHistory}
     */
    history
  } = ext;
  const columns = Object.keys(updatee);
  const prevUsers = await getPreviousData(usersIds, columns, db);
  const updateQuery = db('users')
    .whereIn('id', usersIds)
    .update(updatee);

  const count = await updateQuery;

  // for each user prepare the update data
  prevUsers.forEach((user) => {
    columns.forEach((column) => {
      // if values the same we don't log this
      if (user[column] === updatee[column]) {
        return;
      }

      // Prepare data for log
      // user[column] is before data
      // updatee[column] is after data
      history.prepare(user.id, column, user[column], updatee[column]);
    });
  });

  // save logs
  await history.save();

  return count;
}

module.exports = {
  massChanges: async(filter, updatee, {db, history}) => {
    const users = await findUsers(filter, db);
    const usersIds = users.map(({id}) => id);

    return updateUsers(usersIds, updatee, {db, history});
  }
};