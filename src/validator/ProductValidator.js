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

const productBuyValidator = (req, res, next) => {
    // Validating userId from the request body
    const bodySchema = Joi.object({
        userId: Joi.number().integer().required().messages({
            'number.base': 'User ID must be a number',
            'number.integer': 'User ID must be an integer',
            'any.required': 'User ID is required'
        })
    });

    // Validating productId from the route parameters
    const paramsSchema = Joi.object({
        id: Joi.number().integer().required().messages({
            'number.base': 'Product ID must be a number',
            'number.integer': 'Product ID must be an integer',
            'any.required': 'Product ID is required'
        })
    });

    const bodyValidation = bodySchema.validate(req.body, { abortEarly: false });
    const paramsValidation = paramsSchema.validate(req.params, { abortEarly: false });

    // Combine errors from both validations if any
    const errors = [];
    if (bodyValidation.error) errors.push(...bodyValidation.error.details);
    if (paramsValidation.error) errors.push(...paramsValidation.error.details);

    if (errors.length > 0) {
        return res.status(400).json({ errors: errors.map(detail => detail.message) });
    }

    next();
};

module.exports = {
    productCreateValidator,
    productUpdateValidator,
    productBuyValidator
};
