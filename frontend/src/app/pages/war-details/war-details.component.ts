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
  recentTags: string[] = [];

  pixKey: string = '8088cb28-faf9-4ed3-986b-af5cb0ed2610';
  payPalUrl: string = 'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=rodrigosimaogois@hotmail.com&currency_code=BRL';
  copiedPix: boolean = false;

  constructor(
    private warService: WarService,
    public translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadRecentTags();
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

  searchWar(tagToSearch?: string): void {
    let target = tagToSearch || this.inputTag;
    if (!target || !target.trim()) return;

    // Normaliza para garantir o '#' no envio para a API
    let formattedTag = target.trim().toUpperCase();
    if (!formattedTag.startsWith('#')) {
      formattedTag = '#' + formattedTag;
    }

    // Atualiza o input tirando o '#' apenas para exibição
    this.inputTag = formattedTag.replace('#', '');
    this.loading = true;
    this.errorMsg = '';

    this.warService.getWarDetails(formattedTag).subscribe({
      next: (data) => {
        this.warData = data;
        this.loading = false;
        this.saveTagToCache(formattedTag);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Request error:', err);

        if (err.status === 0) {
          this.errorMsg = this.t('ERR_OFFLINE');
        }
        else {
          const apiMessage = err?.error?.details || err?.error?.message || err?.error?.error || err?.error?.reason;
          this.errorMsg = apiMessage || this.t('ERR_SEARCH');
        }

        this.warData = null;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadRecentTags(): void {
    const cached = localStorage.getItem('clash_recent_tags');
    if (cached) {
      try {
        this.recentTags = JSON.parse(cached);
      } catch (e) {
        this.recentTags = [];
      }
    } else {
      this.recentTags = [];
    }
  }

  private saveTagToCache(tag: string): void {
    const cleanTag = tag.replace('#', '').toUpperCase().trim();

    // Recarrega do localStorage para garantir sincronia caso algo tenha mudado
    this.loadRecentTags();

    let updated = [cleanTag, ...this.recentTags.filter(t => t !== cleanTag)];
    updated = updated.slice(0, 5); // Limita às 5 mais recentes

    this.recentTags = updated;
    localStorage.setItem('clash_recent_tags', JSON.stringify(updated));
  }

  removeTagFromCache(tagToRemove: string, event: MouseEvent): void {
    event.stopPropagation();
    this.recentTags = this.recentTags.filter(tag => tag !== tagToRemove);
    localStorage.setItem('clash_recent_tags', JSON.stringify(this.recentTags));
  }

  copyPixKey(): void {
    navigator.clipboard.writeText(this.pixKey).then(() => {
      this.copiedPix = true;
      setTimeout(() => {
        this.copiedPix = false;
        this.cdr.detectChanges();
      }, 2000);
      this.cdr.detectChanges();
    });
  }
}
