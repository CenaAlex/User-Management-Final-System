const db = require('_helpers/db');
const { Op } = require('sequelize');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    const employees = await db.Employee.findAll({
        include: [
            { model: db.Account, as: 'account' }
        ]
    });
    return employees;
}

async function getById(id) {
    const employee = await getEmployee(id);
    return employee;
}

async function create(params) {
    // Generate employee ID if not provided
    if (!params.employeeId) {
        const date = new Date();
        const year = date.getFullYear().toString().substr(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        
        // Get count of employees created this month
        const count = await db.Employee.count({
            where: {
                created: {
                    [Op.gte]: new Date(date.getFullYear(), date.getMonth(), 1)
                }
            }
        });
        
        // Format: YY-MM-XXXX (e.g., 23-01-0001)
        params.employeeId = `${year}-${month}-${(count + 1).toString().padStart(4, '0')}`;
    }
    
    // Create employee
    const employee = await db.Employee.create(params);
    
    return await getEmployee(employee.id);
}

async function update(id, params) {
    const employee = await getEmployee(id);
    
    // Copy params to employee and save
    Object.assign(employee, params);
    employee.updated = new Date();
    await employee.save();
    
    return await getEmployee(id);
}

async function _delete(id) {
    const employee = await getEmployee(id);
    await employee.destroy();
}

// Helper functions
async function getEmployee(id) {
    const employee = await db.Employee.findByPk(id, {
        include: [
            { model: db.Account, as: 'account' }
        ]
    });
    if (!employee) throw 'Employee not found';
    return employee;
} 