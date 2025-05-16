import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { AccountService, AlertService } from '@app/_services';

enum EmailStatus {
    Verifying,
    Failed,
    Success
}

@Component({ 
    templateUrl: 'verify-email.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class VerifyEmailComponent implements OnInit {
    EmailStatus = EmailStatus;
    emailStatus = EmailStatus.Verifying;
    token: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        // Get token from URL
        this.token = this.route.snapshot.queryParams['token'];
        
        if (!this.token) {
            this.emailStatus = EmailStatus.Failed;
            this.alertService.error('Verification token is missing');
            return;
        }

        // Verify the email
        this.accountService.verifyEmail(this.token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.emailStatus = EmailStatus.Success;
                    this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    // Add a longer delay to ensure the verification is fully processed
                    setTimeout(() => {
                        this.router.navigate(['../login'], { relativeTo: this.route });
                    }, 3000);
                },
                error: (error) => {
                    this.emailStatus = EmailStatus.Failed;
                    this.alertService.error('Verification failed: ' + (error.message || 'Please try again'));
                }
            });
    }

    // Method to manually navigate to login
    goToLogin() {
        this.router.navigate(['../login'], { relativeTo: this.route });
    }
}
