import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { DepartmentService, AlertService, AccountService } from '@app/_services';

@Component({ 
    templateUrl: 'add-edit.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule
    ]
})
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id?: string;
    title!: string;
    loading = false;
    submitting = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService,
        private alertService: AlertService,
        private accountService: AccountService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        
        this.form = this.formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            description: ['']
        });
        
        this.title = 'Add Department';
        
        if (this.id) {
            // edit mode
            this.title = 'Edit Department';
            this.loading = true;
            this.departmentService.getById(this.id)
                .pipe(first())
                .subscribe({
                    next: department => {
                        this.form.patchValue(department);
                        this.loading = false;
                    },
                    error: error => {
                        this.alertService.error(error);
                        this.loading = false;
                        this.router.navigateByUrl('/admin/departments');
                    }
                });
        }
    }
    
    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }
    
    onSubmit() {
        this.submitted = true;
        
        // reset alerts on submit
        this.alertService.clear();
        
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        
        this.submitting = true;
        
        // Create department save observable
        const saveDepartment = () => {
            return this.id
                ? this.departmentService.update(this.id, this.form.value)
                : this.departmentService.create(this.form.value);
        };
        
        saveDepartment()
            .pipe(first())
            .subscribe({
                next: department => {
                    const action = this.id ? 'updated' : 'created';
                    const message = `Department ${action} successfully`;
                    this.alertService.success(message, { keepAfterRouteChange: true });
                    this.router.navigateByUrl('/admin/departments');
                },
                error: error => {
                    this.alertService.error(error);
                    this.submitting = false;
                }
            });
    }
} 