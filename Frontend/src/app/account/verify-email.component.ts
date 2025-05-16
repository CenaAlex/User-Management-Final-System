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
    ) { }

    ngOnInit() {
        // Get token from URL path parameter
        this.token = this.route.snapshot.params['token'];
        
        if (!this.token) {
            this.emailStatus = EmailStatus.Failed;
            this.error = 'Verification token is missing';
            this.alertService.error(this.error);
            return;
        }

        // Verify email using POST method only
        this.accountService.verifyEmail(this.token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.emailStatus = EmailStatus.Success;
                    this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    // Automatically redirect to login after 2 seconds
                    setTimeout(() => {
                        this.router.navigate(['/account/login']);
                    }, 2000);
                },
                error: (error) => {
                    this.emailStatus = EmailStatus.Failed;
                    this.error = error?.error?.message || error?.message || 'Verification failed';
                    this.alertService.error(this.error);
                    console.error('Verification error:', error);
                }
            });
    }

    // Method to manually navigate to login
    goToLogin() {
        this.router.navigate(['/account/login']);
    }

    // Method to retry verification
    retryVerification() {
        if (this.token) {
            this.emailStatus = EmailStatus.Verifying;
            this.ngOnInit();
        }
    }
}
