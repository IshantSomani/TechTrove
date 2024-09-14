const express = require("express");
const { getAllAITools, addAiTool, hitCount, getAIToolById, updateToolFromCategory, deleteToolFromCategory, toggleToolActive, getAllAIToolsWithOutFilter } = require("../controller/aiTool");
const router = express.Router();

router.get("/get-all-ai-tools", getAllAITools);
router.get("/getAllAIToolsWithOutFilter", getAllAIToolsWithOutFilter);
router.post("/add-ai-tool", addAiTool);
router.get("/get-ai-tools/:categoryId/tools/:toolId", getAIToolById);
router.get("/tool/:categoryId/:toolId", hitCount);
router.put("/update-tool/:categoryId/tools/:toolId", updateToolFromCategory);
router.delete("/delete-tool/:categoryId/:toolId", deleteToolFromCategory);
router.patch("/toggle-tool-active/:categoryId/tools/:toolId/toggle-active", toggleToolActive);

module.exports = router;