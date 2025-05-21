// chat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';

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
  private apiUrl = `${API_URL}/api/chat`;
  private sessionKey = 'chatSessionId';

  constructor(private http: HttpClient) { }

  /** Lấy header có Authorization và Content-Type */
  private getHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('authToken') || '';
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    // Nếu có session thì thêm X-Session-Id
    const sessionId = sessionStorage.getItem(this.sessionKey);
    if (sessionId) {
      headers = headers.set('X-Session-Id', sessionId);
    }
    return { headers };
  }

  sendMessage(question: string) {
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
}
