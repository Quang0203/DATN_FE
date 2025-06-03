import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatService } from '../../services/chat/chat.service';
import { ProfileService } from '../../services/profile/profile.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Message {
  sender: 'user' | 'bot';
  content: SafeHtml;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  showChat = false;
  input = '';
  messages: Message[] = [];
  isLoading: boolean = false;
  isBrowser: boolean;
  private historyKey: string = 'chatHistory';
  private userId: string | null = null;

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
    private profileService: ProfileService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.profileService.getProfile().subscribe({
        next: (user) => {
          this.userId = user.iduser;
          this.historyKey = `chatHistory_${this.userId}`;
          this.loadChatHistory();
        },
        error: (err) => {
          console.error('Lỗi khi lấy thông tin người dùng:', err);
          this.loadChatHistory();
        }
      });
    }
  }

  private loadChatHistory() {
    const raw = sessionStorage.getItem(this.historyKey);
    if (raw) {
      const arr = JSON.parse(raw) as { sender: string; content: string }[];
      this.messages = arr.map(m => ({
        sender: m.sender as 'user' | 'bot',
        content: this.sanitize(m.content)
      }));
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
    setTimeout(() => this.scrollToBottom(), 0);
  }

  sendChat() {
    if (!this.isBrowser) return;
    const text = this.input.trim();
    if (!text) return;

    this.pushMessage('user', text);
    this.input = '';
    this.isLoading = true;

    // Chuẩn bị lịch sử chat
    const history = this.messages.map(msg => ({
      role: msg.sender,
      content: (msg.content as any).changingThisBreaksApplicationSecurity
    }));

    this.chatService.sendMessageWithHistory(history).subscribe({
      next: res => {
        this.pushMessage('bot', res.answer);
        this.isLoading = false;
      },
      error: () => {
        this.pushMessage('bot', 'Xin lỗi, đã có lỗi xảy ra.');
        this.isLoading = false;
      }
    });
  }

  private pushMessage(sender: 'user' | 'bot', raw: string) {
    const html = this.format(raw);
    const safe = this.sanitizer.bypassSecurityTrustHtml(html);
    this.messages.push({ sender, content: safe });

    if (this.isBrowser) {
      const toSave = this.messages.map(m => ({
        sender: m.sender,
        content: (m.content as any).changingThisBreaksApplicationSecurity
      }));
      sessionStorage.setItem(this.historyKey, JSON.stringify(toSave));
    }

    setTimeout(() => this.scrollToBottom(), 0);
  }

  private format(text: string): string {
    let html = text
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>');
  
    html = html.replace(
      /\[([^\]]+)\]\((\/?[^\s)]+)\)/g,
      (_m, label, url) => {
        const href = url.startsWith('/')
          ? window.location.origin + url
          : url;
        return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
      }
    );
  
    html = html.replace(
      /(^|[^"'>])\b(https?:\/\/[^\s<]+)/g,
      (_m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener">${url}</a>`
    );
  
    html = html.replace(
      /(^|\s)\/localhost:\d+([^\s<]+)/g,
      (_m, pre, path) => {
        const href = window.location.origin + path;
        return `<pre><a href="${href}" target="_blank" rel="noopener">Xem chi tiết</a>`;
      }
    );
  
    html = html.replace(/\r?\n/g, '<br/>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    return html;
  }

  private sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private scrollToBottom() {
    const el = document.querySelector('.chat-body');
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }
}