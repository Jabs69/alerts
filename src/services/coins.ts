import apiFetch from "../utils/fetchHelper";
import { Coin } from '../types/globals';

const url = `${import.meta.env.VITE_API_URL}/coins`;

export async function getAll(): Promise<Coin[]> {
  return await apiFetch(`${url}`);
}

export async function add(coin: Coin): Promise<{ price: number; last_change: number }> {
  return await apiFetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(coin),
  });
}

export async function deleteCoins(coins: string[]) : Promise<void> {

  return await apiFetch(`${url}`, {

    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ coins })

  })

}