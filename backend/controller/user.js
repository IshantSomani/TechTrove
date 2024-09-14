const User = require("../model/user");
const mongoose = require("mongoose");
const AiTool = require("../model/aiTool");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const handleServerError = (res, error) => {
    console.error('Server error:', error);
    res.status(500).json({ message: "error", error: "Internal server error" });
};

const generateEncryptedData = (user) => {
    return jwt.sign(
        {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        },
        `${process.env.JWT_SECRET}`,
        { expiresIn: "45m" }
    );
};

exports.createNewUser = async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    try {
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ message: "error", error: "Missing required fields" });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: "error", error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "error", error: "User already exists" });
        }

        const user = new User({
            firstName,
            lastName,
            email,
            messages: message ? [{ content: message }] : []
        });

        await user.save();
        const encryptedData = generateEncryptedData(user);
        res.status(201).json({ user, encryptedData });
    } catch (error) {
        handleServerError(res, error);
    }
};

exports.oldUserMessage = async (req, res) => {
    const { message } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "error", error: "User not found" });
        }

        user.messages.push({ content: message });
        await user.save();

        const encryptedData = generateEncryptedData(user);
        res.status(201).json({ user, encryptedData });
    } catch (error) {
        handleServerError(res, error);
    }
};

exports.getAllUser = async (req, res) => {
    try {
        const users = await User.find();
        // const usersWithEncryptedData = users.map(user => ({
        //     user,
        //     encryptedData: generateEncryptedData(user)
        // }));
        return res.status(200).json({ message: "success", data: users });
    } catch (error) {
        handleServerError(res, error);
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
        return res.status(400).json({ message: "error", error: "User ID is required" });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "error", error: "User not found" });
        }

        const encryptedData = generateEncryptedData(user);
        return res.status(200).json({ message: "success", data: { user, encryptedData } });
    } catch (error) {
        console.error('Error in getUserById:', error);
        return res.status(500).json({ message: "error", error: error.message });
    }
};

exports.getUserByEmail = async (req, res) => {
    const userEmail = req.params.email;

    if (!userEmail) {
        return res.status(400).json({ message: "error", error: "User email is required" });
    }

    try {
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: "error", error: "User not found" });
        }

        const encryptedData = generateEncryptedData(user);
        return res.status(200).json({ user, encryptedData });
    } catch (error) {
        console.error('Error in getUserByEmail:', error);
        return res.status(500).json({ message: "error", error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { email, firstName, lastName } = req.body;

    try {
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ message: "error", error: "Email already in use" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { email, firstName, lastName },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "error", error: "User not found" });
        }

        const encryptedData = generateEncryptedData(updatedUser);
        res.json({ message: "success", data: { user: updatedUser, encryptedData } });
    } catch (error) {
        handleServerError(res, error);
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "error", error: "User not found" });
        }
        const encryptedData = generateEncryptedData(user);
        res.json({ message: "success", data: { user, encryptedData } });
    } catch (error) {
        handleServerError(res, error);
    }
};

exports.aiToolsByUser = async (req, res) => {
    const { category, title, description, url, username } = req.body;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "error", error: "User not found" });
        }

        let aiToolCategory = await AiTool.findOne({ category });
        if (!aiToolCategory) {
            aiToolCategory = new AiTool({ category });
            await aiToolCategory.save();
        }

        const newTool = new mongoose.Types.ObjectId();
        aiToolCategory.tools.push({
            _id: newTool,
            title,
            description,
            url,
            addedBy: username,
            active: "false"
        });
        await aiToolCategory.save();
        const existingCategoryIndex = user.aiTools.findIndex(
            tool => tool.category.toString() === aiToolCategory._id.toString()
        );

        if (existingCategoryIndex !== -1) {
            user.aiTools[existingCategoryIndex].tools.push(newTool);
        } else {
            user.aiTools.push({
                category: aiToolCategory._id,
                tools: [newTool]
            });
        }

        await user.save();

        const encryptedData = generateEncryptedData(user);
        return res.status(201).json({
            message: "success",
            data: {
                user,
                encryptedData,
                addedTool: {
                    category: aiToolCategory.category,
                    tool: {
                        _id: newTool,
                        title,
                        description,
                        url
                    }
                }
            }
        });
    } catch (error) {
        console.error("Error in aiToolsByUser:", error);
        handleServerError(res, error);
    }
};