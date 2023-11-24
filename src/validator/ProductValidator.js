const Joi = require('joi');

const productCreateValidator = (req, res, next) => {
    const schema = Joi.object({
        productName: Joi.string().required().messages({
            'string.empty': 'Product name cannot be empty',
            'any.required': 'Product name is required'
        }),
        cost: Joi.number().integer().multiple(5).required().messages({
            'number.base': 'Price must be a number',
            'number.integer': 'Price must be an integer',
            'number.multiple': 'Price must be a multiple of 5',
            'any.required': 'Price is required'
        }),
        sellerId: Joi.number().integer().required().messages({
            'number.base': 'Seller ID must be a number',
            'number.integer': 'Seller ID must be an integer',
            'any.required': 'Seller ID is required'
        }),
        quantity: Joi.number().integer().min(1).required().messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be at least 1',
            'any.required': 'Quantity is required'
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }

    next();
};

const productUpdateValidator = (req, res, next) => {
    const schema = Joi.object({
        productName: Joi.string().messages({
            'string.empty': 'Product name cannot be empty'
        }).optional(),
        cost: Joi.number().integer().multiple(5).messages({
            'number.base': 'Price must be a number',
            'number.integer': 'Price must be an integer',
            'number.multiple': 'Price must be a multiple of 5'
        }).optional(),
        sellerId: Joi.number().integer().required().messages({
            'number.base': 'Seller ID must be a number',
            'number.integer': 'Seller ID must be an integer',
            'any.required': 'Seller ID is required'
        }),
        quantity: Joi.number().integer().min(1).messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be at least 1'
        }).optional(),
    }).min(1); // Ensure at least one field is present for update

    const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });

    if (error) {
        return res.status(400).json({ errors: error.details.map(detail => detail.message) });
    }

    next();
};

module.exports = {
    productCreateValidator,
    productUpdateValidator
};
