const customerModel = require('../models/model.customer');
let Validator = require('fastest-validator');
let customer ={};
let counter = 0;
let customerValidator = new Validator();
let namePattern = /([A-Za-z\-\’])*/;
let zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
const CustomerVSchema = {
    guid: {type: "string", min:3},
    first_name: {type: "string", min: 1, max: 50, pattern: namePattern},
    last_name: {type: "string", min: 1, max: 50, pattern: namePattern},
    email: {type: "email", max: 75},
    zipcode: {type: "string", max: 5, pattern: zipCodePattern},
    password: {type: "string", min: 2, max: 50, pattern: passwordPattern}
};
class CustomerService{
    static create(data){
        var vres = customerValidator.validate(data, CustomerVSchema);
        if(!vres === true){
            let errors = {}, item;
            for(const index in vres){
                item = vres[index];
                errors[item.field] = item.message;
            }
            throw{
                name: "validationError",
                message: errors
            };
        }
        let customer = new customerModel(data.first_name, data.last_name, data.email, data.zipcode,
            data.password);
            customer.uid = 'c'+ counter++;
            customers[customer.uid] = customer;
            return customer;
    }
    static retrieve(uid){
        if(customer[uid] != null){
            return customers[uid];
        } else{
            throw new Error('Unable to retreive a customer by (uid: '+ uid+')');
        }
    }
    static update(uid, data){
        if(customers[uid] != null){
            const customer = customers[uid];
            Object.assign(customer, data);
        } else{
            throw new Error('unable to update a customer by (uid: '+cuid+')');
        }
    }
    static delete(uid)
	{
		if(customers[uid] != null)
		{
			delete customers[uid];
		}
		else
		{
			throw new Error('Unable to retrieve a customer by (uid:'+ cuid +')');
		}
	}
}
module.exports = CustomerService;