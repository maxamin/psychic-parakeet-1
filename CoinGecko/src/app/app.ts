import { html, css, LitElement } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { routes } from './app-routing.js';
import { defineComponents, IgcAvatarComponent, IgcIconButtonComponent, IgcIconComponent, IgcListComponent, IgcListItemComponent, IgcNavbarComponent, IgcNavDrawerComponent, IgcRippleComponent } from 'igniteui-webcomponents';
import { Table1Type } from './models/crmapp-data/table1-type';
import { cRMAppDataService } from './services/CRMAppData-service';

defineComponents(IgcIconComponent, IgcNavbarComponent, IgcIconButtonComponent, IgcRippleComponent, IgcNavDrawerComponent, IgcListComponent, IgcListItemComponent, IgcAvatarComponent);

@customElement('app-root')
export default class App extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .row-layout {
      display: flex;
    }
    .group {
      background-color: hsla(var(--ig-gray-900));
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      overflow: hidden;
      position: relative;
      min-height: 56px;
    }
    .group_1 {
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      position: relative;
      width: 56px;
      height: 56px;
      min-width: 50px;
      min-height: 50px;
      max-width: 56px;
      max-height: 56px;
    }
    .group_2 {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 1rem;
      overflow: hidden;
    }
    .group_3 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-height: 50px;
      flex-grow: 1;
    }
    .icon {
      --size: 24px;
      font-size: 24px;
      width: 24px;
      height: 24px;
      color: hsla(var(--ig-surface-500));
    }
    .image {
      object-fit: none;
      width: 413px;
      height: 14px;
      min-width: 413px;
      min-height: 14px;
      max-width: 413px;
      max-height: 14px;
      flex-shrink: 0;
    }
    .avatar::part(base) {
      background-color: transparent;
    }
    .icon-button::part(base) {
      color: hsla(var(--ig-surface-500));
    }
    .navbar {
      color: hsla(var(--ig-surface-500));
      background-color: hsla(var(--ig-primary-500));
      height: max-content;
      min-width: min-content;
      flex-grow: 1;
      flex-basis: 0;
    }
    .nav-drawer {
      min-width: min-content;
      min-height: 0;
      max-width: 200px;
      flex-shrink: 0;
    }
    .view-container {
      overflow: auto;
      display: block;
      position: relative;
      flex-grow: 1;
    }
    .nav-drawer::part(main) {
      width: 200px;
    }
    .list {
      height: max-content;
    }
  `;

  constructor() {
    super();
    cRMAppDataService.getTable1List().then((data) => {
      this.cRMAppDataTable1 = data;
    }, err => console.log(err));
  }

  @query('#nav-drawer')
  private navDrawer?: IgcNavDrawerComponent;

  @state()
  private cRMAppDataTable1: Table1Type[] = [];

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <link rel='stylesheet' href='../../ig-theme.css'>
      <div class="row-layout group">
        <div @click="${() => this.navDrawer?.toggle()}" class="row-layout group_1">
          <span class="material-icons icon">
            menu
          </span>
        </div>
        <igc-navbar class="navbar">
          <div class="row-layout group_2">
            <img src="/src/assets/CRM Logo.svg" .attr class="image" />
          </div>
          <igc-icon-button slot="end" variant="flat" class="icon-button">
            <span class="material-icons">
              search
            </span>
            <igc-ripple></igc-ripple>
          </igc-icon-button>
          <igc-icon-button slot="end" variant="flat" class="icon-button">
            <span class="material-icons">
              settings
            </span>
            <igc-ripple></igc-ripple>
          </igc-icon-button>
          <igc-icon-button slot="end" variant="flat" class="icon-button">
            <span class="material-icons">
              notifications_none
            </span>
            <igc-ripple></igc-ripple>
          </igc-icon-button>
        </igc-navbar>
      </div>
      <div class="row-layout group_3">
        <igc-nav-drawer ?open="${true}" position="relative" id="nav-drawer" class="nav-drawer">
          <igc-list class="list">
            ${this.cRMAppDataTable1?.map((item) => html`
              <igc-list-item @click="${() => Router.go('/home')}">
                <igc-avatar src="/src/assets/Home-Avatar-Icon.svg" slot="start" shape="circle" class="avatar"></igc-avatar>
                <div slot="title">Home</div>
              </igc-list-item>
            `)}
            <igc-list-item @click="${() => Router.go('/accounts')}">
              <igc-avatar src="/src/assets/Accounts-Avatar-Icon.svg" slot="start" shape="circle" class="avatar"></igc-avatar>
              <div slot="title">Accounts</div>
            </igc-list-item>
            <igc-list-item @click="${() => Router.go('/contacts')}">
              <igc-avatar src="/src/assets/Contacts-Avatar-Icon.svg" slot="start" shape="circle" class="avatar"></igc-avatar>
              <div slot="title">Contacts</div>
            </igc-list-item>
            <igc-list-item @click="${() => Router.go('/contracts')}">
              <igc-avatar src="/src/assets/Contracts-Avatar-Icon.svg" slot="start" shape="circle" class="avatar"></igc-avatar>
              <div slot="title">Contracts</div>
            </igc-list-item>
            <igc-list-item @click="${() => Router.go('/reports')}">
              <igc-avatar src="/src/assets/Reports-Avatar-Icon.svg" slot="start" shape="circle" class="avatar"></igc-avatar>
              <div slot="title">Reports</div>
            </igc-list-item>
            <igc-list-item @click="${() => Router.go('/calendar')}">
              <igc-avatar src="/src/assets/Calendar-Avatar-Icon.svg" slot="start" shape="circle" class="avatar"></igc-avatar>
              <div slot="title">Calendar</div>
            </igc-list-item>
            <igc-list-item @click="${() => Router.go('/tasks')}">
              <igc-avatar src="/src/assets/Tasks-Avatar-Icon.svg" slot="start" shape="circle" class="avatar"></igc-avatar>
              <div slot="title">Tasks</div>
            </igc-list-item>
          </igc-list>
        </igc-nav-drawer>
        <router-outlet class="view-container"></router-outlet>
      </div>
    `;
  }

  firstUpdated() {
    const outlet = this.shadowRoot?.querySelector('router-outlet');
    const router = new Router(outlet);
    router.setRoutes(routes);
  }
}
