// backend/routes/userRoutes.js
const express = require("express");
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  getUserById,
} = require("../controllers/userController");
const router = express.Router();

router.post("/users/createUser", createUser);
router.get("/users/getDetails", getUsers);
router.get("/users/getUserById/:id", getUserById);
router.put("/users/updateUser/:id", updateUser);
router.delete("/users/deleteUser/:id", deleteUser);

module.exports = router;
