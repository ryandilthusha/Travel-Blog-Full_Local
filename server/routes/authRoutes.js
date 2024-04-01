// Importing necessary modules: 'express' for routing and our custom 'db.js' for database operations.
const express = require('express');
const { query } = require('../helpers/db.js'); 

// Initializing a router to define routes related to user authentication.
const router = express.Router();


const jwt = require('jsonwebtoken');




// Define a POST route for '/login' to handle user login requests.
router.post('/login', async (req, res) => {
    try 
    {
        // Extract 'username' and 'password' from the request body. Request body comes from FronEnd login.js ->Users.js-> authenticate() method).
        const { username, password } = req.body;
        /*
        req.body like this:
        req.body = {
            "username": "user123",
            "password": "pass123"
        };

        On the server side, Express parses this JSON body and places it into req.body.
        Without destructuring, we would access these values like so:
        const username = req.body.username;
        const password = req.body.password;        
        */

        
        // Execute a database query to find a user by 'username'. '$1' is replaced by 'username' to prevent SQL injection.
        const result = await query('SELECT * FROM users WHERE username = $1', [username]);
        

        
        if (result.rows.length > 0)     // If the query returns at least one row, it means a user with the provided username exists.
        {
            // Assigning the first result row to 'user'.
            const user = result.rows[0];
            /*
            Assuming the result of the query is as follows:
            result.rows[0] = {
                "username": "user123",
                "password": "pass123",
                "bio": "Example bio",
                "profile_picture": "url/to/profile_picture.jpg"
            };
            This is the user object retrieved from the database.
            */
    
            // Check if the provided password matches the one stored in the database.
            if (user.password === password) 
            {

                //Generate a JWT when the user successfully logs 
                //This user object is then ENCODED into a JWT token using jwt.sign(). This will DECODED in server/middleware/authenticateToken.js
                const token = jwt.sign(
                    { userId: user.user_id }, // Ensure this matches the database field
                    process.env.JWT_SECRET, // Replace 'your_secret_key' with a real secret key stored in .env file
                    { expiresIn: '1h' } // Options: Token expires in 1 hour
                );     
                /*
                Hence the payload encoded into the JWT would like this: 
                {
                    userId: "user's unique identifier",
                    iat: 1619623058,
                    exp: 1619626658
                }
                */


                // If user.password === password match, send a response indicating successful login.
                res.status(200).json({
                    login: true,
                    message: 'Login successful',
                    token,
                    username: user.username, 
                    bio: user.bio, 
                    profile_picture: user.profile_picture
                });
            } 
            // This is what the client (e.g., browser or mobile app) receives as a response:
            /*
            HTTP/1.1 200 OK
            Content-Type: application/json

            {
                "login": true,
                "message": "Login successful",
                "username": "user123",
                "bio": "A short bio here",
                "profile_picture": "url/to/profile_picture.jpg"
            }
            */

            else 
            {
                // If they don't match, send a response indicating the password is incorrect.
                res.status(200).json({ login: false, message: 'Invalid username or password' });
            }
        } 
        
        else 
        {
            // If no users were found with the provided username, inform the client.
            res.status(200).json({ login: false, message: 'User not found' });
        }
    } 
    
    catch (error) 
    {
        // If an error occurs during the process, log it and inform the client.
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});





// Export 'router' so it can be imported and used in 'index.js' to define application routes.
module.exports = router;
