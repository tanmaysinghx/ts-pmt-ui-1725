import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type SnackbarType = 'type1' | 'type2'; // added type2
export type SnackbarVariant = 'success' | 'error' | 'warning' | 'info';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class SnackbarComponent {
  @Input() type: SnackbarType = 'type1';
  @Input() variant: SnackbarVariant = 'info';
  @Input() message: string = '';
  @Input() description: string = '';
  @Input() duration: number = 3000;
  @Input() list: string[] = []; // for type2

  visible = false;
  private timer: any;

  show(
    message?: string,
    description?: string,
    variant?: SnackbarVariant,
    duration?: number,
    type?: SnackbarType,
    list?: string[]
  ) {
    if (message) this.message = message;
    if (description) this.description = description;
    if (variant) this.variant = variant;
    if (type) this.type = type;
    if (duration) this.duration = duration;
    if (list) this.list = list;

    this.visible = true;

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.hide(), this.duration);
  }

  hide() {
    this.visible = false;
  }
}
