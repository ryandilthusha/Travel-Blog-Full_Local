// Require necessary modules: Express for routing, custom middleware for token authentication, and a database querying helper.
const express = require('express');
const authenticateToken = require('../middleware/authenticateToken.js');
const { query } = require('../helpers/db.js');

const router = express.Router();    // Create a new router instance to define routes for this module.



// Define a GET route for '/details' to fetch user details. This route is protected by the authenticateToken middleware,
// ensuring that only requests with a valid JWT can access it.
router.get('/details', authenticateToken, async (req, res) => 
{
    try {
        // Execute a database query to fetch user details based on the userId extracted from the token.
        // Here assumes that the 'userId' is attached to 'req.user' by the authenticateToken middleware after successful token verification.
        const result = await query('SELECT * FROM users WHERE user_id = $1', [req.user.userId]);    //This userID comes from token's user object
        
        if (result.rows.length > 0)     // Check if the query returned any rows. If so, the user exists, and their details are returned.
        {
            const user1 = result.rows[0];    // Extract the first row which contains the user's details
            res.json({ username: user1.username, bio: user1.bio, profile_picture: user1.profile_picture });    // Send the user's database details as JSON.
        } 
        else 
        {
            res.status(404).json({ message: 'User not found' });    // If no rows are returned, the user does not exist in the database. 
        }
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Export the router to make it available for use in other parts of the application, particularly in the main server file (index.js).
module.exports = router;