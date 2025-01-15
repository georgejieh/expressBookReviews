const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer", // Secret key for signing session cookies
    resave: false, // Prevent unnecessary session saving if no changes are made
    saveUninitialized: false, // Do not save uninitialized sessions to reduce storage overhead
    cookie: {
        secure: false, // Set `true` if using HTTPS
        httpOnly: true, // Prevent client-side JavaScript from accessing the session cookie
        maxAge: 3600000 // Set cookie expiration time (1 hour in milliseconds)
    }
}));

// Authentication middleware for "/customer/auth/*" routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Retrieve token from session or Authorization header
    const token = req.session.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
        }

        // Token is valid; attach user info to the request object
        req.user = decoded;
        next(); // Pass control to the next middleware or route handler
    });
});

const PORT = 5000;

// Define routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log("Server is running on port " + PORT));