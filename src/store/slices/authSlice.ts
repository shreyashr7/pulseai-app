import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, RegisterData } from '../../types';
import { authService } from '../../services/auth.service';
import { handleApiError } from '../../services/api';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Async thunks
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (userData: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const user = await authService.getCurrentUser();
            return user;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.isAuthenticated = false;
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        });

        // Get current user
        builder.addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCurrentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        });
        builder.addCase(getCurrentUser.rejected, (state) => {
            state.loading = false;
            state.isAuthenticated = false;
        });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
