const AiTools = require("../model/aiTool");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

function capitalizeWords(str) {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}
const formatHitCount = (count) => {
  if (count < 1000) return count;
  return `${(count / 1000).toFixed(1)}k`.replace('.0k', 'k');
}

exports.getAllAIToolsWithOutFilter = async (req, res) => {
  try {
    const aiTools = await AiTools.find({}, "-__v");
    return res.status(200).json({ message: "AI Tools Fetched", data: aiTools });
  } catch (error) {
    console.error("Error fetching AI tools:", error);
    res.status(500).json({ error: "Failed to fetch AI tools" });
  }
};

exports.getAllAITools = async (req, res) => {
  try {
    const aiTools = await AiTools.find({ 'tools.active': true }, "-__v").sort({ category: 1 }).lean();

    const formattedAiTools = aiTools.map(category => ({
      ...category,
      category: capitalizeWords(category.category),
      tools: category.tools
        .filter(tool => tool.active)
        .map(tool => ({
          ...tool,
          title: capitalizeWords(tool.title),
          addedBy: (tool.addedBy || '').toLowerCase(),
          hitCount: formatHitCount(tool.hitCount || 0)
        }))
        // .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        // .sort((a, b) => a.title.localeCompare(b.title))
    }));

    // Sort the categories alphabetically
    formattedAiTools.sort((a, b) => a.category.localeCompare(b.category));

    const encryptedData = jwt.sign({ data: formattedAiTools }, process.env.JWT_SECRET, { expiresIn: "7m" });
    
    return res.status(200).json({ 
      message: "AI Tools Fetched", 
      data: formattedAiTools, 
      encryptedData: encryptedData 
    });
  } catch (error) {
    console.error("Error fetching AI tools:", error);
    return res.status(500).json({ error: "Failed to fetch AI tools" });
  }
};

exports.addAiTool = async (req, res) => {
  const { category, tools } = req.body;
  const newTools = [];
  const duplicates = { titles: [], urls: [] };

  if (!category || !Array.isArray(tools) || tools.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let aiToolCategory = await AiTools.findOne({ category }).session(session);

    if (!aiToolCategory) {
      aiToolCategory = new AiTools({ category, tools: [] });
    }

    const existingTitles = new Set(aiToolCategory.tools.map(tool => tool.title.toLowerCase()));
    const existingUrls = new Set(aiToolCategory.tools.map(tool => tool.url.toLowerCase()));

    tools.forEach(tool => {
      const lowerCaseTitle = tool.title.toLowerCase();
      const lowerCaseUrl = tool.url.toLowerCase();

      if (!existingTitles.has(lowerCaseTitle) && !existingUrls.has(lowerCaseUrl)) {
        existingTitles.add(lowerCaseTitle);
        existingUrls.add(lowerCaseUrl);
        newTools.push({
          ...tool,
          title: capitalizeWords(tool.title),
          addedBy: capitalizeWords(tool.addedBy || ''),
          active: tool.active !== undefined ? tool.active : false, // Use provided active value or default to false
          hitCount: 1000, // Set default hitCount to 1000
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        if (existingTitles.has(lowerCaseTitle)) duplicates.titles.push(tool.title);
        if (existingUrls.has(lowerCaseUrl)) duplicates.urls.push(tool.url);
      }
    });

    if (duplicates.titles.length > 0 || duplicates.urls.length > 0) {
      throw new Error("Duplicate tool titles or URLs found");
    }

    aiToolCategory.tools.push(...newTools);
    await aiToolCategory.save({ session });

    await session.commitTransaction();
    return res.status(201).json({ message: "AI Tool(s) added successfully", data: aiToolCategory });
  } catch (error) {
    await session.abortTransaction();
    console.error("Error adding AI tool:", error);

    if (error.message === "Duplicate tool titles or URLs found") {
      return res.status(409).json({
        error: "Duplicate tool titles or URLs found",
        duplicates
      });
    } else if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Validation error", details: error.message });
    } else if (error.code === 11000) {
      return res.status(409).json({ error: "Category already exists" });
    } else {
      return res.status(500).json({ error: "Failed to add AI tool(s)", details: error.message });
    }
  } finally {
    session.endSession();
  }
};

exports.hitCount = async (req, res) => {
  const categoryId = req.params.categoryId;
  const toolId = req.params.toolId;
  try {
    const aiTool = await AiTools.findOne({ _id: categoryId });

    if (!aiTool) {
      return res.status(404).json({ error: "AI Tool category not found" });
    }

    const tool = aiTool.tools.id(toolId);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }
    await aiTool.incrementHitCount(toolId);

    res.json({
      message: "Hit count incremented successfully",
      tool: {
        title: tool.title,
        description: tool.description,
        url: tool.url,
        hitCount: tool.hitCount
      }
    });

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.getAIToolById = async (req, res) => {
  const categoryId = req.params.categoryId;
  const toolId = req.params.toolId;
  try {
    const aiTool = await AiTools.findOne({ _id: categoryId });
  
    if (!aiTool) {
      return res.status(404).json({ error: "AI Tool category not found" });
    }

    const tool = aiTool.tools.id(toolId);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    // Create a new object that includes both the tool data and the category
    const responseData = {
      ...tool.toObject(),
      category: aiTool.category 
    };
    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching AI Tool:", error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.updateToolFromCategory = async (req, res) => {
  const { categoryId, toolId } = req.params;
  const updateData = req.body;

  try {
    const aiTool = await AiTools.findOne({ _id: categoryId });

    if (!aiTool) {
      return res.status(404).json({ error: "AI Tool category not found" });
    }

    const toolIndex = aiTool.tools.findIndex(tool => tool._id.toString() === toolId);

    if (toolIndex === -1) {
      return res.status(404).json({ error: "Tool not found in this category" });
    }

    Object.keys(updateData).forEach(key => {
      if (key !== '_id' && key !== 'createdAt') {
        aiTool.tools[toolIndex][key] = updateData[key];
      }
    });

    aiTool.tools[toolIndex].updatedAt = new Date();

    await aiTool.save();
    return res.status(200).json({
      message: "Tool updated successfully",
      data: aiTool.tools[toolIndex]
    });
  } catch (error) {
    console.error("Error updating tool:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: "Validation error", details: error.message });
    }
    return res.status(500).json({ error: "Failed to update tool" });
  }
};

exports.deleteToolFromCategory = async (req, res) => {
  const { categoryId, toolId } = req.params;
  try {
    const aiTool = await AiTools.findOneAndUpdate(
      { _id: categoryId },
      { $pull: { tools: { _id: toolId } } },
      { new: true }
    );

    if (!aiTool) {
      return res.status(404).json({ error: "AI Tool or category not found" });
    }

    return res.status(200).json({ message: "Tool deleted successfully", data: aiTool });
  } catch (error) {
    console.error("Error deleting tool:", error);
    return res.status(500).json({ error: "Failed to delete tool" });
  }
};

exports.searchAiTools = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingTools = await AiTools.aggregate([
      {
        $match: {
          $or: [
            { "tools.title": { $regex: new RegExp(query, "i") } },
            { "category": { $regex: new RegExp(query, "i") } }
          ],
          "tools.active": true // Only match active tools
        }
      },
      {
        $project: {
          category: 1,
          tools: {
            $cond: {
              if: { $regexMatch: { input: "$category", regex: new RegExp(query, "i") } },
              then: {
                $filter: {
                  input: "$tools",
                  as: "tool",
                  cond: { $eq: ["$$tool.active", true] }
                }
              },
              else: {
                $filter: {
                  input: "$tools",
                  as: "tool",
                  cond: {
                    $and: [
                      { $eq: ["$$tool.active", true] },
                      {
                        $regexMatch: {
                          input: "$$tool.title",
                          regex: new RegExp(query, "i")
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      {
        $match: {
          $or: [
            { "tools": { $ne: [] } },
            { "category": { $regex: new RegExp(query, "i") } }
          ]
        }
      }
    ]);

    return res.status(200).json({
      error: false,
      tools: matchingTools,
      message: "AI Tools matching the search query retrieved successfully",
    });
  } catch (error) {
    console.error("Error searching AI tools:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

exports.toggleToolActive = async (req, res) => {
  const { categoryId, toolId } = req.params;

  try {
    const aiTool = await AiTools.findOne({ category: categoryId });

    if (!aiTool) {
      return res.status(404).json({ error: "AI Tool category not found" });
    }

    const tool = aiTool.tools.id(toolId);

    if (!tool) {
      return res.status(404).json({ error: "Tool not found in this category" });
    }

    tool.active = !tool.active;
    tool.updatedAt = new Date();

    await aiTool.save();

    return res.status(200).json({
      message: `Tool ${tool.active ? 'activated' : 'deactivated'} successfully`,
      data: tool
    });
  } catch (error) {
    console.error("Error toggling tool active state:", error);
    return res.status(500).json({ error: "Failed to toggle tool active state" });
  }
};