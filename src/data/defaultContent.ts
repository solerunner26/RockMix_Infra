import { Product } from '../types';
import siteContentJson from './siteContent.json';

export interface SiteContent {
  global: {
    companyName: string;
    logo: string;
    footerText: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    buttonBrowseLabel: string;
    buttonQuoteLabel: string;
    buttonCallbackLabel: string;
    backgroundImage: string;
  };
  about: {
    title: string;
    subtitle: string;
    description1: string;
    description2: string;
    image: string;
    showSection: boolean;
  };
  support: {
    title: string;
    description: string;
    showSection: boolean;
  };
  dealership: {
    title: string;
    description: string;
    image: string;
    showSection: boolean;
  };
  contact: {
    title: string;
    description: string;
    showSection: boolean;
  };
  products: Product[];
  buttons: {
    quoteBtnText: string;
    callbackBtnText: string;
    brochureBtnText: string;
    detailsBtnText: string;
    machineryBtnText: string;
  };
  forms: {
    quoteTitle: string;
    quoteSuccess: string;
    callbackTitle: string;
    callbackSuccess: string;
    contactTitle: string;
    contactSuccess: string;
    dealershipTitle: string;
    dealershipSuccess: string;
  };
  theme: {
    primaryColor: string;
    accentColor: string;
    borderRadius: string;
  };
}

export const DEFAULT_CONTENT = siteContentJson as SiteContent;

