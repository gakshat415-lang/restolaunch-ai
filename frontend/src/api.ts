import axios from 'axios';
import { supabase } from './supabaseClient';

// Create a pre-configured Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export interface RestaurantRequest {
  location: string;
  format: string;
  budget: number;
  cuisine: string;
}

export interface Competitor {
  Name: string;
  Rating: number;
  Votes: number;
  Price: number;
  MDS: number;
}

export interface PredictionData {
  opportunity_index: number;
  competitor_count: number;
  top_competitors: Competitor[];
  verdict: string;
}

export interface PredictionResponse {
  message: string;
  data: PredictionData;
}

export const getPrediction = async (request: RestaurantRequest): Promise<PredictionResponse> => {
  const response = await api.post<PredictionResponse>('/api/predict', request);
  return response.data;
};

export default api;
