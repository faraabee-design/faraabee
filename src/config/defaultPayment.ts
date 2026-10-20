import { PaymentSettings } from '../types';

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  codEnabled: true,
  bankTransfer: {
    enabled: true,
    bankName: 'Meezan Bank Limited (Islamic Banking)',
    accountTitle: 'FARAABEE BOTANICAL APOTHECARY',
    accountNumber: '02010108923412',
    iban: 'PK45MEZN0002010108923412',
    branchName: 'Model Town Islamic Branch, Gujranwala / Lahore',
    instructions: 'Transfer the exact order total via your online banking app (Meezan, HBL, Nayapay, SadaPay, etc.) and enter your Transaction ID (TID) below for priority dispatch.',
  },
  jazzCash: {
    enabled: true,
    accountTitle: 'Muhammad Faraabee',
    mobileNumber: '',
    instructions: 'Send money to your configured JazzCash Mobile Account. Once sent, enter the 12-digit TID from your JazzCash confirmation SMS.',
  },
  easyPaisa: {
    enabled: true,
    accountTitle: 'Muhammad Faraabee',
    mobileNumber: '',
    instructions: 'Transfer to your configured Easypaisa Account. Enter your Transaction Reference ID below for instantaneous verification.',
  },
  generalInstructions: 'Online bank & wallet payments receive instant priority packing. Your order reference and tracking will be dispatched to your phone.',
};
