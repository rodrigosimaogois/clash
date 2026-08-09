import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TokenStatusResponse {
  status: string;
  tokenConfigured: boolean;
  tokenPreview: string;
}

export interface UpdateTokenResponse {
  success: boolean;
  message: string;
  warning?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Added the /api prefix to match your backend routing structure
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the current token status from the API (/api/config/status)
   */
  getTokenStatus(): Observable<TokenStatusResponse> {
    return this.http.get<TokenStatusResponse>(`${this.apiUrl}/config/status`);
  }

  /**
   * Sends the new token to update the server configuration (/api/config/token)
   * Requires the 'x-admin-secret' header for authorization
   */
  updateApiToken(newToken: string, adminSecret: string): Observable<UpdateTokenResponse> {
    const headers = new HttpHeaders({
      'x-admin-secret': adminSecret
    });

    return this.http.post<UpdateTokenResponse>(
      `${this.apiUrl}/config/token`,
      { newToken },
      { headers }
    );
  }
}
