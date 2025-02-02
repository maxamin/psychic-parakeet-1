fields = [
  Field.new({"name" => "record_state",
        "type" => "tick_box",
        "selected_value" => true,
        "editable" => false,
        "disabled" => true,
        "display_name_en" => "Valid Record?"
        }),
  Field.new({"name" => "number_of_individual_perpetrators_from_ir",
        "type" => "numeric_field",
        "editable" => false,
        "disabled" => true,
        "display_name_en" => "Number of individual perpetrators imported from IR"
        }),
]

FormSection.create_or_update_form_section({
  :unique_id=>"other_reportable_fields_incident",
  :parent_form=>"incident",
  "visible" => false,
  :order => 1000,
  :order_form_group => 1000,
  :form_group_id => 'other_reportable_fields',
  "editable" => true,
  :fields => fields,
  "name_en" => "Other Reportable Fields",
  "description_en" => "Other Reportable Fields"
})