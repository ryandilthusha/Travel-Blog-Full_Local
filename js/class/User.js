//  This file is focused on representing the data and behaviors of an individual user. 

// Define a class to represent a User
class User 
{
    #username;
    #bio;
    #profilePicture;

    constructor(username, bio, profilePicture) 
    {
        this.#username = username;
        this.#bio = bio;
        this.#profilePicture = profilePicture;
    }

    getUsername() 
    {
        return this.#username;
    }

    getBio() 
    {
        return this.#bio;
    }

    getProfilePicture() 
    {
        return this.#profilePicture;
    }
}

export { User };
