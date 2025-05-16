import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { first } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    error: string = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient
    ) {
        // Clear any existing navigation
        this.router.navigate([], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
        });
    }

    ngOnInit() {
        // Get token from URL
        this.token = this.route.snapshot.queryParams['token'];
        
        if (!this.token) {
            this.emailStatus = EmailStatus.Failed;
            this.error = 'Verification token is missing';
            this.alertService.error(this.error);
            return;
        }

        // Try POST verification first
        this.accountService.verifyEmail(this.token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.emailStatus = EmailStatus.Success;
                    this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                },
                error: (error) => {
                    // If POST fails, try GET method
                    this.http.get(`${environment.apiUrl}/accounts/verify-email?token=${this.token}`)
                        .pipe(first())
                        .subscribe({
                            next: () => {
                                this.emailStatus = EmailStatus.Success;
                                this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                            },
                            error: (err) => {
                                this.emailStatus = EmailStatus.Failed;
                                this.error = err.error?.message || err.message || 'Verification failed';
                                this.alertService.error(this.error);
                                console.error('Verification error:', err);
                            }
                        });
                }
            });
    }

    // Method to manually navigate to login
    goToLogin() {
        this.router.navigate(['../login'], { relativeTo: this.route });
    }

    // Method to retry verification
    retryVerification() {
        if (this.token) {
            this.emailStatus = EmailStatus.Verifying;
            this.ngOnInit();
        }
    }
}
