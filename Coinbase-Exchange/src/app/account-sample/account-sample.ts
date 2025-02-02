import { html, css, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { defineComponents, IgcAccordionComponent, IgcAvatarComponent, IgcButtonComponent, IgcCheckboxComponent, IgcChipComponent, IgcExpansionPanelComponent, IgcIconComponent, IgcListComponent, IgcListItemComponent, IgcRippleComponent, IgcTabsComponent } from 'igniteui-webcomponents';

defineComponents(IgcTabsComponent, IgcButtonComponent, IgcIconComponent, IgcRippleComponent, IgcAccordionComponent, IgcExpansionPanelComponent, IgcAvatarComponent, IgcCheckboxComponent, IgcListComponent, IgcListItemComponent, IgcChipComponent);

@customElement('app-account-sample')
export default class AccountSample extends LitElement {
  static styles = css`
    :host {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
    }
    .column-layout {
      display: flex;
      flex-direction: column;
    }
    .group {
      border-color: hsla(var(--ig-gray-200));
      border-width: 0px 0px 2px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: space-between;
      position: relative;
      padding: 20px;
      min-width: 50px;
      min-height: 50px;
    }
    .row-layout {
      display: flex;
    }
    .account-header {
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: flex-start;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
    }
    .page-title {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_1 {
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
    .group_2 {
      justify-content: center;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_3 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_4 {
      border-color: hsla(var(--ig-gray-200));
      border-width: 0px 1px 0px 0px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      padding: 0 24px 0 0;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .group_5 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
    }
    .group_6 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      position: relative;
      min-width: 50px;
      min-height: 50px;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .group_7 {
      background-color: hsla(var(--ig-gray-100));
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: stretch;
      gap: 12px;
      overflow: auto;
      position: relative;
      padding: 12px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_8 {
      background-color: hsla(var(--ig-surface-500));
      border-color: hsla(var(--ig-gray-200));
      border-width: 1px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      padding: 16px;
      min-width: 576px;
      flex-grow: 2;
      flex-basis: 0;
    }
    .tabs {
      min-width: 0;
      min-height: 0;
      flex-grow: 1;
      flex-shrink: 0;
    }
    .buttons-1 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
    }
    .accordion {
      overflow-y: auto;
      flex-shrink: 0;
    }
    .group_9 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 12px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_10 {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 8px;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
    }
    .group_11 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 8px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_12 {
      justify-content: flex-start;
      align-items: baseline;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
    }
    .group_13 {
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 16px;
      position: relative;
      min-width: 50px;
    }
    .demo-content {
      border-color: hsla(var(--ig-secondary-200));
      border-width: 2px;
      border-style: dashed;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 32px;
      padding: 48px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .demo-content-1 {
      border-color: hsla(var(--ig-secondary-200));
      border-width: 2px;
      border-style: dashed;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 32px;
      padding: 32px;
      min-height: 50px;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_14 {
      background-color: hsla(var(--ig-surface-500));
      border-color: hsla(var(--ig-gray-200));
      border-width: 1px;
      border-style: solid;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      padding: 16px;
      min-width: max-content;
      flex-grow: 1;
      flex-basis: 0;
    }
    .group_15 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      position: relative;
      padding: 24px 0 0;
      min-width: 50px;
      min-height: 50px;
      flex-shrink: 0;
    }
    .buttons {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      align-content: flex-start;
      gap: 16px;
      position: relative;
    }
    .group_16 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 2px;
      position: relative;
      min-width: 50px;
      min-height: 50px;
    }
    .group_17 {
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 2px;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
    }
    .group_18 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 2px;
      position: relative;
      min-width: 50px;
      flex-shrink: 0;
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
    .content {
      height: max-content;
      min-width: min-content;
    }
    .text {
      color: hsla(var(--ig-gray-700));
      height: max-content;
      min-width: min-content;
    }
    .text_1 {
      color: hsla(var(--ig-primary-500));
      height: max-content;
      min-width: min-content;
    }
    .avatar::part(base) {
      color: hsla(var(--ig-primary-500));
      background-color: rgba(27, 95, 158, 0.2);
    }
    .hyperlink {
      color: hsla(var(--ig-primary-500));
      height: max-content;
      min-width: min-content;
      flex-shrink: 0;
    }
    .text_2 {
      height: max-content;
      min-width: 140px;
    }
    .hyperlink_1 {
      color: hsla(var(--ig-info-500));
      height: max-content;
      min-width: min-content;
    }
    .text_3 {
      color: hsla(var(--ig-gray-600));
      height: max-content;
      min-width: min-content;
    }
    .image_1 {
      object-fit: cover;
      min-width: 0;
      min-height: 0;
      max-width: 160px;
      flex-shrink: 0;
    }
    .text_4 {
      text-align: center;
      color: hsla(var(--ig-gray-500));
      height: max-content;
      min-width: min-content;
      max-width: 320px;
    }
    .text_5 {
      color: hsla(var(--ig-gray-800));
      height: max-content;
      min-width: min-content;
    }
    .chip {
      width: max-content;
      height: max-content;
    }
    .avatar_1::part(base) {
      background-color: rgba(71, 124, 41, 0.2);
    }
    .avatar_2::part(base) {
      color: hsla(var(--ig-gray-500));
    }
    .avatar_3::part(base) {
      color: hsla(var(--ig-gray-500));
    }
    .avatar_4::part(base) {
      background-color: transparent;
    }
    .avatar_5::part(base) {
      background-color: transparent;
    }
    .avatar_6::part(base) {
      background-color: transparent;
    }
    .tab-item-content {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      padding: 24px 0 0;
      height: 100%;
      min-width: 100%;
      min-height: 50px;
      max-height: 100%;
    }
    .tab-item-content_1 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      padding: 24px 0 0;
      height: 100%;
      min-width: 100%;
      min-height: 50px;
      max-height: 100%;
    }
    .tab-item-content_2 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      gap: 24px;
      height: 100%;
      min-width: 100%;
      min-height: 50px;
      max-height: 100%;
    }
    .tab-item-content_3 {
      justify-content: flex-start;
      align-items: stretch;
      align-content: flex-start;
      overflow: auto;
      padding: 24px 0 0;
      height: 100%;
      min-width: 100%;
      min-height: 50px;
      max-height: 100%;
    }
    .button {
      height: max-content;
      flex-shrink: 0;
    }
    .checkbox {
      width: max-content;
      height: max-content;
    }
    .button::part(base) {
      color: hsla(var(--ig-primary-500));
      background-color: hsla(var(--ig-secondary-100));
    }
    .list {
      height: max-content;
    }
  `;

  render() {
    return html`
      <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'>
      <link rel='stylesheet' href='../../ig-theme.css'>
      <div class="column-layout group">
        <div class="row-layout account-header">
          <div class="row-layout page-title">
            <div class="row-layout group_1">
              <img src="/src/assets/Accounts Icon - Green.svg" .attr class="image" />
            </div>
            <div class="column-layout group_2">
              <h6 class="content">
                Around the Horn
              </h6>
              <p class="typography__body-2 text">
                Brewing Company
              </p>
            </div>
          </div>
          <div class="row-layout group_3">
            <div class="column-layout group_4">
              <p class="typography__subtitle-2 content">
                Primary Contact
              </p>
              <p class="typography__caption text">
                Thomas Hardy
              </p>
              <p class="typography__caption text">
                Sales Representative
              </p>
            </div>
            <div class="column-layout group_4">
              <p class="typography__subtitle-2 content">
                Phone
              </p>
              <p class="typography__caption text">
                (123) 456-7890
              </p>
            </div>
            <div class="column-layout group_4">
              <p class="typography__subtitle-2 content">
                Billing Address
              </p>
              <p class="typography__caption text">
                120 Hanover Sq.
              </p>
              <div class="column-layout group_5">
                <p class="typography__caption text">
                  London,  WA1 1DP
                </p>
                <p class="typography__caption text">
                  UK
                </p>
              </div>
            </div>
            <div class="column-layout group_4">
              <p class="typography__subtitle-2 content">
                Website
              </p>
              <p class="typography__caption text_1">
                www.aroundthehorn.com
              </p>
            </div>
            <div class="column-layout group_6">
              <p class="typography__subtitle-2 content">
                Account Owner
              </p>
              <p class="typography__caption text">
                Sandy Anderson
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="row-layout group_7">
        <div class="column-layout group_8">
          <igc-tabs class="tabs">
            <igc-tab-panel class="column-layout tab-item-content">
              <div class="row-layout buttons-1">
                <igc-button variant="flat" size="large" class="button">
                  <span class="material-icons">
                    person_add
                  </span>
                  <span>Contact</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-button variant="flat" size="large" class="button">
                  <span class="material-icons">
                    star_border
                  </span>
                  <span>New Opportunity</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-button variant="flat" size="large" class="button">
                  <span class="material-icons">
                    error_outline
                  </span>
                  <span>New Case</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-button variant="flat" size="large" class="button">
                  <span class="material-icons">
                    note_add
                  </span>
                  <span>Add note</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
                <igc-button variant="flat" size="large" class="button">
                  <span class="material-icons">
                    file_copy
                  </span>
                  <span>Add files</span>
                  <igc-ripple></igc-ripple>
                </igc-button>
              </div>
              <igc-accordion ?single-expand="${true}" class="accordion">
                <igc-expansion-panel indicator-position="end">
                  <div class="column-layout group_9">
                    <div class="row-layout group_10">
                      <igc-avatar initials="JL" shape="circle" class="avatar"></igc-avatar>
                      <a class="typography__body-2 hyperlink">
                        Janine Labrune
                      </a>
                    </div>
                    <div class="column-layout group_11">
                      <div class="row-layout group_12">
                        <p class="typography__subtitle-2 text_2">
                          Account Name:
                        </p>
                        <p class="typography__body-2 text">
                          Thomas Hardy
                        </p>
                      </div>
                      <div class="row-layout group_12">
                        <p class="typography__subtitle-2 text_2">
                          Title:
                        </p>
                        <p class="typography__body-2 text">
                          Owner
                        </p>
                      </div>
                      <div class="row-layout group_13">
                        <p class="typography__subtitle-2 text_2">
                          Direct:
                        </p>
                        <igc-checkbox class="checkbox"></igc-checkbox>
                      </div>
                    </div>
                  </div>
                  <span slot="title">Related Contacts (1)</span>
                </igc-expansion-panel>
                <igc-expansion-panel indicator-position="end">
                  <div class="column-layout group_9">
                    <div class="row-layout group_10">
                      <igc-avatar src="/src/assets/Account-List-Avatar-Icon.svg" shape="rounded" class="avatar_1"></igc-avatar>
                      <a class="typography__body-2 hyperlink">
                        Around The Horn
                      </a>
                    </div>
                    <div class="column-layout group_11">
                      <div class="row-layout group_12">
                        <p class="typography__subtitle-2 text_2">
                          Stage:
                        </p>
                        <p class="typography__body-2 text">
                          Qualification
                        </p>
                      </div>
                      <div class="row-layout group_12">
                        <p class="typography__subtitle-2 text_2">
                          Amount:
                        </p>
                        <p class="typography__body-2 text">
                          Owner
                        </p>
                      </div>
                      <div class="row-layout group_12">
                        <p class="typography__subtitle-2 text_2">
                          Close Date:
                        </p>
                        <p class="typography__body-2 text">
                          9/12/2022
                        </p>
                      </div>
                    </div>
                  </div>
                  <span slot="title">Opportunities (1)</span>
                </igc-expansion-panel>
                <igc-expansion-panel indicator-position="end">
                  <igc-list class="list">
                    <igc-list-item>
                      <igc-avatar slot="start" shape="circle" class="avatar_2">
                        <span class="material-icons">
                          insert_drive_file
                        </span>
                      </igc-avatar>
                      <div>
                        <a class="typography__body-2 hyperlink_1">
                          Around-The-Horn-Contract-2022.docx
                        </a>
                      </div>
                    </igc-list-item>
                    <igc-list-item>
                      <igc-avatar slot="start" shape="circle" class="avatar_3">
                        <span class="material-icons">
                          insert_drive_file
                        </span>
                      </igc-avatar>
                      <div>
                        <a class="typography__body-2 hyperlink_1">
                          Around-The-Horn-Contract-2021.docx
                        </a>
                      </div>
                    </igc-list-item>
                  </igc-list>
                  <span slot="title">Contracts (2)</span>
                </igc-expansion-panel>
                <igc-expansion-panel indicator-position="end">
                  <p class="typography__body-2 text_3">
                    No cases filed.
                  </p>
                  <span slot="title">Cases (0)</span>
                </igc-expansion-panel>
                <igc-expansion-panel indicator-position="end">
                  <p class="typography__body-2 text_3">
                    No notes added.
                  </p>
                  <span slot="title">Notes (0)</span>
                </igc-expansion-panel>
                <igc-expansion-panel indicator-position="end">
                  <p class="typography__body-2 text_3">
                    No files uploaded
                  </p>
                  <span slot="title">Files (0)</span>
                </igc-expansion-panel>
              </igc-accordion>
            </igc-tab-panel>
            <igc-tab ?selected="${true}">
              <span class="material-icons">
                info
              </span>
              <span>Related</span>
            </igc-tab>
            <igc-tab-panel class="row-layout tab-item-content_1">
              <div class="row-layout demo-content">
                <img src="/src/assets/start-building-dark.svg" .attr class="image_1" />
                <p class="typography__body-2 text_4">
                  Remove the "demo-content" container, and add your own content.
                </p>
              </div>
            </igc-tab-panel>
            <igc-tab ?disabled="${true}">
              <span class="material-icons">
                info
              </span>
              <span>Details</span>
            </igc-tab>
            <igc-tab-panel class="row-layout tab-item-content_1">
              <div class="row-layout demo-content-1">
                <img src="/src/assets/start-building-dark.svg" .attr class="image_1" />
                <p class="typography__body-2 text_4">
                  Remove the "demo-content" container, and add your own content.
                </p>
              </div>
            </igc-tab-panel>
            <igc-tab ?disabled="${true}">
              <span class="material-icons">
                info
              </span>
              <span>News</span>
            </igc-tab>
          </igc-tabs>
        </div>
        <div class="column-layout group_14">
          <igc-tabs class="tabs">
            <igc-tab-panel class="column-layout tab-item-content_2">
              <div class="column-layout group_15">
                <div class="row-layout buttons">
                  <igc-button variant="flat" size="large" class="button">
                    <span class="material-icons">
                      calendar_today
                    </span>
                    <span>New Meeting</span>
                    <igc-ripple></igc-ripple>
                  </igc-button>
                  <igc-button variant="flat" size="large" class="button">
                    <span class="material-icons">
                      assignment
                    </span>
                    <span>New task</span>
                    <igc-ripple></igc-ripple>
                  </igc-button>
                  <igc-button variant="flat" size="large" class="button">
                    <span class="material-icons">
                      call
                    </span>
                    <span>Log a call</span>
                    <igc-ripple></igc-ripple>
                  </igc-button>
                </div>
                <igc-accordion ?single-expand="${true}" class="accordion">
                  <igc-expansion-panel indicator-position="end">
                    <igc-list class="list">
                      <igc-list-item>
                        <igc-avatar src="/src/assets/Calendar-Avatar-Icon.svg" slot="start" class="avatar_4"></igc-avatar>
                        <div>
                          <div class="column-layout group_16">
                            <div class="row-layout group_17">
                              <p class="typography__subtitle-2 text_5">
                                Project Intro
                              </p>
                            </div>
                            <div class="row-layout group_18">
                              <p class="typography__caption text_3">
                                11/1/2022
                              </p>
                              <p class="typography__caption text_3">
                                -
                              </p>
                              <p class="typography__caption text_3">
                                10am
                              </p>
                            </div>
                            <igc-chip size="large" class="chip">
                              Zoom Meeting
                            </igc-chip>
                          </div>
                        </div>
                      </igc-list-item>
                      <igc-list-item>
                        <igc-avatar src="/src/assets/Calendar-Avatar-Icon.svg" slot="start" class="avatar_5"></igc-avatar>
                        <div>
                          <div class="column-layout group_16">
                            <div class="row-layout group_17">
                              <p class="typography__subtitle-2 text_5">
                                Sync Meeting
                              </p>
                            </div>
                            <div class="row-layout group_18">
                              <p class="typography__caption text_3">
                                11/7/2022
                              </p>
                              <p class="typography__caption text_3">
                                -
                              </p>
                              <p class="typography__caption text_3">
                                2pm
                              </p>
                            </div>
                            <igc-chip size="large" class="chip">
                              On Site Meeting
                            </igc-chip>
                          </div>
                        </div>
                      </igc-list-item>
                      <igc-list-item>
                        <igc-avatar src="/src/assets/Calendar-Avatar-Icon.svg" slot="start" class="avatar_6"></igc-avatar>
                        <div>
                          <div class="column-layout group_16">
                            <div class="row-layout group_17">
                              <p class="typography__subtitle-2 text_5">
                                Wrap Up Meeting
                              </p>
                            </div>
                            <div class="row-layout group_18">
                              <p class="typography__caption text_3">
                                11/14/2022
                              </p>
                              <p class="typography__caption text_3">
                                -
                              </p>
                              <p class="typography__caption text_3">
                                4pm
                              </p>
                            </div>
                            <igc-chip size="large" class="chip">
                              Phone call
                            </igc-chip>
                          </div>
                        </div>
                      </igc-list-item>
                    </igc-list>
                    <span slot="title">Upcoming Events (3)</span>
                  </igc-expansion-panel>
                  <igc-expansion-panel indicator-position="end">
                    <p class="typography__body-2 text_3">
                      No tasks added.
                    </p>
                    <span slot="title">Tasks (0)</span>
                  </igc-expansion-panel>
                  <igc-expansion-panel indicator-position="end">
                    <p class="typography__body-2 text_3">
                      No call logged.
                    </p>
                    <span slot="title">Call Logs (0)</span>
                  </igc-expansion-panel>
                </igc-accordion>
              </div>
            </igc-tab-panel>
            <igc-tab ?selected="${true}">
              <span class="material-icons">
                info
              </span>
              <span>Activity</span>
            </igc-tab>
            <igc-tab-panel class="row-layout tab-item-content_3">
              <div class="column-layout demo-content-1">
                <img src="/src/assets/start-building-dark.svg" .attr class="image_1" />
                <p class="typography__body-2 text_4">
                  Remove the "demo-content" container, and add your own content.
                </p>
              </div>
            </igc-tab-panel>
            <igc-tab ?disabled="${true}">
              <span class="material-icons">
                info
              </span>
              <span>Conversations</span>
            </igc-tab>
          </igc-tabs>
        </div>
      </div>
    `;
  }
}
