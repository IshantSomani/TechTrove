import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  users: [],
  status: "idle",
  error: null,
};

export const createUser = createAsyncThunk(
  "user/create-user",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/user/create-user`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
  }
);

export const oldUserMessage = createAsyncThunk(
  "user/old-user-message",
  async ({ userId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/user/old-user-message/${userId}/messages`, { message });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
  }
);

export const aiToolsByUser = createAsyncThunk(
  "user/users-ai-tool",
  async ({ userId, aitool }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URI}/user/users-ai-tool/${userId}/aitools`, aitool);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/get-all-users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URI}/user/get-all-user`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
  }
);

export const getUserByEmail = createAsyncThunk(
  "user/get-user-email",
  async (useremail, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URI}/user/get-user-email/${useremail}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update-user",
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URI}/user/update-user/${userId}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete-user",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_URI}/user/delete-user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "An error occurred" });
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(oldUserMessage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(oldUserMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.user) {
          state.user.messages = [...(state.user.messages || []), action.payload.data];
        }
      })
      .addCase(oldUserMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(aiToolsByUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(aiToolsByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.user) {
          state.user.aitools = [...(state.user.aitools || []), action.payload.data];
        }
      })
      .addCase(aiToolsByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(getUserByEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUserByEmail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUserByEmail.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "An error occurred";
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "An error occurred";
      });
  },
});

export const { resetStatus } = userSlice.actions;
export default userSlice.reducer;