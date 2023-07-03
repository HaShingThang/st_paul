import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent {
  @Input() searchValue!: string;
  @Input() placeholder!: string;
  @Output() searchCleared = new EventEmitter<void>();
  @Output() searchValueChanged = new EventEmitter<string>();

  clearSearch() {
    this.searchValue = '';
    this.searchCleared.emit();
    this.searchValueChanged.emit(this.searchValue);
  }

  onSearchValueChange() {
    this.searchValueChanged.emit(this.searchValue);
  }
}
