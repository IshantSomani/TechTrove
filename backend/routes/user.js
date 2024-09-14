const express = require("express");
const { createNewUser, oldUserMessage, getAllUser, getUserById, updateUser, deleteUser, aiToolsByUser, getUserByEmail } = require("../controller/user");
const router = express.Router();

router.post("/create-user", createNewUser);
router.post("/users-ai-tool/:id/aitools", aiToolsByUser);
router.post("/old-user-message/:id/messages", oldUserMessage);
router.get("/get-all-user", getAllUser);
router.get("/get-user/:id", getUserById);
router.get('/get-user-email/:email', getUserByEmail);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

module.exports = router;