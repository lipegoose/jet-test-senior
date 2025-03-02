// migrations/20250301_create_logs_table.js
exports.up = (pgm) => {
    pgm.createTable('logs', {
      id: { type: 'serial', primaryKey: true },
      timestamp: { type: 'timestamp', notNull: true, default: pgm.func('now()') },
      level: { type: 'varchar(10)', notNull: true },
      message: { type: 'text', notNull: true },
      details: { type: 'jsonb', default: '{}' }
    });
  };
  
  exports.down = (pgm) => {
    pgm.dropTable('logs');
  };
  