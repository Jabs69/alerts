import apiFetch from '../utils/fetchHelper';
import { CoinGeckoResponse } from '../types/globals';

const url = 'https://api.coingecko.com/api/v3/search';

export const getAll = async (coinName: string): Promise<CoinGeckoResponse> => await apiFetch(`${url}?query=${coinName}`, {
  headers: {
    accept: 'application/json',
  }
});