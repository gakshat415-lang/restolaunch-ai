import { describe, it, expect, vi } from 'vitest';
import api, { getPrediction } from './api';
import type { RestaurantRequest, PredictionResponse } from './api';

// Mock the axios instance post method
api.post = vi.fn();

describe('API Integration - getPrediction', () => {
  it('should successfully parse the JSON payload from the backend', async () => {
    const mockRequest: RestaurantRequest = {
      location: 'Indiranagar',
      format: 'Cafe',
      budget: 800,
      cuisine: 'Italian'
    };

    const mockResponseData: PredictionResponse = {
      message: 'Success',
      data: {
        opportunity_index: 45.2,
        competitor_count: 3,
        verdict: 'A highly lucrative market.',
        top_competitors: [
          { Name: 'Test Cafe 1', Rating: 4.5, Votes: 1000, Price: 800, MDS: 60.5 },
          { Name: 'Test Cafe 2', Rating: 4.0, Votes: 500, Price: 750, MDS: 40.0 }
        ]
      }
    };

    // Set up the mock to return the data exactly as axios would (inside a `data` object)
    (api.post as any).mockResolvedValueOnce({ data: mockResponseData });

    const result = await getPrediction(mockRequest);

    // Verify axios was called with correct arguments
    expect(api.post).toHaveBeenCalledWith('/api/predict', mockRequest);

    // Verify the result matches our mock exactly, meaning the parsing and typing work
    expect(result.message).toBe('Success');
    expect(result.data.opportunity_index).toBe(45.2);
    expect(result.data.competitor_count).toBe(3);
    expect(result.data.top_competitors).toHaveLength(2);
    expect(result.data.top_competitors[0].Name).toBe('Test Cafe 1');
  });

  it('should bubble up errors on failure (e.g. 500 error)', async () => {
    const mockRequest: RestaurantRequest = {
      location: 'Indiranagar',
      format: 'Cafe',
      budget: 800,
      cuisine: 'Italian'
    };

    const networkError = new Error('Network Error');
    (api.post as any).mockRejectedValueOnce(networkError);

    await expect(getPrediction(mockRequest)).rejects.toThrow('Network Error');
  });
});
