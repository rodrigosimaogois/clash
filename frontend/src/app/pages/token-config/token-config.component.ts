import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { TranslationService, Language } from '../../services/translation.service';

@Component({
  selector: 'app-token-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './token-config.component.html',
  styleUrls: ['./token-config.component.css']
})
export class TokenConfigComponent implements OnInit {
  newToken: string = '';
  adminSecret: string = '';
  tokenPreview: string = '';
  isConfigured: boolean = false;
  showToken: boolean = false;
  showSecret: boolean = false;
  loading: boolean = false;
  successMsg: string = '';
  errorMsg: string = '';

  constructor(
    private configService: ConfigService,
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkStatus();
  }

  switchLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  /**
   * Checks current API token status on component load
   */
  checkStatus(): void {
    this.configService.getTokenStatus().subscribe({
      next: (res) => {
        this.isConfigured = res.tokenConfigured;
        this.tokenPreview = res.tokenPreview;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch token status:', err);
      }
    });
  }

  /**
   * Validates input fields and sends update request to backend
   */
  saveToken(): void {
    this.successMsg = '';
    this.errorMsg = '';

    if (!this.adminSecret.trim()) {
      this.errorMsg = 'Please enter the Admin Secret Key.';
      return;
    }

    if (!this.newToken.trim()) {
      this.errorMsg = 'Please enter the new token.';
      return;
    }

    this.loading = true;

    this.configService.updateApiToken(this.newToken.trim(), this.adminSecret.trim()).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMsg = res.message || 'Token updated successfully!';
        this.newToken = '';
        this.checkStatus();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMsg = 'Invalid Admin Secret Key. Access denied.';
        } else {
          this.errorMsg = err.error?.error || 'Failed to update token on server.';
        }
        this.cdr.detectChanges();
      }
    });
  }
}
