import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types
export enum DiagnosticType {
  THERMOCLINE = 'thermocline',
  HALOCLINE = 'halocline',
  PYCNOCLINE = 'pycnocline',
  SOUND_SPEED = 'sound_speed',
  MESOSCALE_EDDY = 'mesoscale_eddy',
  OCEAN_FRONT = 'ocean_front',
  INTERNAL_WAVE = 'internal_wave',
}

export enum JobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

interface DiagnosticJob {
  id: string;
  name: string;
  diagnosticType: DiagnosticType;
  status: JobStatus;
  datasetId: string;
  parameters: Record<string, any>;
  result?: Record<string, any>;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

interface DiagnosticsState {
  jobs: DiagnosticJob[];
  selectedJobId: string | null;
  isLoading: boolean;
  error: string | null;
}

// Define initial state
const initialState: DiagnosticsState = {
  jobs: [],
  selectedJobId: null,
  isLoading: false,
  error: null,
};

// Create the slice
const diagnosticsSlice = createSlice({
  name: 'diagnostics',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<DiagnosticJob[]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<DiagnosticJob>) => {
      state.jobs.push(action.payload);
    },
    updateJob: (state, action: PayloadAction<Partial<DiagnosticJob> & { id: string }>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = { ...state.jobs[index], ...action.payload };
      }
    },
    selectJob: (state, action: PayloadAction<string>) => {
      state.selectedJobId = action.payload;
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
  setJobs,
  addJob,
  updateJob,
  selectJob,
  setLoading,
  setError,
} = diagnosticsSlice.actions;
export default diagnosticsSlice.reducer;