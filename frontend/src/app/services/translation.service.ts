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
      FOOTER_TEXT: 'Desenvolvido com ❤️ por',
      RECENT_SEARCHES: 'RECENTES:',
      CONFIG_TITLE: 'Gerenciador de Token API',
      CONFIG_SUBTITLE: 'Atualize o Bearer Token do Clash Royale no servidor.',
      CONFIG_STATUS_LABEL: 'Status do Server',
      CONFIG_STATUS_OK: 'Token Configurado',
      CONFIG_STATUS_NOK: 'Não Configurado',
      CONFIG_PREVIEW: 'Preview',
      CONFIG_SECRET_LABEL: 'Admin Secret Key',
      CONFIG_SECRET_PLACEHOLDER: 'Chave de administrador do server',
      CONFIG_TOKEN_LABEL: 'Novo Clash API Token',
      CONFIG_BTN_SAVE: '💾 Atualizar no Servidor',
      CONFIG_BTN_SAVING: 'Enviando...'
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
      FOOTER_TEXT: 'Developed with ❤️ by',
      RECENT_SEARCHES: 'RECENT:',
      CONFIG_TITLE: 'API Token Manager',
      CONFIG_SUBTITLE: 'Update the Clash Royale Bearer Token on the server.',
      CONFIG_STATUS_LABEL: 'Server Status',
      CONFIG_STATUS_OK: 'Token Configured',
      CONFIG_STATUS_NOK: 'Not Configured',
      CONFIG_PREVIEW: 'Preview',
      CONFIG_SECRET_LABEL: 'Admin Secret Key',
      CONFIG_SECRET_PLACEHOLDER: 'Server admin secret key',
      CONFIG_TOKEN_LABEL: 'New Clash API Token',
      CONFIG_BTN_SAVE: '💾 Update on Server',
      CONFIG_BTN_SAVING: 'Saving...'
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
