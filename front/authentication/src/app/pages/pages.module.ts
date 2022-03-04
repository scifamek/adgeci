import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AclButtonModule } from 'angular-components-library/button';
import { AclInputModule } from 'angular-components-library/input';

@NgModule({
  declarations: [SigninComponent, SignupComponent],
  imports: [CommonModule, ReactiveFormsModule, AclButtonModule, AclInputModule],
  exports: [SigninComponent, SignupComponent],
})
export class PagesModule {}
