import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  aiTools: [],
  encryptedData: null,
  status: "idle",
  error: null,
};

export const getAllAiTools = createAsyncThunk(
  "aiTools/getAllAiTools",
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URI}/ai-tools/get-all-ai-tools`);
    return {
      aiTools: response.data.data,
      encryptedData: response.data.encryptedData
    };
  }
);

export const getAllAIToolsWithOutFilter = createAsyncThunk(
  "aiTools/getAllAIToolsWithOutFilter",
  async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URI}/ai-tools/getAllAIToolsWithOutFilter`);
    return response.data.data;
  }
);

export const addAiTool = createAsyncThunk(
  "aiTools/addAiTool",
  async (toolData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/ai-tools/add-ai-tool`, toolData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const hitCounts = createAsyncThunk(
  "aiTools/hitCounts",
  async ({ categoryId, aiToolId }) => {
    const response = await axios.get(`${import.meta.env.VITE_API_URI}/ai-tools/tool/${categoryId}/${aiToolId}`);
    return { categoryId, aiToolId, hitCounts: response.data.tool.hitCounts };
  }
);

export const getAIToolById = createAsyncThunk(
  "aiTools/getAIToolById",
  async ({ categoryId, toolId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URI}/ai-tools/get-ai-tools/${categoryId}/tools/${toolId}`);
      return { categoryId, toolId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateToolFromCategory = createAsyncThunk(
  "aiTools/updateToolFromCategory",
  async ({ categoryId, toolId, updateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URI}/ai-tools/update-tool/${categoryId}/tools/${toolId}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteToolFromCategory = createAsyncThunk(
  "aiTools/deleteToolFromCategory",
  async ({ categoryId, toolId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URI}/ai-tools/delete-tool/${categoryId}/${toolId}`);
      return { categoryId, toolId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleToolActive = createAsyncThunk(
  "aiTools/toggleToolActive",
  async ({ categoryId, toolId }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${import.meta.env.VITE_API_URI}/ai-tools/${categoryId}/tools/${toolId}/toggle-active`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const aiTool = createSlice({
  name: "aiTool",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllAiTools
      .addCase(getAllAiTools.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAiTools.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.aiTools = action.payload.aiTools;
        state.encryptedData = action.payload.encryptedData;
        state.error = null;
      })
      .addCase(getAllAiTools.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // getAllAIToolsWithOutFilter
      .addCase(getAllAIToolsWithOutFilter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAIToolsWithOutFilter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.aiTools = action.payload;
        state.error = null;
      })
      .addCase(getAllAIToolsWithOutFilter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // hitCounts
      .addCase(hitCounts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(hitCounts.fulfilled, (state, action) => {
        const { categoryId, aiToolId, hitCounts } = action.payload;
        const category = state.aiTools.find(cat => cat._id === categoryId);
        if (category) {
          const tool = category.tools.find(tool => tool._id === aiToolId);
          if (tool) {
            tool.hitCounts = hitCounts;
          }
        }
        state.status = "succeeded";
      })
      .addCase(hitCounts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // getAIToolById
      .addCase(getAIToolById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAIToolById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { category, ...toolData } = action.payload;
        const categoryIndex = state.aiTools.findIndex(cat => cat._id === action.meta.arg.categoryId);
        if (categoryIndex !== -1) {
          const toolIndex = state.aiTools[categoryIndex].tools.findIndex(t => t._id === action.meta.arg.toolId);
          if (toolIndex !== -1) {
            state.aiTools[categoryIndex].tools[toolIndex] = toolData;
          } else {
            state.aiTools[categoryIndex].tools.push(toolData);
          }
          state.aiTools[categoryIndex].category = category;
        } else {
          state.aiTools.push({ _id: action.meta.arg.categoryId, category, tools: [toolData] });
        }
        state.error = null;
      })
      .addCase(getAIToolById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ? action.payload.error : "Failed to fetch AI tool";
      })

      // updateToolFromCategory
      .addCase(updateToolFromCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateToolFromCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.aiTools = state.aiTools.map(category => {
          if (category._id === action.payload.categoryId) {
            category.tools = category.tools.map(tool =>
              tool._id === action.payload._id ? action.payload : tool
            );
          }
          return category;
        });
        state.error = null;
      })
      .addCase(updateToolFromCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ? action.payload.error : "Failed to update tool";
      })

      // deleteToolFromCategory
      .addCase(deleteToolFromCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteToolFromCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.aiTools = state.aiTools.map(category => {
          if (category._id === action.payload.categoryId) {
            category.tools = category.tools.filter(tool => tool._id !== action.payload.toolId);
          }
          return category;
        });
        state.error = null;
      })
      .addCase(deleteToolFromCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ? action.payload.error : "Failed to delete tool";
      })

      // toggleToolActive
      .addCase(toggleToolActive.pending, (state) => {
        state.status = "loading";
      })
      .addCase(toggleToolActive.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { _id: toolId, active } = action.payload;
        state.aiTools = state.aiTools.map(category => ({
          ...category,
          tools: category.tools.map(tool =>
            tool._id === toolId ? { ...tool, active } : tool
          )
        }));
        state.error = null;
      })
      .addCase(toggleToolActive.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ? action.payload.error : "Failed to toggle tool active state";
      });
  },
});

export const { clearError } = aiTool.actions;
export default aiTool.reducer;