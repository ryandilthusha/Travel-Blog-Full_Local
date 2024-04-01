//................................. ROUTE FOR USER PROFILE SECTION .................................//
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
            res.json({ username: user1.username, bio: user1.bio, profile_picture: user1.profile_picture });    // Send the user's database details as JSON. (This send to Fronend profile.js file)
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



//................................. ROUTE FOR FETCH DETAILS FOR WHOLE TRAVEL STATS SECTION .................................//
router.get('/stats', authenticateToken, async (req, res) => 
{
    try 
    {
        const result = await query('SELECT * FROM travel_stats WHERE user_id = $1', [req.user.userId]); // Use userID from token's user object
        
        if (result.rows.length > 0) 
        {
            res.json(result.rows[0]);       // Send the user's database details as JSON. (This send to Fronend profile.js file)
        } 

        else 
        {
            res.status(404).json({ message: 'Stats not found' });
        }
    } 
    
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




//................................. i. ROUTE FOR POST(UPDATE) THE Travel Stat - Countries Visited .................................//
router.post('/countriesVisited', authenticateToken, async (req, res) => 
{
    // Extract the user ID from the authenticated user's data and the new 'countriesVisited' value from the request body.
    const { userId } = req.user;            // // Extract the user ID from the JWT payload which is in network request header part
    const { countriesVisited } = req.body;  // // Extract the new "countriesVisited" value from network request body part

    // Additional Part: Validate the 'countriesVisited' input to ensure it's a positive number. (For example Countries Visited: -1 is not possible)
    if (!countriesVisited || countriesVisited < 0) 
    {
        return res.status(400).json({ message: 'Invalid input for countries visited.' });
    }

    //Important Part
    try 
    {
        const result = await query(
            'UPDATE travel_stats SET countries_visited = $1 WHERE user_id = $2 RETURNING *;',
            [countriesVisited, userId]  // Substitute $1 and $2 with "countriesVisited" and "userId" values respectively.
        );

        // Additional Part: Check if the query didn't update any rows, possibly because the user ID doesn't exist in "travel_stats".
        if (result.rows.length === 0) {
            // No rows updated, possibly because the user_id doesn't exist in travel_stats
            return res.status(404).json({ message: 'User stats not found.' });
        }

        res.json(result.rows[0]);   // If the update is successful, return the updated record.
    } 
    
    catch (error) 
    {
        console.error('Failed to update countries visited:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//................................. ii. ROUTE FOR POST(UPDATE) THE Travel Stat - Cities Explored .................................//
// Example using Express.js and assuming `query` is a function to execute SQL commands
router.post('/citiesExplored', authenticateToken, async (req, res) => {
    const { userId } = req.user; // Extract user ID from JWT
    const { citiesExplored } = req.body;

    try 
    {
        // Update the number of cities explored for the user
        const result = await query(
            'UPDATE travel_stats SET cities_explored = $1 WHERE user_id = $2 RETURNING cities_explored;',
            [citiesExplored, userId]
        );

        if (result.rows.length === 0) 
        {
            return res.status(404).json({ message: 'User stats not found.' });
        }

        res.json(result.rows[0]);
    } 
    
    catch (error) {
        console.error('Failed to update cities explored:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



//................................. iii. ROUTE FOR POST(UPDATE) THE Travel Stat - Favorite Destination .................................//
// Example using Express.js
router.post('/favoriteDestination', authenticateToken, async (req, res) => {
    const { userId } = req.user; // Extract user ID from JWT
    const { favoriteDestination } = req.body;

    try {
        // Update favorite destination for the user in the database
        const result = await query(
            'UPDATE travel_stats SET favorite_destination = $1 WHERE user_id = $2 RETURNING favorite_destination;',
            [favoriteDestination, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User stats not found.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Failed to update favorite destination:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





//................................. iv. ROUTE FOR POST(UPDATE) THE Travel Stat - Bucket List .................................//
router.post('/bucketList', authenticateToken, async (req, res) => {
    const { userId } = req.user; // Extract user ID from JWT
    const { bucketList } = req.body;

    try {
        // Update the bucket list for the user in the database
        const result = await query(
            'UPDATE travel_stats SET bucket_list = $1 WHERE user_id = $2 RETURNING bucket_list;',
            [bucketList, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User stats not found.' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Failed to update bucket list:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});







//................................. ROUTE FOR RECENT REVIEW SECTION .................................//
/*
.
.
.
.
.
.

*/






// Export the router to make it available for use in other parts of the application, particularly in the main server file (index.js).
module.exports = router;