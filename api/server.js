// BUILD YOUR SERVER HERE
const express = require('express')

const User = require('./users/model')

const server = express()
server.use(express.json())

server.post("/api/users", (req, res) => {
    const user = req.body;
    if (!user.name || !user.bio) { // Check if user object exists and has name and bio
        res.status(400).json({
            message: "Please provide name and bio for the user"
        });
    } else {
        User.insert(user)
            .then(newUser => {
                res.status(201).json(newUser); // Sending back the newly created user
            })
            .catch(err => {
                res.status(500).json({
                    message: "Error inserting user",
                    error: err.message
                });
            });
    }
});



server.get("/api/users", (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: "Error getting users",
                err: err.message,
                stack: err.stack
            })
        })
})

server.get("/api/users/:id", (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                // If user is not found, return a 404 response
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                });
            }
            res.json(user);
        })
        .catch(err => {
            res.status(500).json({
                message: "Error getting user",
                err: err.message,
                stack: err.stack
            });
        });
});



server.put(`/api/users/:id`, (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    // Check if the request body is missing the 'name' or 'bio' property
    if (!changes.name || !changes.bio) {
        return res.status(400).json({
            message: "Please provide name and bio for the user"
        });
    }

    // Update the user in the database
    User.update(id, changes)
        .then(updatedUser => {
            if (!updatedUser) {
                // If the user with the specified id is not found
                return res.status(404).json({
                    message: "The user with the specified ID does not exist"
                });
            }
            // If the user is successfully updated
            res.json(updatedUser);
        })
        .catch(err => {
            // If there's an error when updating the user
            res.status(500).json({
                message: "The user information could not be modified",
                err: err.message,
                stack: err.stack
            });
        });
});


server.delete("/api/users/:id", (req, res) => {
    User.remove(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: "The user with the specified ID does not exist"
                });
            } else {
            res.json(user);
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "The user could not be removed",
                err: err.message,
                stack: err.stack
            });
        });
})


server.use("*", (req, res) => {
    res.status(400).json({
        message: "Not found."
    })
})


module.exports = server; // EXPORT YOUR SERVER instead of {}
