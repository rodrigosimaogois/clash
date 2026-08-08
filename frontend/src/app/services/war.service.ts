import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WarDetailsResponse } from '../models/war.model';

@Injectable({
  providedIn: 'root'
})
export class WarService {
  private apiUrl = 'http://localhost:3000/api/war'; // Ajuste para a URL da sua API

  constructor(private http: HttpClient) {}

  getWarDetails(clanTag: string): Observable<WarDetailsResponse> {
    const formattedTag = clanTag.replace('#', '').trim();
    return this.http.get<WarDetailsResponse>(`${this.apiUrl}?tag=${encodeURIComponent(formattedTag)}`);
  }
}
