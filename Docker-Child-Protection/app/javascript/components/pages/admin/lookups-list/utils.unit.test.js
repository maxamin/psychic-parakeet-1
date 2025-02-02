import { columns } from "./utils";

describe("<LookupsList /> pages/admin/utils", () => {
  it("should return default columns", () => {
    const i18n = { t: value => value };
    const expected = [
      {
        label: "lookup.name",
        name: "name",
        options: {
          customBodyRender: () => {}
        }
      },
      {
        label: "lookup.values",
        name: "values",
        options: {
          customBodyRender: () => {}
        }
      }
    ];

    const result = columns(i18n);

    expect(JSON.stringify(result)).to.be.deep.equals(JSON.stringify(expected));
  });
});
