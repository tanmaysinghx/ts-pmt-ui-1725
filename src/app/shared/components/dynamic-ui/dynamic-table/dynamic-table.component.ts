import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'date' | 'custom';
  badgeColors?: Record<string, string>;
  customTemplate?: TemplateRef<any>;
}

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() searchQuery: string = '';
  @Input() filters: Record<string, any> = {};
  @Output() rowClick = new EventEmitter<any>();

  constructor() { }

  /** Utility to get keys of an object (used for badge filters) */
  objectKeys = Object.keys;

  /** Filtered + searched dataset */
  filteredData(): any[] {
    return this.data.filter(item => {
      // Search filter
      const matchesSearch = this.searchQuery
        ? Object.values(item).some(val =>
          val?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        : true;

      // Column filters
      const matchesFilters = Object.entries(this.filters).every(([key, val]) =>
        !val || item[key] === val
      );

      return matchesSearch && matchesFilters;
    });
  }

  /** Row click event handler */
  onRowClick(row: any) {
    this.rowClick.emit(row);
  }
}