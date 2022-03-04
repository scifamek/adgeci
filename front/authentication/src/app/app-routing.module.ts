import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IsUnauthenticatedUserGuard } from './guards/is-unauthenticated-user/is-unauthenticated-user.guard';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  {
    path: SigninComponent.route,
    canActivate: [IsUnauthenticatedUserGuard],
    component: SigninComponent,
  },
  {
    path: '',
    canActivate: [IsUnauthenticatedUserGuard],
    component: SigninComponent,
  },
  {
    path: SignupComponent.route,
    canActivate: [IsUnauthenticatedUserGuard],
    component: SignupComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
