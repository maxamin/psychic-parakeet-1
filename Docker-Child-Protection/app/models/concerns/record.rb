# frozen_string_literal: true

# A shared concern for all core Primero record types: Cases (child), Incidents, Tracing Requests
module Record
  extend ActiveSupport::Concern

  STATUS_OPEN = 'open'
  STATUS_CLOSED = 'closed'
  STATUS_TRANSFERRED = 'transferred'

  included do
    store_accessor :data, :unique_identifier, :short_id, :record_state, :status, :marked_for_mobile

    after_initialize :defaults, unless: :persisted?
    before_create :create_identification
    before_save :populate_subform_ids
    after_save :index_nested_reportables
    after_destroy :unindex_nested_reportables
  end

  def self.model_from_name(name)
    case name
    when 'case' then Child
    when 'violation' then Incident
    else Object.const_get(name.camelize)
    end
  rescue NameError
    nil
  end

  def self.map_name(name)
    name = name.underscore
    name = 'case' if name == 'child'
    name
  end

  module ClassMethods
    def new_with_user(user, data = {})
      id = data.delete('id')
      record = new
      record.id = id if id.present?
      record.data = Utils.merge_data(record.data, data)
      record.creation_fields_for(user)
      record.set_owner_fields_for(user)
      record
    end

    def common_summary_fields
      %w[created_at owned_by owned_by_agency_id photos
         flag_count status record_in_scope short_id alert_count]
    end

    # TODO: This method is currently unused, but should eventually replace the mess in the record actions controller
    def find_or_initialize(unique_identifier)
      record = find_by_unique_identifier(unique_identifier)
      if record.nil?
        record = self.new
      end
      record
    end

    def find_by_unique_identifier(unique_identifier)
      find_by('data @> ?', { unique_identifier: unique_identifier }.to_json)
    end

    def generate_unique_id
      SecureRandom.uuid
    end

    def parent_form
      name.underscore.downcase
    end

    def preview_field_names
      Field.joins(:form_section).where(
        form_sections: { parent_form: parent_form },
        show_on_minify_form: true
      ).pluck(:name)
    end

    # TODO: Refactor with UIUX
    def model_name_for_messages
      name.titleize.downcase
    end

    # TODO: Refactor with UIUX
    def locale_prefix
      name.underscore.downcase
    end

    def nested_reportable_types
      []
    end
  end


  # Override this in the implementing classes to set your own defaults
  def defaults
    self.record_state = true if record_state.nil?
    self.status ||= STATUS_OPEN
  end

  def create_identification
    self.unique_identifier ||= self.class.generate_unique_id
    self.short_id ||= self.unique_identifier.to_s.last(7)
    set_instance_id
  end

  def display_field(field_or_name, lookups = nil)
    result = ''
    if field_or_name.present?
      if field_or_name.is_a?(Field)
        result = field_or_name.display_text(data[field_or_name.name], lookups)
      else
        field = Field.get_by_name(field_or_name)
        if field.present?
          result = field.display_text(data[field_or_name], lookups)
        end
      end
    end
    result
  end

  def display_id
    short_id
  end

  # TODO: Refactor or delete with UIUX. This looks like its only useful for setting and getting via the form
  # TODO: This is used in configurable exporters. Rename to something meaningful if useful
  # # @param attr_keys: An array whose elements are properties and array indeces
  #   # Ex: `child.value_for_attr_keys(['family_details_section', 0, 'relation_name'])`
  #   # is equivalent to doing `child.family_details_section[0].relation_name`
  def value_for_attr_keys(attr_keys)
    attr_keys.inject(self.data) do |acc, attr|
      if acc.blank?
        nil
      else
        acc[attr]
      end
    end
  end

  # TODO: Refactor or delete with UIUX. This looks like its only useful for setting and getting via the form
  def set_value_for_attr_keys(attr_keys, value)
    parent = value_for_attr_keys(attr_keys[0..-2])
    parent[attr_keys[-1]] = value
  end

  def update_properties(data, user_name)
    self.data = Utils.merge_data(self.data, data)
    self.last_updated_by = user_name
  end

  def nested_reportables_hash
    # TODO: Consider returning this as a straight list
    self.class.nested_reportable_types.reduce({}) do |hash, type|
      if self.try(type.record_field_name).present?
        hash[type] = type.from_record(self)
      end
      hash
    end
  end

  def populate_subform_ids
    return unless data.present?

    data.each do |_, value|
      next unless value.is_a?(Array) && value.first.is_a?(Hash)

      value.each do |subform|
        subform['unique_id'].present? ||
          (subform['unique_id'] = SecureRandom.uuid)
      end
    end
  end

  def index_nested_reportables
    nested_reportables_hash.each do |_, reportables|
      Sunspot.index! reportables if reportables.present?
    end
  end

  def unindex_nested_reportables
    nested_reportables_hash.each do |_, reportables|
      Sunspot.remove! reportables if reportables.present?
    end
  end

  class Utils
    def self.merge_data(old_data, new_data)
      if old_data.is_a?(Hash) && new_data.is_a?(Hash)
        old_data.merge(new_data) do |_, old_value, new_value|
          merge_data(old_value, new_value)
        end
      elsif is_an_array_of_hashes?(old_data) && is_an_array_of_hashes?(new_data)
        merged_old_data = old_data.inject([]) do |result, old_nested_record|
          nested_record_id = old_nested_record['unique_id']
          if nested_record_id.present?
            new_nested_record = new_data.find{|r| r['unique_id'] == nested_record_id}
            if new_nested_record
              result << merge_data(old_nested_record, new_nested_record)
            else
              result << old_nested_record
            end
          else
            result << old_nested_record
          end
          result
        end
        append = new_data.reject{|new_record| merged_old_data.find{|r| r['unique_id'] == new_record['unique_id']}}
        (merged_old_data + append).reject{|record| record['_destroy']}
      else
        new_data
      end
    end

    def self.is_an_array_of_hashes?(value)
      value.is_a?(Array) && (value.blank? || value.first.is_a?(Hash))
    end
  end
end
