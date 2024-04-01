/* THIS IS A MIDDLEWARE WHICH VERIFY TOKEN WHICH SEND TO routes
The authenticateToken.js file is designed to add a security layer to an Express.js application by verifying JSON Web Tokens (JWTs) included in HTTP requests. 
When a request comes in, this middleware checks for a valid JWT in the Authorization header. 
If the token is valid, it extracts the user information from the token and attaches it to the request object, allowing subsequent handlers to access authenticated user details.
    * This middleware is used in the main server file (index.js). It's ensuring that only authenticated users can access these routes.
*/



const jwt = require('jsonwebtoken');    // Require the jsonwebtoken package to verify JWT tokens.



// Define a middleware function to authenticate JWT tokens.
function authenticateToken(req, res, next) 
{
    
    const authHeader = req.headers['authorization'];    // Retrieve the 'Authorization' header from the incoming request (From the Network Tab in Developer Tools).
    
    console.log('Auth Header:', authHeader);    // Log the value of the Authorization header for debugging purposes (log in VS Code console).

    // Extract the token from the 'Authorization' header. Tokens are typically presented as "Bearer <token>", so split the string and take the second part which is <token>.
    const token = authHeader && authHeader.split(' ')[1];   

    
    if (token == null) return res.status(401).json({ message: 'No token provided' });   // If no token is found in the 'Authorization' header, return a 401 Unauthorized response.


    // Use jsonwebtoken's verify method to check the validity of the token against the secret key stored in environment variables.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => 
    {
        
        if (err) return res.status(403).json({ message: 'Token is not valid' });    // If there's an error verifying the token (e.g., it is invalid or expired), return a 403 Forbidden response.
        
        console.log('Decoded JWT:', user);  // Log the decoded JWT payload for debugging. This usually contains the user's identity and any additional claims.
        
        req.user = user;    // Attach the decoded user information to the request object(This was encoded in server/routes/authRoutes.js), so subsequent middleware or request handlers can use the authenticated user's data.
        /* The decoded user object would like this:
        {
            userId: "user's unique identifier",
            iat: 1619623058,
            exp: 1619626658
        }
        */
        next(); // Call next() to pass control to the next middleware function in the stack.
    });
}

// Export the authenticateToken middleware to be used in other parts of the application.
module.exports = authenticateToken;
