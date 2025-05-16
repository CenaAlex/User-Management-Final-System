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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        const token = this.route.snapshot.queryParams['token'];
        
        // remove token from url to prevent http referer leakage
        this.router.navigate([], { relativeTo: this.route, replaceUrl: true });

        this.accountService.verifyEmail(token)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.emailStatus = EmailStatus.Success;
                    this.alertService.success('Verification successful, you can now login', { keepAfterRouteChange: true });
                    // Add a longer delay to ensure the verification is fully processed
                    setTimeout(() => {
                        this.router.navigate(['../login'], { relativeTo: this.route });
                    }, 2000);
                },
                error: () => {
                    this.emailStatus = EmailStatus.Failed;
                }
            });
    }
}
