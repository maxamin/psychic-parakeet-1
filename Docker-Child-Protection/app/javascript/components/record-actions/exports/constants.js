import { ACTIONS } from "../../../libs/permissions";

export const EXPORT_FORMAT = Object.freeze({
  JSON: "json",
  CSV: "csv",
  EXCEL: "xls",
  PDF: "pdf"
});

export const NAME = "Exports";
export const ALL_EXPORT_TYPES = Object.freeze([
  Object.freeze({
    id: "csv",
    permission: ACTIONS.EXPORT_CSV,
    format: EXPORT_FORMAT.CSV
  }),
  Object.freeze({
    id: "xls",
    permission: ACTIONS.EXPORT_EXCEL,
    format: EXPORT_FORMAT.EXCEL
  }),
  Object.freeze({
    id: "json",
    permission: ACTIONS.EXPORT_JSON,
    format: EXPORT_FORMAT.JSON
  }),
  Object.freeze({
    id: "photowall",
    permission: ACTIONS.EXPORT_PHOTO_WALL,
    format: EXPORT_FORMAT.PDF,
    message: "exports.photowall.success_message"
  }),
  Object.freeze({
    id: "unhcr_csv",
    permission: ACTIONS.EXPORT_UNHCR,
    format: EXPORT_FORMAT.CSV
  }),
  Object.freeze({
    id: "list_view_csv",
    permission: ACTIONS.EXPORT_LIST_VIEW,
    format: EXPORT_FORMAT.CSV,
    showOnlyOnList: true
  }),
  Object.freeze({
    id: "duplicate_id_csv",
    permission: ACTIONS.EXPORT_DUPLICATE_ID,
    format: EXPORT_FORMAT.CSV,
    showOnlyOnList: true
  })
]);
