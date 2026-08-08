import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'pt' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<Language>('pt');
  currentLang$ = this.currentLangSubject.asObservable();

  private translations: Record<Language, Record<string, string>> = {
    pt: {
      SEARCH_TITLE: 'Consulta de Guerra de Clãs',
      PLACEHOLDER_TAG: 'Digite a Tag do Clã (ex: 20RGVR8)',
      BTN_SEARCH: 'Buscar',
      BTN_SEARCHING: 'Buscando...',
      ERR_SEARCH: 'Erro ao buscar dados do clã. Verifique a Tag digitada e se o clã está em guerra.',
      TH_NAME: 'NOME',
      TH_CURRENT: 'ATUAL',
      TH_DECKS: 'DECKS',
      TH_PERSP: 'PERSP',
      TH_OVERALL: 'GERAL',
      TITLE_PENDING_DECKS: '2. Membros com Decks Pendentes Hoje',
      TH_PLAYER: 'Jogador',
      TH_MISSING_TODAY: 'Decks Faltantes Hoje',
      TH_LAST_SEEN: 'Visto por último',
      TH_IN_CLAN: 'No Clã',
      DECKS_LABEL: 'decks',
      EMPTY_SLOTS: 'Vaga(s) Vazia(s) / Ex-membros',
      YES: 'Sim',
      NO: 'Não',
      TITLE_MISSED_HISTORY: '3. Histórico de Ataques Perdedores / Não Realizados na Semana',
      TH_MISSED_DECKS: 'Decks Perderam nos Dias Anteriores',
      NO_MISSED_MSG: 'Nenhum jogador perdeu ataques nos dias anteriores desta semana!',
      FOOTER_TEXT: 'Desenvolvido com ❤️ por'
    },
    en: {
      SEARCH_TITLE: 'Clan War Lookup',
      PLACEHOLDER_TAG: 'Enter Clan Tag (e.g., 20RGVR8)',
      BTN_SEARCH: 'Search',
      BTN_SEARCHING: 'Searching...',
      ERR_SEARCH: 'Error fetching clan data. Check the Tag and ensure the clan is in a war.',
      TH_NAME: 'NAME',
      TH_CURRENT: 'CURRENT',
      TH_DECKS: 'DECKS',
      TH_PERSP: 'PERSP',
      TH_OVERALL: 'OVERALL',
      TITLE_PENDING_DECKS: '2. Members with Pending Decks Today',
      TH_PLAYER: 'Player',
      TH_MISSING_TODAY: 'Missing Decks Today',
      TH_LAST_SEEN: 'Last Seen',
      TH_IN_CLAN: 'In Clan',
      DECKS_LABEL: 'decks',
      EMPTY_SLOTS: 'Empty Slot(s) / Ex-members',
      YES: 'Yes',
      NO: 'No',
      TITLE_MISSED_HISTORY: '3. History of Missed / Lost Attacks This Week',
      TH_MISSED_DECKS: 'Decks Missed in Previous Days',
      NO_MISSED_MSG: 'No players missed attacks in previous days this week!',
      FOOTER_TEXT: 'Developed with ❤️ by'
    }
  };

  get currentLang(): Language {
    return this.currentLangSubject.value;
  }

  setLanguage(lang: Language): void {
    this.currentLangSubject.next(lang);
  }

  translate(key: string): string {
    return this.translations[this.currentLang][key] || key;
  }
}
