/* eslint-disable no-undef */
/* eslint-disable indent */
/* eslint-disable no-tabs */
/* eslint-disable func-names */

const dbConn = require('./../../config/db.config');
// Employee object create
const Employee = function (employee) {
  this.CategoryName = employee.CategoryName;
  this.CategoryID = employee.CategoryID;
  this.ParentCategoryID = employee.ParentCategoryID;
	this.CategoryPosition = employee.CategoryPosition;
	this.description = employee.description;
};
Employee.insertCategory = function (data) {
  dbConn.query('INSERT INTO categories set ?', data, (err, res) => {
    if (err) {
      console.log('error: ', err);
      return (err);
      // result(err, null);
		}
		// console.log(res);
		// console.log(Employee[0]);
		const result = JSON.parse(JSON.stringify(res));
		console.log('\n\n\n');
		console.log(result);
		console.log('\n\n\n');
		// console.log(res.insertId);
    return { insertId: res.insertId };
    // console.log(res.insertId);
    // result(null, res.insertId);
  });
};
Employee.findLastestCategoryId = function (result) {
  dbConn.query('Select * from categories order by CategoryID desc limit ?', 1, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return (err);
		}
		console.log(res);
		const string = JSON.stringify(res);

		console.log('string is:', string);
		// const json = JSON.parse(string);
		console.log('JSON is:', string);
    return (JSON.parse(res));
    // result(null, res);
  });
};

Employee.findLastCatPosition = function (result) {
  dbConn.query('Select CategoryPosition from categories order by CategoryPosition desc limit ?', 1, (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(err, null);
      return (err);
		}
		// console.log(res[RowDataPacket]);
    return (res);
    // result(null, res);
  });
};


Employee.findAll = function (result) {
  dbConn.query('Select * from employees', (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
    } else {
      console.log('employees : ', res);
      result(null, res);
    }
  });
};
Employee.update = function (id, employee, result) {
  dbConn.query('UPDATE employees SET first_name=?,last_name=?,email=?,phone=?,organization=?,designation=?,salary=? WHERE id = ?', [employee.first_name, employee.last_name, employee.email, employee.phone, employee.organization, employee.designation, employee.salary, id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};
Employee.delete = function (id, result) {
  dbConn.query('DELETE FROM employees WHERE id = ?', [id], (err, res) => {
    if (err) {
      console.log('error: ', err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};
module.exports = Employee;
