import { expect } from '@open-wc/testing';
import Reports from './reports.js';

describe('Reports', () => {
  it('<app-reports> is an instance of Reports', async () => {
    const element = document.createElement('app-reports');
    expect(element).to.be.instanceOf(Reports);
  });
});
