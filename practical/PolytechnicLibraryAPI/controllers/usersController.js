const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    // Validate user data
    if (!username || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validRoles = ["member", "librarian"];
    if (!validRoles.includes(role)) {
      return res
        .status(400)
        .json({ message: "Role must be either member or librarian" });
    }

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain at least one letter, one number, and one special character",
      });
    }

    // Check for existing username
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in database
    const newUser = {
      username,
      passwordHash: hashedPassword,
      role,
    };
    const createdUser = await User.registerUser(newUser);

    return res
      .status(201)
      .json({ message: "User created successfully", user: createdUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const result = await User.login(username, password);
    if (!result) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ token: result.token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving users");
  }
};

const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving user");
  }
};

const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const newUserData = req.body;

  try {
    const updatedUser = await User.updateUser(userId, newUserData);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating user");
  }
};

const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).send("User not found");
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting user");
  }
};

const searchUsers = async (req, res) => {
  const searchTerm = req.query.searchTerm; // Extract search term from query params
  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching users" });
  }
};

const getUsersWithBooks = async (req, res) => {
  try {
    const users = await User.getUsersWithBooks();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users with books" });
  }
};

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  getUsersWithBooks,
  login,
};
