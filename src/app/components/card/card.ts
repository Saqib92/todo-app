import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow duration-300">
      <ng-content></ng-content>
    </div>
  `
})
export class Card { }
