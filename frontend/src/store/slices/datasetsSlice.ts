import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
interface Dataset {
  id: string;
  name: string;
  description?: string;
  fileFormat: string;
  variables: string[];
}

interface DatasetsState {
  datasets: Dataset[];
  selectedDatasetId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: DatasetsState = {
  datasets: [],
  selectedDatasetId: null,
  isLoading: false,
  error: null,
};

// Create the slice
const datasetsSlice = createSlice({
  name: 'datasets',
  initialState,
  reducers: {
    setDatasets: (state, action: PayloadAction<Dataset[]>) => {
      state.datasets = action.payload;
    },
    selectDataset: (state, action: PayloadAction<string>) => {
      state.selectedDatasetId = action.payload;
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
export const { setDatasets, selectDataset, setLoading, setError } = datasetsSlice.actions;
export default datasetsSlice.reducer;