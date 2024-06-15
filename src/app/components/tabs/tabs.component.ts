import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { CommonModule } from '@angular/common';
import { delay, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [TabComponent, CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent,    {descendants: true}) tabs!: QueryList<TabComponent>;

  ngAfterContentInit() {
    this.preselectTab();
  }
  
  selectTab(tab: TabComponent){
    this.tabs.toArray().forEach(tab => tab.active = false);
    if(tab) {
      tab.active = true;
    }
  }

  removeTab(tab: TabComponent) {
    tab.removeTab();
    this.preselectTab()
  }

  preselectTab() {
    if(this.tabs) {
      this.tabs.changes.pipe(delay(0), // We are using delay here to avoid ExpressionChangedAfterItHasBeenCheckedError
        tap((tabs) => {
          { 
            let activeTabs = tabs.filter((tab: TabComponent) => tab.active);
            if(activeTabs.length === 0) {
              this.selectTab(tabs.toArray()[0]);
            }
        }
        }))
      .subscribe();
    }
  }

  trackByFn(index: any, tab: any) {
    return index;
  }
}
