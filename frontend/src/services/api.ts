import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { DiagnosticType, JobStatus } from '../store/slices/diagnosticsSlice';
import { UserRole } from '../store/slices/authSlice';

// Define types
interface Dataset {
  id: string;
  name: string;
  description?: string;
  fileFormat: string;
  variables: string[];
}

interface ThreddsServer {
  id: string;
  name: string;
  baseUrl: string;
  description?: string;
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

interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: UserRole;
}

// Define the API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = (getState() as RootState).auth.token;
      
      // If we have a token, add it to the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  tagTypes: ['Datasets', 'ThreddsServers', 'DiagnosticJobs', 'User'],
  endpoints: (builder) => ({
    // Datasets
    getDatasets: builder.query<Dataset[], void>({
      query: () => 'datasets',
      providesTags: ['Datasets'],
    }),
    getDatasetById: builder.query<Dataset, string>({
      query: (id) => `datasets/${id}`,
      providesTags: (result, error, id) => [{ type: 'Datasets', id }],
    }),
    
    // Thredds
    getThreddsServers: builder.query<ThreddsServer[], void>({
      query: () => 'thredds/servers',
      providesTags: ['ThreddsServers'],
    }),
    addThreddsServer: builder.mutation<ThreddsServer, Partial<ThreddsServer>>({
      query: (server) => ({
        url: 'thredds/servers',
        method: 'POST',
        body: server,
      }),
      invalidatesTags: ['ThreddsServers'],
    }),
    getThreddsServerCatalog: builder.query<any, { serverId: string; path?: string }>({
      query: ({ serverId, path = '' }) => `thredds/catalog?server_id=${serverId}&path=${path}`,
    }),
    
    // Diagnostics
    getDiagnosticJobs: builder.query<DiagnosticJob[], void>({
      query: () => 'diagnostics',
      providesTags: ['DiagnosticJobs'],
    }),
    getDiagnosticJobById: builder.query<DiagnosticJob, string>({
      query: (id) => `diagnostics/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'DiagnosticJobs', id }],
    }),
    runThermoclineAnalysis: builder.mutation<{ jobId: string }, any>({
      query: (params) => ({
        url: 'diagnostics/thermocline',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['DiagnosticJobs'],
    }),
    runEddyAnalysis: builder.mutation<{ jobId: string }, any>({
      query: (params) => ({
        url: 'diagnostics/eddy',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['DiagnosticJobs'],
    }),
    runFrontAnalysis: builder.mutation<{ jobId: string }, any>({
      query: (params) => ({
        url: 'diagnostics/front',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['DiagnosticJobs'],
    }),
    runInternalWaveAnalysis: builder.mutation<{ jobId: string }, any>({
      query: (params) => ({
        url: 'diagnostics/internal-wave',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['DiagnosticJobs'],
    }),
    
    // Auth
    login: builder.mutation<{ user: User; token: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => 'users/me',
      providesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useGetDatasetsQuery,
  useGetDatasetByIdQuery,
  useGetThreddsServersQuery,
  useAddThreddsServerMutation,
  useGetThreddsServerCatalogQuery,
  useGetDiagnosticJobsQuery,
  useGetDiagnosticJobByIdQuery,
  useRunThermoclineAnalysisMutation,
  useRunEddyAnalysisMutation,
  useRunFrontAnalysisMutation,
  useRunInternalWaveAnalysisMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
} = api;