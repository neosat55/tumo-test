class MassHistory {
  /**
   * @param {string} table - table name
   * @param {import('knex').Knex} db - database connector
   */
  constructor(table, db) {
    /**
     * @type {import('knex').Knex}
     * @private
     */
    this.db = db;
    /**
     * @private
     */
    this.table = table;
    /**
     * @type {Object[]}
     * @private
     */
    this.changes = [];
  }

  /**
   * @param {number|string} id - record id
   * @param {string} column - column that changed
   * @param {*} before - value before
   * @param {*} after - value after
   */
  prepare(id, column, before, after) {
    const historyRec = {
      table: this.table,
      table_record_id: id,
      column,
      before,
      after
    };

    this.changes.push(historyRec);
  }

  save() {
    // nothing to save
    if (this.changes.length === 0) {
      return;
    }

    // insert changes to db;
    const saver = this.db('mass_actions_history')
      .insert(this.changes)
      .returning('id');

    // flush the changes for next use
    this.changes = [];

    // execute save
    return saver;
  }
}

module.exports = {MassHistory};