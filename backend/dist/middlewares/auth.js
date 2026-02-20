"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const db_1 = require("../config/db");
const authenticate = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const apiSecret = req.headers['x-api-secret'];
    if (!apiKey || !apiSecret) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    try {
        const result = await (0, db_1.query)('SELECT * FROM merchants WHERE email = $1', ['test@example.com']);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        req.merchant = result.rows[0];
        next();
    }
    catch (error) {
        console.error('Auth error', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.authenticate = authenticate;
