import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChatService } from '../../services/chat/chat.service';
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
  private historyKey = 'chatHistory';
  isBrowser: boolean;

  constructor(
    private chatService: ChatService,
    private sanitizer: DomSanitizer,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Load lịch sử chat từ sessionStorage chỉ khi chạy trên browser
      const raw = sessionStorage.getItem(this.historyKey);
      if (raw) {
        const arr = JSON.parse(raw) as { sender: string; content: string }[];
        this.messages = arr.map(m => ({
          sender: m.sender as 'user' | 'bot',
          content: this.sanitize(m.content)
        }));
      }
    }
  }

  toggleChat() {
    this.showChat = !this.showChat;
    // Khi mở chat, cuộn xuống cuối
    setTimeout(() => this.scrollToBottom(), 0);
  }

  sendChat() {
    if (!this.isBrowser) return; // Không gửi trên server
    const text = this.input.trim();
    if (!text) return;
    // Gửi tin nhắn user
    this.pushMessage('user', text);
    this.input = '';

    this.chatService.sendMessage(text).subscribe({
      next: res => { this.pushMessage('bot', res.answer); console.log(res); },
      error: () => this.pushMessage('bot', 'Xin lỗi, đã có lỗi xảy ra.')
    });
  }

  private pushMessage(sender: 'user' | 'bot', raw: string) {
    // Định dạng và sanitize
    const html = this.format(raw);
    const safe = this.sanitizer.bypassSecurityTrustHtml(html);
    this.messages.push({ sender, content: safe });

    // Lưu lịch sử chỉ trên browser
    if (this.isBrowser) {
      const toSave = this.messages.map(m => ({
        sender: m.sender,
        content: (m.content as any).changingThisBreaksApplicationSecurity
      }));
      sessionStorage.setItem(this.historyKey, JSON.stringify(toSave));
    }

    // Cuộn xuống cuối
    this.scrollToBottom();
  }

  private format(text: string): string {
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  
    // Markdown-style link [label](url)
    html = html.replace(
      /\[([^\]]+)\]\((\/?[^\s)]+)\)/g,
      (_m, label, url) => {
        const href = url.startsWith('/')
          ? window.location.origin + url
          : url;
        return `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;
      }
    );
  
    // HTTP/HTTPS link
    html = html.replace(
      /(^|[^"'>])\b(https?:\/\/[^\s<]+)/g,
      (_m, pre, url) => `${pre}<a href="${url}" target="_blank" rel="noopener">${url}</a>`
    );
  
    // Đường dẫn kiểu /localhost:4200/view-car/1
    html = html.replace(
      /(^|\s)\/localhost:\d+([^\s<]+)/g,
      (_m, pre, path) => {
        const href = window.location.origin + path;
        // return `${pre}<a href="${href}" target="_blank" rel="noopener">${path}</a>`;
        return `${pre}<a href="${href}" target="_blank" rel="noopener">Xem chi tiết</a>`;
      }
    );
  
    // Xuống dòng
    html = html.replace(/\r?\n/g, '<br/>');
  
    // In đậm **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
    return html;
  }
  


  private sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private scrollToBottom() {
    const el = document.querySelector('.chat-body');
    if (el) { el.scrollTop = el.scrollHeight; }
  }
}