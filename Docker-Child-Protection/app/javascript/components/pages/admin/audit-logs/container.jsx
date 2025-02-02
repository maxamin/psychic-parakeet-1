import React, { useEffect } from "react";
import { batch, useDispatch, useSelector } from "react-redux";
import { Button, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { Link } from "react-router-dom";
import { fromJS } from "immutable";
import { format, parseISO } from "date-fns";

import { useI18n } from "../../../i18n";
import { DATE_TIME_FORMAT, ROUTES } from "../../../../config";
import { RESOURCES, SHOW_AUDIT_LOGS } from "../../../../libs/permissions";
import { PageContent, PageHeading } from "../../../page";
import IndexTable from "../../../index-table";
import Permission from "../../../application/permission";
import { Filters as AdminFilters } from "../components";

import { AUDIT_LOG, NAME, TIMESTAMP, USER_NAME } from "./constants";
import {
  fetchAuditLogs,
  fetchPerformedBy,
  setAuditLogsFilters
} from "./action-creators";
import { getFilterUsers } from "./selectors";
import { buildAuditLogsQuery, getFilters } from "./utils";

const Container = () => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const filterUsers = useSelector(state => getFilterUsers(state));

  useEffect(() => {
    dispatch(fetchPerformedBy({ options: { per: 999 } }));
  }, []);

  const newUserGroupBtn = (
    <Button
      to={ROUTES.lookups}
      component={Link}
      color="primary"
      startIcon={<AddIcon />}
    >
      {i18n.t("buttons.new")}
    </Button>
  );

  const filterProps = {
    clearFields: [USER_NAME, TIMESTAMP],
    filters: getFilters(filterUsers),
    onSubmit: data => {
      const filters = buildAuditLogsQuery(data);
      let queryParams = {};

      if (TIMESTAMP in data) {
        queryParams = data[TIMESTAMP];

        delete filters.timestamp;
      }

      batch(() => {
        dispatch(setAuditLogsFilters(filters));
        dispatch(fetchAuditLogs({ data: { ...filters, ...queryParams } }));
      });
    }
  };

  const tableOptions = {
    columns: [
      {
        label: i18n.t("audit_log.timestamp"),
        name: "timestamp",
        options: {
          customBodyRender: value => format(parseISO(value), DATE_TIME_FORMAT)
        }
      },
      {
        label: i18n.t("audit_log.user_name"),
        name: "user_name"
      },
      {
        label: i18n.t("audit_log.action"),
        name: "action"
      },
      {
        label: i18n.t("audit_log.description"),
        name: "log_message"
      },
      {
        label: i18n.t("audit_log.record_owner"),
        name: "user_name"
      }
    ],
    defaultFilters: fromJS({
      per: 100,
      page: 1
    }),
    onTableChange: fetchAuditLogs,
    options: {
      selectableRows: "none",
      onCellClick: false
    },
    recordType: ["admin", AUDIT_LOG],
    bypassInitialFetch: true
  };

  return (
    <Permission
      resources={RESOURCES.audit_logs}
      actions={SHOW_AUDIT_LOGS}
      redirect
    >
      <PageHeading title={i18n.t("settings.navigation.audit_logs")}>
        {newUserGroupBtn}
      </PageHeading>
      <PageContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={9}>
            <IndexTable {...tableOptions} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <AdminFilters {...filterProps} />
          </Grid>
        </Grid>
      </PageContent>
    </Permission>
  );
};

Container.displayName = NAME;

export default Container;
