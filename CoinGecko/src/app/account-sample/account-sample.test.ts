import { expect } from '@open-wc/testing';
import AccountSample from './account-sample.js';

describe('AccountSample', () => {
  it('<app-account-sample> is an instance of AccountSample', async () => {
    const element = document.createElement('app-account-sample');
    expect(element).to.be.instanceOf(AccountSample);
  });
});
