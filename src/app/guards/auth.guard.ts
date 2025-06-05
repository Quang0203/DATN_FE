// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { CanActivate, Router, UrlTree } from '@angular/router';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(
//     private router: Router,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   canActivate(): boolean | UrlTree {
//     // Chỉ gọi localStorage nếu chắc chắn đang chạy trong browser
//     if (isPlatformBrowser(this.platformId)) {
//       const token = localStorage.getItem('authToken');
//       if (token) {
//         return true;
//       }
//       return this.router.createUrlTree(['/login']);
//     }
//     // Khi chạy SSR, có thể trả false hoặc true tùy kịch bản:
//     // + Nếu trả false: sẽ chuyển hướng ngay về login trên server (thường không mong muốn, vì SSR sẽ render trang login).
//     // + Nếu trả true: bỏ qua kiểm tra trên server, sau khi tải xong trên client mới kiểm tra (thường để hạn chế redirect vòng lặp).
//     return true;
//   }
// }
