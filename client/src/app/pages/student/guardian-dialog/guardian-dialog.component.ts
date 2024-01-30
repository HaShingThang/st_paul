import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GuardianInfo } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-guardian-dialog',
  templateUrl: './guardian-dialog.component.html',
  styleUrls: ['./guardian-dialog.component.scss'],
})
export class GuardianDialogComponent implements OnInit {
  displayedColumns: string[] = ['Guardian Name', 'Ph No'];
  guardianInfo!: GuardianInfo;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.guardianInfo = { ...this.data.guardianInfo };
  }
}
