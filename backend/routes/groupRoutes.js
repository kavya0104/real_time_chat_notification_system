const express = require("express");
const Group = require("../models/Group");  // Import the Group model
const User = require("../models/userModel");  // Import the User model
const router = express.Router();

// Create a new group
router.post("/create-group", async (req, res) => {
  const { groupName, createdBy, members } = req.body;  // Group name, creator, and member IDs

  try {
    const group = new Group({
      groupName,
      createdBy,
      members,  // List of user IDs to be added to the group
    });

    await group.save();  // Save group to the database
    res.status(201).json(group);  // Return the newly created group
  } catch (error) {
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Add a user to an existing group
router.post("/add-user", async (req, res) => {
  const { groupId, userId } = req.body;  // Group ID and user ID to add

  try {
    const group = await Group.findById(groupId);  // Find the group by ID
    if (!group) return res.status(404).json({ error: "Group not found" });

    // Add user to the group's members array
    group.members.push(userId);
    await group.save();  // Save the updated group
    res.status(200).json({ message: "User added to the group", group });
  } catch (error) {
    res.status(500).json({ error: "Error adding user to group" });
  }
});

// Remove a user from a group
router.post("/remove-user", async (req, res) => {
  const { groupId, userId } = req.body;  // Group ID and user ID to remove

  try {
    const group = await Group.findById(groupId);  // Find the group by ID
    if (!group) return res.status(404).json({ error: "Group not found" });

    // Remove user from the group's members array
    group.members = group.members.filter((member) => member.toString() !== userId);
    await group.save();  // Save the updated group
    res.status(200).json({ message: "User removed from the group", group });
  } catch (error) {
    res.status(500).json({ error: "Error removing user from group" });
  }
});

module.exports = router;
