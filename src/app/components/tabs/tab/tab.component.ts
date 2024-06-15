import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class TabComponent {
  @Input('tabHeader') header: string;
  @Output() onRemoveTab = new EventEmitter<boolean>(false);
  
  active = false;
  
  removeTab() {
    this.onRemoveTab.emit(true);
  }
}
