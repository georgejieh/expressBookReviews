const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Session middleware configuration
app.use("/customer", session({
    secret: "fingerprint_customer", // Secret key for signing session cookies
    resave: true,
    saveUninitialized: true
}));

// Authentication middleware for "/customer/auth/*" routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Retrieve the token from the session
    const token = req.session.token;

    if (!token) {
        // If no token exists in the session, return unauthorized
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            // If the token is invalid or expired, return forbidden
            return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        }

        // Token is valid; attach user info to the request object
        req.user = decoded; // Example: decoded token may contain { username, role, etc. }
        next(); // Pass control to the next middleware or route handler
    });
});

const PORT = 5000;

// Define routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("Server is running on port " + PORT));