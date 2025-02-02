import { expect } from '@open-wc/testing';
import Accounts from './accounts.js';

describe('Accounts', () => {
  it('<app-accounts> is an instance of Accounts', async () => {
    const element = document.createElement('app-accounts');
    expect(element).to.be.instanceOf(Accounts);
  });
});
