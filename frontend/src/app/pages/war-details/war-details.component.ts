import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WarService } from '../../services/war.service';
import { TranslationService, Language } from '../../services/translation.service';
import { WarDetailsResponse } from '../../models/war.model';

@Component({
  selector: 'app-war-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './war-details.component.html',
  styleUrls: ['./war-details.component.css']
})
export class WarDetailsComponent implements OnInit {
  inputTag: string = '';
  warData: WarDetailsResponse | null = null;
  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    private warService: WarService,
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

  }

  switchLanguage(lang: Language): void {
    this.translationService.setLanguage(lang);
    if (this.errorMsg) {
      this.errorMsg = this.t('ERR_SEARCH');
    }
  }

  t(key: string): string {
    return this.translationService.translate(key);
  }

  searchWar(): void {
    if (!this.inputTag.trim()) return;

    this.loading = true;
    this.errorMsg = '';

    this.warService.getWarDetails(this.inputTag).subscribe({
      next: (data) => {
        this.warData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Request error:', err);
        this.errorMsg = this.t('ERR_SEARCH');
        this.warData = null; // Clear tables on error
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
