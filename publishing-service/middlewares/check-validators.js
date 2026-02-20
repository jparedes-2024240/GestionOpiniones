import { validationResult } from "express-validator";

export const checkValidators = (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: 'Validation errors in the request',
            errors: errors.array().map(err => ({
                post: err.path || err.param,
                message: err.msg
            }))
        });
    }

    next();
}