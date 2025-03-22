export class PB_API {
  public baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getRequest(path: string, params?: Record<string, any>) {
    try {
      const url = new URL(`${this.baseUrl}${path}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, value.toString());
          }
        });
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        return "404"; // Return 404 string for non-OK responses
      }
      return await response.json();
    } catch (error) {
      return "404"; // Return 404 string for any network errors
    }
  }

  // Streaming endpoints
  async getRawCameraFeed() {
    return this.baseUrl + 'camera/raw/';
  }

  async getCroppedCameraFeed() {
    return this.baseUrl + ('camera/cropped/');
  }

  async getProcessedCameraFeed() {
    return this.baseUrl + ('camera/processed/');
  }

  // Calibration endpoints
  async startCalibration(caliSamples?: number) {
    return this.getRequest('/calibrate/start', { caliSamples });
  }

  async getCalibrationStatus() {
    return this.getRequest('/calibrate/status');
  }

  async setCalibrationUsage(targetState: number) {
    return this.getRequest('/calibrate/set', { targetState });
  }

  // Control endpoints
  async shutdown() {
    const url = new URL(`${this.baseUrl}/shutdown`);
    // Fire-and-forget: Don't await to avoid blocking, catch errors silently
    fetch(url.toString()).catch(() => { });
  }
}