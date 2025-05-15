const config = require('../config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // connect to db
    const sequelize = new Sequelize(database, user, password, { 
        host: host,
        dialect: 'mysql' 
    });

    // Export sequelize for transactions
    db.sequelize = sequelize;

    // init models and add them to the exported db object
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
    db.Employee = require('../employees/employee.model')(sequelize);
    db.Department = require('../departments/department.model')(sequelize);
    db.Workflow = require('../workflows/workflow.model')(sequelize);
    db.Request = require('../requests/request.model')(sequelize);
    db.RequestItem = require('../requests/request-item.model')(sequelize);

    // define relationships
    // Account - Employee (one-to-one)
    db.Account.hasOne(db.Employee, { foreignKey: 'accountId', as: 'employee' });
    db.Employee.belongsTo(db.Account, { foreignKey: 'accountId', as: 'account' });

    // Department - Employee (one-to-many)
    db.Department.hasMany(db.Employee, { foreignKey: 'departmentId', as: 'employees' });
    db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });

    // Account - RefreshToken (one-to-many)
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.RefreshToken.belongsTo(db.Account);

    // Workflow relationships
    db.Employee.hasMany(db.Workflow, { foreignKey: 'employeeId', as: 'workflows' });
    db.Workflow.belongsTo(db.Employee, { foreignKey: 'employeeId', as: 'employee' });

    // Request relationships
    db.Account.hasMany(db.Request, { foreignKey: 'accountId', as: 'requests' });
    db.Request.belongsTo(db.Account, { foreignKey: 'accountId', as: 'account' });
    
    db.Request.hasMany(db.RequestItem, { foreignKey: 'requestId', as: 'items', onDelete: 'CASCADE' });
    db.RequestItem.belongsTo(db.Request, { foreignKey: 'requestId', as: 'request' });

    // sync all models with database
    await sequelize.sync({ alter: true });
}
