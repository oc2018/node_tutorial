// import { createRequire } from 'module';
// import fsPromises from 'fs/promises';
// import * as path from 'path';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

// const require = createRequire(import.meta.url);
// const employeesData = require( '../model/employees.json');

// const __dirname = dirname(fileURLToPath(import.meta.url));

// const data = {
//     employees: employeesData,
//     setEmployees: function  (data) {this.employees = data}
// }
import mongoose from 'mongoose';
import { Employee } from '../model/Employee.js';
import { errorHandler } from '../middleware/errorHandler.js';

export const getAllEmployees = async(req, res)=> {

    try {        
        const employees = await Employee.find().sort({_id: -1});
        if(!employees) {
            res.status(204).jsom({ 'message': 'No employees found'})
        }
        res.json(employees);
    } catch (error) {
        errorHandler(error);
    }

}

export const createNewEmployee = async(req, res, next) => {
    const { firstname, lastname } = req.body;
    // console.log(data);
    // {
    //     id: data.employees[data.employees.length -1].id + 1 || 1,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname
    // }
    
    try {

        if (!req?.body?.firstname || !req?.body?.lastname){
            return res.status(400).json({ 'message': 'First and last name are required'});
        }

        const newEmployee = new Employee({ firstname, lastname });
        await newEmployee.save();    

        res.status(201).json( newEmployee );
    } catch (error) {
        errorHandler(error);
    }
    
    // data.setEmployees([ ...data.employees, newEmployee ]);

    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'employees.json'),
    //     JSON.stringify(data.employees)
    // );

}

export const updateEmployee = async (req, res) => {
    // const { id: _id } = req.params;
    const { _id, firstname, lastname } = req.body
    try {
    if(!_id) {
        return res.status(400).json({'message': `ID parameter is required`});
    }

    if(!req?.body?.firstname || !req?.body?.lastname) {
        return res.status(400).json({ "message": `No Employee matches Id: ${ _id }`});
    } 
    
    if(!mongoose.Types.ObjectId.isValid( _id)) {
        return res.status(404).json({'message': `No employee with id: ${_id}`});
    } 
        
        const updatedEmployee = await Employee.findByIdAndUpdate(_id, {  firstname, lastname }, { new: true });
        res.status(200).json(updatedEmployee);
    } catch (error) {
        errorHandler(error);
    }

    // console.log(updatedEmployee)
    // if (req.body.firstname) employee.firstname = req.body.firstname;
    // if (req.body.lastname) employee.lastname = req.body.lastname;
    
    // const filterdArray = data.employees.filter(emp => emp.id !== parseInt(req.body.id));
    // const unsortedArray = [...filterdArray, employee];

    // data.setEmployees(unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0 ));
}

export const deleteEmployee = async (req, res) => {
    const{ id: _id } = req.body;

    try {    
    
    
    if (!mongoose.Types.ObjectId.isValid( _id ) || !_id ) {
        res.status(400).json({ "message": `Employee Id: ${ _id } not found`});
    } 
        await Employee.findByIdAndDelete( _id);

        if(!_id) return res.status(204).json({ 'message': `No Employee with Id: ${_id}`});
            
        res.status(200).json({ 'message': `Employee id no: ${ _id } deleted successfuly` });
    } catch (error) {
        errorHandler(error);
        // res.json({'message': error.message });
    }
    
}

export const getEmployee = async (req, res) =>{
    const { id: _id } = req.params;
    try {

        const employee = await Employee.findById(_id);  
        if(!employee) {
            res.status(204).jsom({ "message": `No Employee matches Id: ${ _id }`})
        } 
        
        res.status(200).json(employee);
    } catch (error) {
        errorHandler(error);
    }

}
