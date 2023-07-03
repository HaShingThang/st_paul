import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { REGX } from 'src/app/constants/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Input() isStudent!: boolean;
  @Input() isAdmin!: boolean;
  @Input() isTeacher!: boolean;
  @Input() isLoading!: boolean;
  @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
  loginForm!: FormGroup;
  hide = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      studentName: ['', this.isStudent && Validators.required],
      studentId: ['', this.isStudent && Validators.required],
      email: [
        '',
        (this.isAdmin || this.isTeacher) && [
          Validators.required,
          Validators.pattern(REGX.EMAIL),
        ],
      ],

      password: ['', (this.isAdmin || this.isTeacher) && Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      if (this.isStudent) {
        const studentName = this.loginForm.value.studentName;
        const studentId = this.loginForm.value.studentId;
        this.submitEvent.emit({ studentName, studentId });
      } else if (this.isAdmin || this.isTeacher) {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        this.submitEvent.emit({ email, password });
      }
    }
  }
}
