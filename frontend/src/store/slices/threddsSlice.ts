import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface ThreddsServer {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
}

interface CatalogItem {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: CatalogItem[];
}

interface ThreddsState {
  servers: ThreddsServer[];
  selectedServerId: string | null;
  currentCatalog: CatalogItem[];
  currentCatalogPath: string;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: ThreddsState = {
  servers: [],
  selectedServerId: null,
  currentCatalog: [],
  currentCatalogPath: '',
  isLoading: false,
  error: null,
};

// Create the slice
const threddsSlice = createSlice({
  name: 'thredds',
  initialState,
  reducers: {
    setServers: (state, action: PayloadAction<ThreddsServer[]>) => {
      state.servers = action.payload;
    },
    selectServer: (state, action: PayloadAction<string>) => {
      state.selectedServerId = action.payload;
    },
    setCatalog: (state, action: PayloadAction<CatalogItem[]>) => {
      state.currentCatalog = action.payload;
    },
    setCatalogPath: (state, action: PayloadAction<string>) => {
      state.currentCatalogPath = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Export actions and reducer
export const {
  setServers,
  selectServer,
  setCatalog,
  setCatalogPath,
  setLoading,
  setError,
} = threddsSlice.actions;
export default threddsSlice.reducer;