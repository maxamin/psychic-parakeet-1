import { expect } from '@open-wc/testing';
import Calendar from './calendar.js';

describe('Calendar', () => {
  it('<app-calendar> is an instance of Calendar', async () => {
    const element = document.createElement('app-calendar');
    expect(element).to.be.instanceOf(Calendar);
  });
});
