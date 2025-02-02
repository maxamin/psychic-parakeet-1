import { expect } from '@open-wc/testing';
import Contracts from './contracts.js';

describe('Contracts', () => {
  it('<app-contracts> is an instance of Contracts', async () => {
    const element = document.createElement('app-contracts');
    expect(element).to.be.instanceOf(Contracts);
  });
});
