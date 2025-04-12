"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorization = void 0;
const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.user)
            throw new Error("You are not authorized");
        try {
            const userRole = req.user.role;
            if (userRole && roles.includes(userRole)) {
                next();
            }
            else {
                throw new Error("You are not authorized");
            }
        }
        catch (error) {
            throw new Error("You are not authorized");
        }
    };
};
exports.authorization = authorization;
