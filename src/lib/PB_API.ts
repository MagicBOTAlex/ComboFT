export class PB_API {
    private baseUrl: string;
  
    constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
    }
  
    private async getRequest(path: string, params?: Record<string, any>) {
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
        throw new Error(`Request failed with status ${response.status}`);
      }
      return await response.json();
    }
  
    // Streaming endpoints
    async getRawCameraFeed() {
      return this.getRequest('/camera/raw/');
    }
  
    async getCroppedCameraFeed() {
      return this.getRequest('/camera/cropped/');
    }
  
    async getProcessedCameraFeed() {
      return this.getRequest('/camera/processed/');
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
  }
  