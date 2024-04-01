import { Users } from "./class/Users.js";       // Import the Users class from Users.js to use its authentication method.
const user1 = new Users('http://localhost:3001');   // Create user1 object for the Users class, providing the backend URL as a parameter to where the login API is hosted.




const login_btn = document.getElementById('login_btn');

login_btn.addEventListener('click', function(event) {
    console.log('Button clicked'); // For debugging purposes to confirm the button click event is captured.
    
    event.preventDefault(); // Prevent the default action of the button click from occurring, which is submitting the form. This allows us to handle the submission manually.

    // Retrieve the values entered in the username and password fields by the user. These values will be used for authentication.
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Call the authenticate method of the oser1 object. Passing in the username and password as parameters. This method returns a promise.
    user1.authenticate(username, password)

    /*
    user is an object created by the User class constructor, which might look something like this:
    {
        username: "user123",
        bio: "A short bio here",
        profile_picture: "url/to/profile_picture.jpg"
    }

    So this is passed to below .then as user argument

    
    */

    // If the authentication is successful, (If the promise resolves in Users.js), so this block of code executes.
    .then(user => 
    {        
        console.log('Login successful', user); // Log a successful login message and user details to the console for debugging.
        window.location.href = '/profile.html'; // Redirect the user to the profile page upon successful login.
    })

    // If the authentication fails (e.g., incorrect credentials), the promise is rejected, and this catch block executes.
    .catch(error => 
    {        
        console.error('Login failed', error); // Log an error message to the console to indicate the login failed.
        alert('Failed to log in: ' + error.message); // Display an alert to inform the user that the login attempt failed, along with the error message.
    });
});
