import { fromJS } from "immutable";

import { mergeRecord } from "./reducer-helpers";

describe("reducer-helpers", () => {
  describe("mergeRecord", () => {
    it("should merge deep object and update/concat arrays", () => {
      const record = fromJS({
        id: 1,
        first_name: "Josh",
        middle_name: "Fren",
        photos: [
          { id: 1, attachment_url: "url 1" },
          { id: 2, attachment_url: "url 2" }
        ],
        locations: [],
        countries: ["united_states"],
        nationality: ["american"],
        followups: [
          {
            unique_id: 1,
            field: "field-value-1"
          },
          {
            unique_id: 2,
            field2: "field2-value-2",
            nationality: ["french"]
          },
          {
            unique_id: 4,
            field1: "field1-value-4"
          }
        ]
      });

      const payload = fromJS({
        last_name: "James",
        countries: ["united_states", "spain"],
        nationality: ["brazillian", "british"],
        photos: [{ id: 3, attachment_url: "url 3" }],
        followups: [
          {
            unique_id: 2,
            field3: "field3-value-2",
            nationality: ["japanese", "american"]
          },
          {
            unique_id: 3,
            field2: "field2-value-3",
            field3: "field3-value-3"
          },
          {
            unique_id: 4,
            field1: ""
          }
        ]
      });

      const expected = fromJS({
        id: 1,
        first_name: "Josh",
        middle_name: "Fren",
        last_name: "James",
        locations: [],
        countries: ["united_states", "spain"],
        nationality: ["brazillian", "british"],
        photos: [
          { id: 1, attachment_url: "url 1" },
          { id: 2, attachment_url: "url 2" },
          { id: 3, attachment_url: "url 3" }
        ],
        followups: [
          {
            unique_id: 1,
            field: "field-value-1"
          },
          {
            unique_id: 2,
            field2: "field2-value-2",
            field3: "field3-value-2",
            nationality: ["japanese", "american"]
          },
          {
            unique_id: 4,
            field1: ""
          },
          {
            unique_id: 3,
            field2: "field2-value-3",
            field3: "field3-value-3"
          }
        ]
      });

      expect(mergeRecord(record, payload).toJS()).to.deep.equal(
        expected.toJS()
      );
    });
  });
});
