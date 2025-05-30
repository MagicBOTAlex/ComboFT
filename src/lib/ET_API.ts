// etvr-api.ts
import type { ET_Config } from './structs/ET_Api/ET_Config';
import type { ET_TrackerConfigOutput } from './structs/ET_Api/ET_TrackerConfigOutput';
import type { ET_TrackerConfigInput } from './structs/ET_Api/ET_TrackerConfigInput';

/**
 * Simple helper function to handle JSON requests.
 * It sets up the request, checks for errors, and returns the parsed JSON.
 */
async function fetchJson<T>(
  url: string,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }
  // If the endpoint returns no body (e.g., 204), you may want to handle that
  // differently. For now, we assume it returns JSON.
  return (await response.json()) as T;
}

/**
 * A small ETVR client class that uses `fetch` to communicate with the API.
 */
export class ETApi {
  constructor(public baseURL: string) {}

  /**
   * ---- Streaming Endpoints ----
   */

  public getRawCameraFeed(uuid: string): Promise<any> {
    const url = `${this.baseURL}/etvr/feed/${uuid}/camera`;
    return fetchJson<any>(url);
  }

  public getAlgorithmFeed(uuid: string): Promise<any> {
    const url = `${this.baseURL}/etvr/feed/${uuid}/algorithm`;
    return fetchJson<any>(url);
  }

  /**
   * ---- Start/Stop/Status Endpoints ----
   */
  public startETVR(): Promise<any> {
    const url = `${this.baseURL}/etvr/start`;
    return fetchJson<any>(url);
  }

  public stopETVR(): Promise<any> {
    const url = `${this.baseURL}/etvr/stop`;
    return fetchJson<any>(url);
  }

  public shutdownETVR(): Promise<any> {
    const url = `${this.baseURL}/etvr/shutdown`;
    return fetchJson<any>(url);
  }

  public restartETVR(): Promise<any> {
    const url = `${this.baseURL}/etvr/restart`;
    return fetchJson<any>(url);
  }

  public getETVRStatus(): Promise<any> {
    const url = `${this.baseURL}/etvr/status`;
    // console.log("Sending to: "+ url);
    return fetchJson<any>(url);
  }

  /**
   * ---- Config Endpoints ----
   */
  public getConfig(params?: {
    mode?: 'json' | 'python';
    include?: string[] | number[] | object;
    exclude?: string[] | number[] | object;
    by_alias?: boolean;
    exclude_unset?: boolean;
    exclude_defaults?: boolean;
    exclude_none?: boolean;
    round_trip?: boolean;
    warnings?: boolean;
  }): Promise<ET_Config> {
    // Build query string from params if desired
    const queryString = params ? this.toQueryString(params) : '';
    const url = `${this.baseURL}/etvr/config${queryString}`;
    return fetchJson<ET_Config>(url);
  }

  public updateConfig(config: Partial<ET_Config>): Promise<void> {
    const url = `${this.baseURL}/etvr/config`;
    return fetchJson<void>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
  }

  public saveConfig(): Promise<void> {
    const url = `${this.baseURL}/etvr/config/save`;
    return fetchJson<void>(url);
  }

  public loadConfig(): Promise<ET_Config> {
    const url = `${this.baseURL}/etvr/config/load`;
    return fetchJson<ET_Config>(url);
  }

  public resetConfig(): Promise<void> {
    const url = `${this.baseURL}/etvr/config/reset`;
    return fetchJson<void>(url);
  }

  /**
   * ---- Tracker Config Endpoints ----
   */
  public resetTracker(uuid: string): Promise<void> {
    const url = `${this.baseURL}/etvr/config/tracker/reset?uuid=${uuid}`;
    return fetchJson<void>(url);
  }

  public getAllTrackers(): Promise<ET_TrackerConfigOutput[]> {
    const url = `${this.baseURL}/etvr/config/trackers`;
    return fetchJson<ET_TrackerConfigOutput[]>(url);
  }

  public getTracker(uuid: string): Promise<ET_TrackerConfigOutput> {
    const url = `${this.baseURL}/etvr/config/tracker?uuid=${uuid}`;
    return fetchJson<ET_TrackerConfigOutput>(url);
  }

  public createTracker(
    newTracker: ET_TrackerConfigInput
  ): Promise<ET_TrackerConfigOutput> {
    const url = `${this.baseURL}/etvr/config/tracker`;
    return fetchJson<ET_TrackerConfigOutput>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTracker),
    });
  }

  public updateTracker(
    uuid: string,
    partialTracker: Partial<ET_TrackerConfigInput>
  ): Promise<void> {
    const url = `${this.baseURL}/etvr/config/tracker?uuid=${uuid}`;
    return fetchJson<void>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partialTracker),
    });
  }

  public deleteTracker(uuid: string): Promise<void> {
    const url = `${this.baseURL}/etvr/config/tracker?uuid=${uuid}`;
    return fetchJson<void>(url, { method: 'DELETE' });
  }

  /**
   * Utility for building a query string from a simple object.
   * This is optional—you might prefer using a library for query strings.
   */
  private toQueryString(params: Record<string, unknown>): string {
    const entries = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => {
        // For arrays or objects, you may want a more sophisticated approach
        return `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`;
      });
    return entries.length ? `?${entries.join('&')}` : '';
  }
}