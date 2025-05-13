import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SubNavComponent } from './subnav.component';
import { LayoutComponent } from './layout.component';

const accountsModule = () => import('./accounts/accounts.module').then(x => x.AccountsModule);
const employeesModule = () => import('./employees/employees.module').then(x => x.EmployeesModule);
const departmentsModule = () => import('./departments/departments.module').then(x => x.DepartmentsModule);

const routes: Routes = [
    { path: '', component: SubNavComponent, outlet: 'subnav' },
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'accounts', pathMatch: 'full' },
            { path: 'accounts', loadChildren: accountsModule },
            { path: 'employees', loadChildren: employeesModule },
            { path: 'departments', loadChildren: departmentsModule }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }
