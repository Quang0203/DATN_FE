// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';


interface ChatResponse {
  sessionId?: string;
  // reply: string;
  answer: string;
}

const API_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = `${API_URL}/api/chat/with-history`;
  private sessionKey = 'chatSessionId';

  constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken') || '';
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const sessionId = sessionStorage.getItem(this.sessionKey);
    if (sessionId) {
      headers = headers.set('X-Session-Id', sessionId);
    }
    return { headers };
  }

  sendMessage(question: string): Observable<ChatResponse> {
    return this.http
      .post<ChatResponse>(
        this.apiUrl,
        { question },
        this.getHeaders()
      )
      .pipe(
        tap(res => {
          if (res.sessionId) {
            sessionStorage.setItem(this.sessionKey, res.sessionId);
          }
        })
      );
  }

  sendMessageWithHistory(messages: { role: string; content: string }[]): Observable<ChatResponse> {
    const payload = { messages };
    return this.http
      .post<ChatResponse>(
        this.apiUrl,
        payload,
        this.getHeaders()
      )
      .pipe(
        tap(res => {
          if (res.sessionId) {
            sessionStorage.setItem(this.sessionKey, res.sessionId);
          }
        })
      );
  }
}