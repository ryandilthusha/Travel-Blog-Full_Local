//  This file is focused on representing the data and behaviors of an individual user. 

// Define a class to represent a User
class User 
{
    #username;
    #bio;
    #profilePicture;

    #token; // Introduce a token property

    constructor(username, bio, profilePicture) 
    {
        this.#username = username;
        this.#bio = bio;
        this.#profilePicture = profilePicture;
        this.#token = null; // Initialize the token as null
    }

    // Getter method for username
    getUsername() {
        return this.#username;
    }

    // Getter method for bio
    getBio() {
        return this.#bio;
    }

    // Getter method for profile picture
    getProfilePicture() {
        return this.#profilePicture;
    }

    // Getter method for token
    getToken() {
        return this.#token;
    }

    // Setter method for token
    setToken(token) {
        this.#token = token;
    }
}

export { User };
