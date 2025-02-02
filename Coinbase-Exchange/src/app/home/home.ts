import { html, css, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { defineComponents, IgcAvatarComponent, IgcChipComponent, IgcListComponent, IgcListItemComponent } from 'igniteui-webcomponents';
import { IgcCategoryChartModule } from 'igniteui-webcomponents-charts';
import { ModuleManager } from 'igniteui-webcomponents-core';
import 'igniteui-webcomponents-grids/grids/combined.js';
import { CustomersType } from '../models/northwind/customers-type';
import { MeetingsTasksType } from '../models/crmapp-data/meetings-tasks-type';
import { RevenueType } from '../models/e-commerce/revenue-type';
import { eCommerceService } from '../services/ECommerce-service';
import { cRMAppDataService } from '../services/CRMAppData-service';
import { northwindService } from '../services/Northwind-service';

ModuleManager.register(IgcCategoryChartModule);

defineComponents(IgcListComponent, IgcListItemComponent, IgcAvatarComponent, IgcChipComponent);

@customElement('app-home')
export default class Home extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .row-layout {
      display: flex;
    }
    .group {
      background-color: hsla(var(--ig-gray-100));
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 12px;
      overflow: auto;
      position: relative;
      padding: 12px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .column-layout {
      display: flex;
      flex-direction: column;
    }
    .group_1 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 12px;
      position: relative;
      min-width: 280px;
      min-height: 50px;
      flex-grow: 2;
      flex-basis: 0;
    }
    .group_2 {
      background-color: hsla(var(--ig-surface-500));
      border-color: hsla(var(--ig-gray-200));
      border-width: 1px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      padding: 16px 16px 24px;
      min-width: 50px;
      min-height: 50px;
      flex-shrink: 0;
    }
    .group_3 {
      background-color: hsla(var(--ig-surface-500));
      border-color: hsla(var(--ig-gray-300));
      border-width: 1px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      padding: 16px 16px 24px;
      min-width: 50px;
      min-height: 50px;
      flex-shrink: 0;
    }
    .group_4 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 12px;
      position: relative;
      min-width: 280px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_5 {
      background-color: hsla(var(--ig-surface-500));
      border-color: hsla(var(--ig-gray-300));
      border-width: 1px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      overflow: auto;
      position: relative;
      padding: 16px 16px 24px;
      min-width: 50px;
      max-height: 428px;
      flex-shrink: 0;
    }
    .group_6 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      overflow: auto;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_7 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 2px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_8 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
    }
    .group_9 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 4px;
      position: relative;
      flex-shrink: 0;
    }
    .group_10 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 2px;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
    }
    .group_11 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 2px;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
    }
    .group_12 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: -2px;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
    }
    .group_13 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 2px;
      position: relative;
      min-width: 50px;
    }
    .text {
      height: max-content;
      min-width: min-content;
    }
    .hyperlink {
      text-align: right;
      color: hsla(var(--ig-primary-500));
      cursor: pointer;
      height: max-content;
      min-width: min-content;
    }
    .avatar::part(base) {
      background-color: rgba(71, 124, 41, 0.2);
    }
    .hyperlink_1 {
      color: hsla(var(--ig-primary-500));
      cursor: pointer;
      height: max-content;
      min-width: min-content;
    }
    .text_1 {
      color: hsla(var(--ig-gray-800));
      height: max-content;
      min-width: min-content;
    }
    .text_2 {
      color: hsla(var(--ig-gray-600));
      height: max-content;
      min-width: min-content;
    }
    .text_3 {
      color: hsla(var(--ig-gray-600));
      margin: 0 4px 0 0;
      height: max-content;
      min-width: min-content;
    }
    .hyperlink_2 {
      color: hsla(var(--ig-primary-500));
      height: max-content;
      min-width: min-content;
    }
    .hyperlink_3 {
      color: hsla(var(--ig-gray-600));
      height: max-content;
      min-width: min-content;
      flex-shrink: 0;
    }
    .chip {
      margin: 4px 0 0;
      width: max-content;
      height: max-content;
    }
    .avatar_1::part(base) {
      background-color: rgba(27, 95, 158, 0.2);
    }
    .avatar_2::part(base) {
      background-color: transparent;
    }
    .avatar_3::part(base) {
      background-color: transparent;
    }
    .category-chart {
      --brushes: #72B24D #9362A3 #F06583 #FCB13F #407DB7;
      --outlines: #72B24D #9362A3 #F06583 #FCB13F #407DB7;
      --marker-brushes: #72B24D #9362A3 #F06583 #FCB13F #407DB7;
      --marker-outlines: #72B24D #9362A3 #F06583 #FCB13F #407DB7;
      min-height: 300px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .grid {
      min-width: 248px;
      min-height: 300px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .list {
      height: max-content;
    }
  `;

  constructor() {
    super();
    eCommerceService.getRevenueList().then((data) => {
      this.eCommerceRevenue = data;
    }, err => console.log(err));
    this.northwindCustomers = northwindService.getData('CustomersType');
    cRMAppDataService.getMeetingsTasksList().then((data) => {
      this.cRMAppDataMeetingsTasks = data;
    }, err => console.log(err));
  }

  @state()
  private eCommerceRevenue: RevenueType[] = [];

  @state()
  private northwindCustomers: CustomersType[] = [];

  @state()
  private cRMAppDataMeetingsTasks: MeetingsTasksType[] = [];

  render() {
    return html`
      <link rel='stylesheet' href='../../ig-theme.css'>
      <link rel='stylesheet' href='node_modules/igniteui-webcomponents-grids/grids/themes/light/fluent.css'>
      <div class="row-layout group">
        <div class="column-layout group_1">
          <div class="column-layout group_2">
            <p class="typography__body-1 text">
              Quarterly Performance
            </p>
            <igc-category-chart .dataSource="${this.eCommerceRevenue}" chart-type="column" computed-plot-area-margin-mode="series" class="category-chart"></igc-category-chart>
            <a @click="${() => Router.go('/reports')}" class="typography__body-2 hyperlink">
              View All Reports
            </a>
          </div>
          <div class="column-layout group_3">
            <p class="typography__body-1 text">
              New Contracts
            </p>
            <igc-grid .data="${this.northwindCustomers}" primary-key="customerID" display-density="cosy" allow-filtering="true" filter-mode="excelStyleFilter" auto-generate="false" class="ig-typography ig-scrollbar grid">
              <igc-column field="customerID" data-type="string" header="customerID" sortable="true" selectable="false"></igc-column>
              <igc-column field="companyName" data-type="string" header="companyName" sortable="true" selectable="false"></igc-column>
              <igc-column field="contactName" data-type="string" header="contactName" sortable="true" selectable="false"></igc-column>
              <igc-column field="contactTitle" data-type="string" header="contactTitle" sortable="true" selectable="false"></igc-column>
              <igc-column field="address.street" data-type="string" header="street" sortable="true" selectable="false"></igc-column>
              <igc-column field="address.city" data-type="string" header="city" sortable="true" selectable="false"></igc-column>
              <igc-column field="address.region" data-type="string" header="region" sortable="true" selectable="false"></igc-column>
              <igc-column field="address.postalCode" data-type="string" header="postalCode" sortable="true" selectable="false"></igc-column>
              <igc-column field="address.country" data-type="string" header="country" sortable="true" selectable="false"></igc-column>
              <igc-column field="address.phone" data-type="string" header="phone" sortable="true" selectable="false"></igc-column>
            </igc-grid>
            <a @click="${() => Router.go('/contracts')}" class="typography__body-2 hyperlink">
              View All Contracts
            </a>
          </div>
        </div>
        <div class="column-layout group_4">
          <div class="column-layout group_5">
            <p class="typography__body-1 text">
              New Accounts
            </p>
            <div class="column-layout group_6">
              <igc-list class="list">
                ${this.northwindCustomers?.map((item) => html`
                  <igc-list-item>
                    <igc-avatar src="/src/assets/Account-List-Avatar-Icon.svg" shape="rounded" slot="start" class="avatar"></igc-avatar>
                    <div>
                      <div class="column-layout group_7">
                        <a @click="${() => Router.go('/account-sample')}" class="typography__body-2 hyperlink_1">
                          ${item.companyName}
                        </a>
                        <p class="typography__subtitle-2 text_1">
                          ${item.contactName}
                        </p>
                        <div class="row-layout group_8">
                          <p class="typography__caption text_2">
                            ${item.address?.street}
                          </p>
                          <p class="typography__caption text_3">
                            ,
                          </p>
                          <p class="typography__caption text_2">
                            ${item.address?.city}
                          </p>
                          <p class="typography__caption text_3">
                            ,
                          </p>
                          <p class="typography__caption text_2">
                            ${item.address?.country}
                          </p>
                        </div>
                        <p class="typography__caption text_2">
                          ${item.address?.phone}
                        </p>
                      </div>
                    </div>
                  </igc-list-item>
                `)}
              </igc-list>
            </div>
            <a @click="${() => Router.go('/accounts')}" class="typography__body-2 hyperlink">
              View All Accounts 
            </a>
          </div>
          <div class="column-layout group_5">
            <p class="typography__body-1 text">
              Recent Contacts
            </p>
            <div class="column-layout group_6">
              <igc-list class="list">
                ${this.northwindCustomers?.map((item) => html`
                  <igc-list-item>
                    <igc-avatar src="/src/assets/Contacts-List-Avatar-Icon.svg" slot="start" shape="circle" class="avatar_1"></igc-avatar>
                    <div>
                      <div class="column-layout group_7">
                        <a class="typography__body-2 hyperlink_2">
                          ${item.contactName}
                        </a>
                        <div class="row-layout group_9">
                          <p class="typography__caption text_1">
                            ${item.contactTitle}
                          </p>
                          <p class="typography__caption text_2">
                            @
                          </p>
                          <a class="typography__caption hyperlink_3">
                            ${item.companyName}
                          </a>
                        </div>
                      </div>
                    </div>
                  </igc-list-item>
                `)}
              </igc-list>
            </div>
            <a @click="${() => Router.go('/contacts')}" class="typography__body-2 hyperlink">
              View All Contacts 
            </a>
          </div>
        </div>
        <div class="column-layout group_4">
          <div class="column-layout group_3">
            <p class="typography__body-1 text">
              My Meetings
            </p>
            <igc-list class="list">
              ${this.cRMAppDataMeetingsTasks?.map((item) => html`
                <igc-list-item>
                  <igc-avatar src="/src/assets/Calendar-Avatar-Icon.svg" slot="start" class="avatar_2"></igc-avatar>
                  <div>
                    <div class="column-layout group_7">
                      <div class="row-layout group_10">
                        <p class="typography__subtitle-2 text_1">
                          Meeting with 
                        </p>
                        <p class="typography__subtitle-2 text_1">
                          ${item.Contact}
                        </p>
                      </div>
                      <div class="row-layout group_11">
                        <p class="typography__caption text_2">
                          ${item.MeetingDate}
                        </p>
                        <p class="typography__caption text_2">
                          -
                        </p>
                        <p class="typography__caption text_2">
                          ${item.MeetingTime}
                        </p>
                      </div>
                      <igc-chip size="large" class="chip">
                        ${item.MeetingType}
                      </igc-chip>
                    </div>
                  </div>
                </igc-list-item>
              `)}
            </igc-list>
            <a @click="${() => Router.go('/calendar')}" class="typography__body-2 hyperlink">
              View Calendar
            </a>
          </div>
          <div class="column-layout group_3">
            <p class="typography__body-1 text">
              Today’s Tasks
            </p>
            <igc-list class="list">
              ${this.cRMAppDataMeetingsTasks?.map((item) => html`
                <igc-list-item>
                  <igc-avatar src="/src/assets/Tasks-Avatar-Icon.svg" slot="start" class="avatar_3"></igc-avatar>
                  <div>
                    <div class="column-layout group_7">
                      <div class="row-layout group_12">
                        <p class="typography__subtitle-2 text_1">
                          ${item.Task}
                        </p>
                        <p class="typography__subtitle-2 text_1">
                          -
                        </p>
                        <p class="typography__subtitle-2 text_1">
                          ${item.Company}
                        </p>
                      </div>
                      <div class="row-layout group_13">
                        <p class="typography__caption text_2">
                          Due by
                        </p>
                        <p class="typography__caption text_2">
                          ${item.DueDate}
                        </p>
                      </div>
                      <igc-chip size="large" class="chip">
                        ${item.TaskStatus}
                      </igc-chip>
                    </div>
                  </div>
                </igc-list-item>
              `)}
            </igc-list>
            <a @click="${() => Router.go('/tasks')}" class="typography__body-2 hyperlink">
              View Tasks
            </a>
          </div>
        </div>
      </div>
    `;
  }
}
