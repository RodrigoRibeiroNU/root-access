import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguage = 'pt-br';
  private languageData = new BehaviorSubject<any>({});
  public languageData$ = this.languageData.asObservable();

  constructor(private http: HttpClient) { }

  public loadLanguage(lang: string) {
    const langPath = `assets/data/languages/${lang}.json`;
    return this.http.get<any>(langPath).pipe(
      tap(data => {
        this.currentLanguage = lang;
        this.languageData.next(data);
        console.log(`Idioma ${lang} carregado.`);
      })
    );
  }

  public setLanguage(lang: string) {
    localStorage.setItem('preferred_language', lang);
    return this.loadLanguage(lang);
  }

  public getInitialLanguage(): string {
    return localStorage.getItem('preferred_language') || 'pt-br';
  }

  /**
   * Obtém um objeto de tradução do ficheiro de idioma carregado.
   * @param key A chave do objeto (ex: 'commands').
   * @returns O objeto de tradução.
   */
  public getTranslationObject(key: string): any {
    const keys = key.split('.');
    let result = this.languageData.getValue();

    for (const k of keys) {
      if (result === undefined || result === null) return {};
      result = result[k];
    }

    return result || {};
  }

  public getString(key: string, ...replacements: string[]): string {
    const keys = key.split('.');
    let result = this.languageData.getValue();

    for (const k of keys) {
      if (result === undefined || result === null) break;
      result = result[k];
    }

    if (typeof result !== 'string') {
      console.warn(`Chave de tradução não encontrada ou não é uma string: ${key}`);
      return key; 
    }

    return result.replace(/{(\d+)}/g, (match, number) => {
      return typeof replacements[number] !== 'undefined'
        ? replacements[number]
        : match;
    });
  }
}