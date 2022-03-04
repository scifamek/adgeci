import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResponseModel } from 'adgeci-core-utils/models';
import { Subscription } from 'rxjs';
import { IModuleModel } from 'src/app/models/module.model';
import { ModulesService } from '../../services/modules.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  static route = 'home';
  token!: string;
  subscription!: Subscription;
  modules: any[];

  error: boolean = false;

  constructor(private modulesService: ModulesService) {
    this.modules = [];
    this.subscription = this.modulesService
      .getModulesByEnterprise()
      .subscribe((response: ResponseModel<IModuleModel[]>) => {
        if (response.code.status == 1006) {
          this.error = true;
        } else {
          this.modules = this.modules.concat(response.data);
        }
        console.log(this.modules);
      });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  navigate(path: string) {
    return () => {
      window.dispatchEvent(
        new CustomEvent('NAVIGATE', {
          detail: { path },
        })
      );
    };
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('ADGECI-JWT-TOKEN') as string;
  }
}
