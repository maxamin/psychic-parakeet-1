import { expect } from '@open-wc/testing';
import Contacts from './contacts.js';

describe('Contacts', () => {
  it('<app-contacts> is an instance of Contacts', async () => {
    const element = document.createElement('app-contacts');
    expect(element).to.be.instanceOf(Contacts);
  });
});
