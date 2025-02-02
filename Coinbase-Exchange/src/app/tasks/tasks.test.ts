import { expect } from '@open-wc/testing';
import Tasks from './tasks.js';

describe('Tasks', () => {
  it('<app-tasks> is an instance of Tasks', async () => {
    const element = document.createElement('app-tasks');
    expect(element).to.be.instanceOf(Tasks);
  });
});
