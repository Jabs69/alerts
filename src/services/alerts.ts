import apiFetch from "../utils/fetchHelper";
import { Alert, AlertItem } from "../types/globals";

const url = `${import.meta.env.VITE_API_URL}/alerts`;

export async function getAlerts(): Promise<AlertItem[]> {
  return await apiFetch(`${url}`);
}

export async function createNewAlert(alert: Alert): Promise<{ id: number, name: string, large: string }> {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alert),
  };
  return await apiFetch(url, options);
}

export async function editAlert(data: Alert) {

  const options = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  return await apiFetch(url, options);

}

export async function deleteAlerts(ids: number[]) {

  const options = {

    method: 'DELETE',
    body: JSON.stringify({ ids })

  }

  return await apiFetch(url, options);

}