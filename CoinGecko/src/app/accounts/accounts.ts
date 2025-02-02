import { html, css, LitElement } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { Router } from '@vaadin/router';
import { defineComponents, IgcButtonComponent, IgcDialogComponent, IgcDropdownComponent, IgcIconComponent, IgcInputComponent, IgcRippleComponent, IgcSelectComponent } from 'igniteui-webcomponents';
import 'igniteui-webcomponents-grids/grids/combined.js';
import { CustomersType } from '../models/northwind/customers-type';
import { northwindService } from '../services/Northwind-service';

defineComponents(IgcButtonComponent, IgcIconComponent, IgcRippleComponent, IgcSelectComponent, IgcInputComponent, IgcDropdownComponent, IgcDialogComponent);

@customElement('app-accounts')
export default class Accounts extends LitElement {
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
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      overflow: auto;
      position: relative;
      padding: 12px;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .column-layout {
      display: flex;
      flex-direction: column;
    }
    .group_1 {
      background-color: hsla(var(--ig-surface-500));
      border-color: hsla(var(--ig-gray-300));
      border-width: 1px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      padding: 16px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_2 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-shrink: 0;
    }
    .header {
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
    }
    .page-title {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 12px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_3 {
      background-color: rgba(71, 124, 41, 0.2);
      border-radius: 6px;
      justify-content: center;
      align-items: center;
      align-content: flex-start;
      position: relative;
      width: 48px;
      height: 48px;
      min-width: 48px;
      min-height: 48px;
      max-width: 48px;
      max-height: 48px;
    }
    .buttons {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
    }
    .filters-and-sorting {
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
    }
    .group_4 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 16px;
    }
    .group_5 {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-shrink: 0;
    }
    .group_6 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      padding: 16px 0 0;
      min-width: 50px;
      min-height: 50px;
    }
    .group_7 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 40px;
      overflow: auto;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      max-height: 600px;
      flex-shrink: 0;
    }
    .group_8 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-shrink: 0;
    }
    .group_9 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      gap: 40px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_10 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 280px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_11 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      margin: 0 0 5px;
      min-width: 50px;
    }
    .group_12 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: flex-start;
      align-content: flex-start;
      gap: 40px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-shrink: 0;
    }
    .group_13 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .image {
      object-fit: cover;
      width: 20px;
      height: 20px;
      min-width: 20px;
      min-height: 0;
      max-width: 20px;
      max-height: 20px;
      flex-shrink: 0;
    }
    .h6 {
      height: max-content;
      min-width: min-content;
    }
    .icon {
      --size: 24px;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .h6_1 {
      color: hsla(var(--ig-gray-900));
      height: max-content;
    }
    .text {
      margin: 0 0 24px;
      height: max-content;
    }
    .text_1 {
      color: hsla(var(--ig-gray-500));
      height: max-content;
      min-width: min-content;
    }
    .text_2 {
      color: hsla(var(--ig-gray-700));
      height: max-content;
      min-width: min-content;
    }
    .text_3 {
      margin: 0 0 8px;
      height: max-content;
    }
    .textarea {
      height: max-content;
    }
    .button {
      height: max-content;
      flex-shrink: 0;
    }
    .select {
      height: max-content;
      min-width: min-content;
      flex-shrink: 0;
    }
    .input {
      height: max-content;
      min-width: 120px;
      flex-shrink: 0;
    }
    .dropdown {
      min-width: min-content;
    }
    .user-input {
      height: max-content;
    }
    .user-input_2 {
      height: max-content;
      flex-grow: 1;
      flex-basis: 0;
    }
    .button_1 {
      margin: 8px 16px 16px 0;
      height: max-content;
    }
    .button_2::part(base) {
      color: hsla(var(--ig-primary-500));
      background-color: hsla(var(--ig-secondary-100));
    }
    .button_3::part(base) {
      color: hsla(var(--ig-primary-500));
      background-color: hsla(var(--ig-secondary-100));
    }
    .button_4::part(base) {
      color: hsla(var(--ig-primary-500));
      background-color: hsla(var(--ig-secondary-100));
    }
    .button_5::part(base) {
      color: hsla(var(--ig-primary-500));
    }
    .dropdown::part(base) {
      height: max-content;
    }
    .button_1_1::part(base) {
      color: hsla(var(--ig-surface-500));
    }
    .grid {
      min-height: 0;
      flex-grow: 1;
      flex-basis: 0;
    }
  `;

  constructor() {
    super();
    this.northwindCustomers = northwindService.getData('CustomersType');
  }

  @state()
  private value: string = '2';

  @query('#button')
  private button?: IgcButtonComponent;

  @query('#dropdown')
  private dropdown?: IgcDropdownComponent;

  @state()
  private northwindCustomers: CustomersType[] = [];

  @query('#new-account-dialog')
  private newAccountDialog?: IgcDialogComponent;

  @state()
  private value1: string = '1';

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <link rel='stylesheet' href='../../ig-theme.css'>
      <link rel='stylesheet' href='node_modules/igniteui-webcomponents-grids/grids/themes/light/fluent.css'>
      <div class="row-layout group">
        <div class="column-layout group_1">
          <div class="column-layout group_2">
            <div class="row-layout header">
              <div class="row-layout page-title">
                <div class="row-layout group_3">
                  <img src="/src/assets/Accounts Icon - Green.svg" .attr class="image" />
                </div>
                <h6 class="h6">
                  Accounts
                </h6>
              </div>
              <div class="row-layout buttons">
                <igc-button variant="flat" size="large" @click="${() => this.newAccountDialog?.toggle()}" class="button button_2">
                  <span class="material-icons">
                    business
                  </span>
                  <span>New Account</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-button variant="flat" size="large" class="button button_3">
                  <span class="material-icons">
                    search
                  </span>
                  <span>Discover companies</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-button variant="flat" size="large" class="button button_4">
                  <span class="material-icons">
                    import_export
                  </span>
                  <span>Import</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
              </div>
            </div>
            <div class="row-layout filters-and-sorting">
              <div class="row-layout group_4">
                <igc-select ?outlined="${false}" value="${this.value}" @igcChange="${(e: any) => this.value = e.detail.value}" class="select">
                  <igc-select-item value="1">
                    My Accounts
                  </igc-select-item>
                  <igc-select-item value="2">
                    All Accounts
                  </igc-select-item>
                </igc-select>
                <igc-input placeholder="Search accounts" ?outlined="${false}" class="input">
                  <span slot="prefix">
                    <span class="material-icons icon">
                      search
                    </span>
                  </span>
                </igc-input>
              </div>
              <div class="row-layout group_5">
                <igc-button variant="flat" size="large" @click="${() => this.dropdown?.toggle(this.button)}" id="button" class="button button_5">
                  <span>Recently Updated</span>
                  <span class="material-icons">
                    keyboard_arrow_down
                  </span>
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-dropdown id="dropdown" class="dropdown">
                  <igc-dropdown-item>
                    Name
                  </igc-dropdown-item>
                  <igc-dropdown-item>
                    Recently Updated
                  </igc-dropdown-item>
                </igc-dropdown>
              </div>
            </div>
          </div>
          <igc-grid .data="${this.northwindCustomers}" primary-key="contactName" display-density="cosy" allow-filtering="true" filter-mode="excelStyleFilter" auto-generate="false" @click="${() => Router.go('/account-sample')}" class="ig-typography ig-scrollbar grid">
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
        </div>
      </div>
      <igc-dialog ?close-on-outside-click="${true}" ?keep-open-on-escape="${false}" id="new-account-dialog">
        <div class="column-layout group_6">
          <h6 class="h6_1">
            New Account
          </h6>
          <div class="column-layout group_7">
            <div class="column-layout group_8">
              <p class="typography__subtitle-2 text">
                ACCOUNT INFORMATION
              </p>
              <div class="row-layout group_9">
                <div class="column-layout group_10">
                  <igc-input label="Account Name" ?outlined="${false}" class="user-input">
                    <span slot="suffix">
                      <span class="material-icons icon">
                        search
                      </span>
                    </span>
                  </igc-input>
                  <igc-select ?outlined="${false}" label="Type" value="${this.value1}" @igcChange="${(e: any) => this.value1 = e.detail.value}" class="user-input">
                    <igc-select-item value="1">
                      -- None --
                    </igc-select-item>
                    <igc-select-item value="2">
                      Analyst
                    </igc-select-item>
                    <igc-select-item value="3">
                      Competitor
                    </igc-select-item>
                    <igc-select-item value="4">
                      Customer
                    </igc-select-item>
                    <igc-select-item value="5">
                      Integrator
                    </igc-select-item>
                    <igc-select-item value="6">
                      Investor
                    </igc-select-item>
                    <igc-select-item value="7">
                      Partner
                    </igc-select-item>
                    <igc-select-item value="8">
                      Press
                    </igc-select-item>
                    <igc-select-item value="9">
                      Prospect
                    </igc-select-item>
                    <igc-select-item value="10">
                      Reseller
                    </igc-select-item>
                    <igc-select-item value="11">
                      Other
                    </igc-select-item>
                  </igc-select>
                  <igc-input label="Website" ?outlined="${false}" class="user-input"></igc-input>
                  <span class="textarea">Textarea not yet available in WebComponents</span>
                </div>
                <div class="column-layout group_10">
                  <div class="column-layout group_11">
                    <p class="typography__caption text_1">
                      Account Owner
                    </p>
                    <p class="typography__body-1 text_2">
                      Andrea Silveira
                    </p>
                  </div>
                  <igc-input label="Parent Account" placeholder="Search Accounts..." ?outlined="${false}" class="user-input">
                    <span slot="suffix">
                      <span class="material-icons icon">
                        search
                      </span>
                    </span>
                  </igc-input>
                  <igc-input type="tel" label="Phone" ?outlined="${false}" class="user-input"></igc-input>
                  <igc-select ?outlined="${false}" label="Industry" value="${this.value1}" @igcChange="${(e: any) => this.value1 = e.detail.value}" class="user-input">
                    <igc-select-item value="1">
                      -- None --
                    </igc-select-item>
                    <igc-select-item value="2">
                      Agriculture
                    </igc-select-item>
                    <igc-select-item value="3">
                      Apparel
                    </igc-select-item>
                    <igc-select-item value="4">
                      Banking
                    </igc-select-item>
                    <igc-select-item value="5">
                      Biotechnology
                    </igc-select-item>
                    <igc-select-item value="6">
                      Chemicals
                    </igc-select-item>
                    <igc-select-item value="7">
                      Communications
                    </igc-select-item>
                    <igc-select-item value="8">
                      Construction
                    </igc-select-item>
                  </igc-select>
                  <igc-select ?outlined="${false}" label="Employees" class="user-input">
                    <igc-select-item value="1">
                      Self Employed
                    </igc-select-item>
                    <igc-select-item value="2">
                      1-10
                    </igc-select-item>
                    <igc-select-item value="3">
                      11-50
                    </igc-select-item>
                    <igc-select-item value="4">
                      51-250
                    </igc-select-item>
                    <igc-select-item value="5">
                      +250
                    </igc-select-item>
                  </igc-select>
                </div>
              </div>
            </div>
            <div class="row-layout group_12">
              <div class="column-layout group_10">
                <p class="typography__subtitle-2 text_3">
                  BILLING INFORMATION
                </p>
                <igc-input label="Address" placeholder="Search Address" ?outlined="${false}" class="user-input">
                  <span slot="suffix">
                    <span class="material-icons icon">
                      search
                    </span>
                  </span>
                </igc-input>
                <igc-input label="Street" ?outlined="${false}" class="user-input"></igc-input>
                <div class="row-layout group_13">
                  <igc-input label="City" ?outlined="${false}" class="user-input_2"></igc-input>
                  <igc-input label="State / Province" ?outlined="${false}" class="user-input_2"></igc-input>
                </div>
                <div class="row-layout group_13">
                  <igc-input label="Zip / Postal Code" ?outlined="${false}" class="user-input_2"></igc-input>
                  <igc-select ?outlined="${false}" label="Country" value="${this.value1}" @igcChange="${(e: any) => this.value1 = e.detail.value}" class="user-input_2">
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                  </igc-select>
                </div>
              </div>
              <div class="column-layout group_10">
                <p class="typography__subtitle-2 text_3">
                  SHIPPING INFORMATION
                </p>
                <igc-input label="Address" placeholder="Search Address" ?outlined="${false}" class="user-input">
                  <span slot="suffix">
                    <span class="material-icons icon">
                      search
                    </span>
                  </span>
                </igc-input>
                <igc-input label="Street" ?outlined="${false}" class="user-input"></igc-input>
                <div class="row-layout group_13">
                  <igc-input label="City" ?outlined="${false}" class="user-input_2"></igc-input>
                  <igc-input label="State / Province" ?outlined="${false}" class="user-input_2"></igc-input>
                </div>
                <div class="row-layout group_13">
                  <igc-input label="Zip / Postal Code" ?outlined="${false}" class="user-input_2"></igc-input>
                  <igc-select ?outlined="${false}" label="Country" value="${this.value1}" @igcChange="${(e: any) => this.value1 = e.detail.value}" class="user-input_2">
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                    <igc-select-item value="2">
                      Country 1
                    </igc-select-item>
                  </igc-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div slot="footer">
          <igc-button variant="flat" size="large" @click="${() => this.newAccountDialog?.toggle()}" class="button_1">
            Cancel
            <igc-ripple></igc-ripple>
          </igc-button>
          <igc-button size="large" @click="${() => this.newAccountDialog?.toggle()}" class="button_1 button_1_1">
            Save
            <igc-ripple></igc-ripple>
          </igc-button>
        </div>
      </igc-dialog>
    `;
  }
}
