import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../shared/header.component';
import { FooterComponent } from '../shared/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen bg-white">
      <app-header></app-header>
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
})
export class LayoutComponent {}
