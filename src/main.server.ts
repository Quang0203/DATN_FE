import 'zone.js/node';

import { bootstrapApplication } from '@angular/platform-browser';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient } from '@angular/common/http'; // thêm vào đây

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Gộp config lại và bổ sung provider cho SSR
const serverAppConfig = mergeApplicationConfig(
  appConfig,
  {
    providers: [
      provideServerRendering(),
      provideHttpClient(), // rất quan trọng!
    ],
  },
);

// Tạo hàm bootstrap
const bootstrap = () => {
  return bootstrapApplication(AppComponent, serverAppConfig);
};

export default bootstrap;
