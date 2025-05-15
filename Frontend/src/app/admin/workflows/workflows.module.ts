import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { WorkflowsRoutingModule } from './workflows-routing.module';
import { ListComponent as WorkflowsListComponent } from './list.component';
import { DetailsComponent as WorkflowsDetailsComponent } from './details.component';
import { AddEditComponent as WorkflowsAddEditComponent } from './add-edit.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        WorkflowsRoutingModule
    ],
    declarations: [
        WorkflowsListComponent,
        WorkflowsDetailsComponent,
        WorkflowsAddEditComponent
    ]
})
export class WorkflowsModule { } 
