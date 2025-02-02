import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { compact } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import qs from "qs";
import { push } from "connected-react-router";

import { enqueueSnackbar } from "../notifier";
import { selectModules } from "../pages/login/login-form/selectors";
import { useI18n } from "../i18n";
import { ROUTES } from "../../config";

import { saveSearch } from "./action-creators";
import { buildFiltersApi, buildFiltersState } from "./utils";

const FormErrors = () => {
  const dispatch = useDispatch();
  const i18n = useI18n();

  useEffect(() => {
    dispatch(enqueueSnackbar(i18n.t("saved_search.no_filters"), "error"));
  }, [dispatch, i18n]);

  return null;
};

const validationSchema = object().shape({
  name: string().required()
});

const SavedSearchesForm = ({ recordType, open, setOpen, getValues }) => {
  const i18n = useI18n();
  const dispatch = useDispatch();
  const [formErrors, setFormErrors] = useState(false);
  const { register, handleSubmit, errors } = useForm({
    validationSchema
  });

  const userModules = useSelector(state => selectModules(state));

  const closeModal = () => {
    setOpen(false);
    setFormErrors(false);
  };

  const onSubmit = data => {
    const filters = buildFiltersApi(Object.entries(getValues()));

    if (filters.length) {
      const body = {
        data: {
          name: data.name,
          record_type: recordType,
          module_ids: userModules.toJS(),
          filters: compact(filters)
        }
      };

      dispatch(saveSearch(body, i18n.t("saved_search.save_success")));
      setFormErrors(false);
      closeModal();

      dispatch(
        push({
          pathname: ROUTES[recordType],
          search: qs.stringify(buildFiltersState(filters))
        })
      );
    } else {
      setFormErrors(true);
    }
  };

  return (
    <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogTitle>{i18n.t("saved_searches.save_search")}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            error={errors?.name?.message}
            placeholder="Name"
            inputRef={register}
            helperText={errors?.name?.message}
            fullWidth
            autoFocus
            required
            autoComplete="off"
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" variant="contained" color="primary">
            {i18n.t("buttons.save")}
          </Button>
          <Button onClick={closeModal} color="primary">
            {i18n.t("buttons.cancel")}
          </Button>
        </DialogActions>
        {formErrors && <FormErrors />}
      </form>
    </Dialog>
  );
};

SavedSearchesForm.displayName = "SavedSearchesForm";

SavedSearchesForm.propTypes = {
  getValues: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  recordType: PropTypes.string.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default SavedSearchesForm;
