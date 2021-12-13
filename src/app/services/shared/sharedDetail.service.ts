/* eslint-disable prefer-arrow/prefer-arrow-functions */

import { Injectable } from '@angular/core';
import {esConfig}  from '../../../assets/languages/es';
import {enConfig}  from '../../../assets/languages/en';


const defaultLanguage = 'es';

const availableLanguages = [
  {
    code: 'es',
    text: 'Español',
    data: esConfig
  },
  {
    code: 'en',
    text: 'English',
    data: enConfig
  }
];

@Injectable({ providedIn: 'root' })

export class SharedService {
  public detailId: any;
  public detailResponse: any;
  public latitude: any;
  public longitude: any;
  public galleries: any;
}

function getLanguageCode() {
  const languageStored = JSON.parse(localStorage.getItem('language'));
  let userLanguage;
  if(!languageStored){
    userLanguage = defaultLanguage;
    const languageObj = {
      symbol: userLanguage
    };
    localStorage.setItem('language', JSON.stringify(languageObj));
  }else {
    userLanguage = languageStored.symbol;
  }
  console.log('return', userLanguage);
  return userLanguage;
}

function getLanguageObj(actualLanguage){
  let languageResult: any;
  let defaultResult;
  availableLanguages.map((language) => {
    if(actualLanguage === language.code) {
      languageResult = language.data;
    }
    if(language.code === defaultLanguage) {
      defaultResult = language.code;
    }
  });

  if(!languageResult) {
    languageResult = defaultResult;
    const languageObj = {
      symbol: defaultResult
    };
    localStorage.removeItem('language');
    localStorage.setItem('language', JSON.stringify(languageObj));
  }
  return languageResult;

}

function getLanguageData() {
  const actualLanguage = getLanguageCode();
  const pageObj = getLanguageObj(actualLanguage);
  return pageObj;
}

function setLanguageByCode(code){
  const languageObj = {
    symbol: code
  };
  localStorage.removeItem('language');
  localStorage.setItem('language', JSON.stringify(languageObj));
}

export { getLanguageData as getLanguageData,
          availableLanguages, getLanguageCode, setLanguageByCode};
