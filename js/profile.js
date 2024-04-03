//................................. FETCH THE PROFILE HEADERS FROM BACKEND TO THE FRONTEND .................................//
// Define an asynchronous function to fetch user details from the server.
async function fetchUserDetails() {
    try {
        // Use the Fetch API to send a GET request to the server endpoint that returns user details.        
        const response = await fetch('http://localhost:3001/api/user/details', {
            method: 'GET', // Specify the HTTP method.
            headers: {
                'Content-Type': 'application/json', // Indicate the type of content expected in the response.
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the authentication token stored in localStorage in the Authorization header.
            },
        });
        // The response recieving by server/routes/userRoutes.js route of /details
        // Response is Database Table specific user values in JSON format

        // If the response is not successful, log the error.
        if (response.ok === false) {
            console.error('Failed to fetch user details due to response status:', response.status);
            return; // Exit the function if there was a problem with the request.
        }

        // Parse the JSON response to get user details. (receive the response from the server/routes/userRoutes.js. which is database table user related details in JSON format)
        const userDetails = await response.json();
        /*
        The 'userDetails' variable an object that contains information about the user fetched from the server in JSON format
        {
            "username": "johnDoe123",
            "bio": "Hello, I'm John Doe! I love coding and exploring new technologies. Currently learning about web development.",
            "profile_picture": "https://example.com/path/to/johnDoe123/profile_picture.jpg"
        }
        */

        // Call updateProfile to update the webpage with the user's details.
        updateProfile(userDetails);
    } 
    
    catch (error) 
    {
        console.error('Error fetching user details:', error);
    }
}

function updateProfile( userDetails) {
    // Update the DOM elements with the user's details.
    document.getElementById('userName').textContent = userDetails.username;
    document.getElementById('userBio').textContent = userDetails.bio;

    // Uncomment the line below if you want to update the profile picture as well.
    // document.getElementById('profilePicture').setAttribute('src', profilePicture);
}


// Call fetchUserDetails to initiate the fetch operation.
fetchUserDetails();






//................................. FETCH THE PROFILE HEADERS FROM BACKEND TO THE FRONTEND .................................//
async function fetchTravelerStats() {
    try {
        const response = await fetch('http://localhost:3001/api/user/stats', 
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        // The response recieving by server/routes/userRoutes.js route of /stats
        // Response is Database Table specific user values in JSON format

        if (!response.ok) 
        {
            throw new Error('Failed to fetch traveler stats');
        }

        const stats = await response.json();
        updateTravelerStatsSection(stats);
    } 
    catch (error) 
    {
        console.error('Error fetching traveler stats:', error);
    }
}

function updateTravelerStatsSection(stats) 
{
    document.getElementById('countriesVisited').textContent = stats.countries_visited;
    document.getElementById('citiesExplored').textContent = stats.cities_explored;
    document.getElementById('favoriteDestination').textContent = stats.favorite_destination;
    document.getElementById('bucketList').textContent = stats.bucket_list;
}

// Ensure to call fetchTravelerStats along with fetchUserDetails or at the appropriate time
fetchTravelerStats();





//................................. FUNCTION TO SUBMIT FORM DATA (USER'S NEW DETAILS) .................................//
document.addEventListener('DOMContentLoaded', function() 
{
    document.getElementById('saveChangesBtn').addEventListener('click', function(event) 
    {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const bio = document.getElementById('bio').value;

        // Simple password match check
        if (newPassword !== confirmPassword) 
        {
            alert('Passwords do not match!');
            return;
        }

        // Prepare data to be sent
        const userData = { username, password: newPassword, bio };
        /*
        {
            Shorthand: { username, password: newPassword, bio }
            Full Syntax: { username: username, password: newPassword, bio: bio }

            "username": "RyanWick1",
            "password": "123",
            "bio": "I'm a web developer."
        }

        */

        // Make fetch request to update user details
        fetch('http://localhost:3001/api/user/updateDetails', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        })

        .then(response => {
            if (!response.ok) 
            {
                throw new Error('Failed to update user details');
            }

            return response.json();
        })

        // After the fetch request inside your form submission handler
        .then(data => {
            // Assuming 'data' contains the updated user information
            alert('User details updated successfully');

            // Directly update the UI with the new details
            document.getElementById('userName').textContent = data.username;
            document.getElementById('userBio').textContent = data.bio;

            // Reset the form or specific input fields if necessary
            document.getElementById('editUserForm').reset();
        })

        .catch(error => {
            console.error('Error updating user details:', error);
            alert('Failed to update user details. Please try again.');
        });
    });
});







//................................. NOW THE Travel Stat EACH Edit Button's Modals .................................//

//................................. i. POST(UPDATE) THE Travel Stat - Countries Visited with it's Edit Button's Modal .................................//
// JavaScript to handle modal form submission
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for form submission
    document.getElementById('editCountriesForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const countriesVisited = document.getElementById('countriesVisitedInput').value; // Get the new value

        // Call the function to update the server and UI
        updateCountriesVisited(countriesVisited);
    });
});

function updateCountriesVisited(value) {
    fetch('http://localhost:3001/api/user/countriesVisited', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure you're sending the token for authorization
        },
        body: JSON.stringify({ countriesVisited: value })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        // Assuming the server responds with the updated value
        document.getElementById('countriesVisited').textContent = data.countries_visited;
        $('#editCountriesModal').modal('hide'); // Close the modal on successful update
    })
    .catch(error => {
        console.error('Error updating countries visited:', error);
        alert('Failed to update countries visited.');
    });
}



//................................. ii. POST(UPDATE) THE Travel Stat - Cities Explored with it's Edit Button's Modal .................................//
document.addEventListener('DOMContentLoaded', function() 
{
    const editCitiesForm = document.getElementById('editCitiesForm');
    
    // Assuming we've fetched and stored the current number of cities explored
    // document.getElementById('citiesExploredInput').value = currentUserCitiesExplored;

    editCitiesForm.addEventListener('submit', function(event) 
    {
        event.preventDefault(); // Prevent the default form submission behavior
        const citiesExplored = document.getElementById('citiesExploredInput').value; // Get the updated value

        updateCitiesExplored(citiesExplored); // Call the function to handle the update
    });
});

function updateCitiesExplored(value) {
    fetch('http://localhost:3001/api/user/citiesExplored', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the auth token
        },
        body: JSON.stringify({ citiesExplored: value })
    })
    
    .then(response => {
        if (!response.ok) 
        {
            throw new Error('Network response was not ok');
        }

        return response.json(); // Assuming the server sends back the updated value
    })

    .then(data => {
        // Update the UI with the new value and close the modal
        document.getElementById('citiesExplored').textContent = data.cities_explored;
        $('#editCitiesModal').modal('hide'); // Using jQuery to hide the modal
    })

    .catch(error => {
        console.error('Error updating cities explored:', error);
        alert('Failed to update cities explored.');
    });
}




//................................. iii. POST(UPDATE) THE Travel Stat - Favorite Destination with it's Edit Button's Modal .................................//
document.addEventListener('DOMContentLoaded', function() {
    const editDestinationForm = document.getElementById('editDestinationForm');
    
    // Event listener for form submission
    editDestinationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const favoriteDestination = document.getElementById('favoriteDestinationInput').value; // Get updated value
        
        updateFavoriteDestination(favoriteDestination); // Function to handle the update
    });
});

function updateFavoriteDestination(value) {
    fetch('http://localhost:3001/api/user/favoriteDestination', { // Adjust endpoint as necessary
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
        },
        body: JSON.stringify({ favoriteDestination: value })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Assuming server responds with updated value
    })
    .then(data => {
        // Update UI with new value and close the modal
        document.getElementById('favoriteDestination').textContent = data.favorite_destination;
        $('#editDestinationModal').modal('hide'); // Using jQuery to hide modal
    })
    .catch(error => {
        console.error('Error updating favorite destination:', error);
        alert('Failed to update favorite destination.');
    });
}





//................................. iv. POST(UPDATE) THE Travel Stat - Bucket List with it's Edit Button's Modal .................................//
document.addEventListener('DOMContentLoaded', function() {
    const editBucketListForm = document.getElementById('editBucketListForm');
    
    editBucketListForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const bucketList = document.getElementById('bucketListInput').value; // Get the updated bucket list
        
        updateBucketList(bucketList); // Function to handle the update
    });
});

function updateBucketList(value) {
    fetch('http://localhost:3001/api/user/bucketList', { // Adjust this to your actual API endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the auth token
        },
        body: JSON.stringify({ bucketList: value })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Assuming the server responds with the updated bucket list
    })
    .then(data => {
        // Update the UI with the new bucket list and close the modal
        document.getElementById('bucketList').textContent = data.bucket_list;
        $('#editBucketListModal').modal('hide'); // Using jQuery to hide the modal
    })
    .catch(error => {
        console.error('Error updating bucket list:', error);
        alert('Failed to update bucket list.');
    });
}














//................................. FETCH THE RECENT REVIEWS FROM BACKEND TO THE FRONTEND .................................//
/*
.
.
.
.
.
.

*/