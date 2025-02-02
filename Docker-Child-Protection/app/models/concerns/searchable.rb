module Searchable
  extend ActiveSupport::Concern

  ALL_FILTER = 'all'

  included do
    include Indexable

    # Note that the class will need to be reloaded when the fields change. The current approach is to gently bounce Puma.
    searchable do
      string :record_id do |f|
        f.id
      end

      searchable_string_fields.each do |f|
        string(f, {as: "#{f}_sci".to_sym}) { self.data[f] }
      end

      searchable_multi_fields.each do |f|
        string(f, {multiple: true}) { self.data[f] }
      end

      searchable_date_fields.each do |f|
        date(f) { self.data[f] }
      end
      searchable_date_time_fields.each do |f|
        time(f) { self.data[f] }
      end
      if search_numeric_fields?
        searchable_numeric_fields.each do |f|
          integer(f) { self.data[f] }
        end
      end
      searchable_boolean_fields.each do |f|
        boolean(f) { self.data[f] }
      end
      # if self.include?(SyncableMobile) #TODO: refactor with SyncableMobile; recast as store_accessors?
      #   boolean :marked_for_mobile do
      #     self.data['marked_for_mobiles']
      #   end
      # end

      #TODO - This is likely deprecated and needs to be refactored away
      #TODO - searchable_location_fields currently used by filtering
      searchable_location_fields.each do |f|
        text(f, as: "#{f}_lngram".to_sym) do
          self.data[f]
        end
      end

      all_searchable_location_fields.each do |field|
        Location::ADMIN_LEVELS.each do |admin_level|
          string "#{field}#{admin_level}", as: "#{field}#{admin_level}_sci".to_sym do
            Location.value_for_index(self.data[field], admin_level)
          end
        end
      end
    end
  end

  module ClassMethods
    #TODO: Refactor API: This logic has moved to a service. Delete this.
    #Pull back all records from CouchDB that pass the filter criteria.
    #Searching, filtering, sorting, and pagination is handled by Solr.
    # TODO: Exclude duplicates I presume?
    # TODO: Also need integration/unit test for filters.
    def list_records(filters={}, sort={:created_at => :desc}, pagination_parms={}, associated_user_names=[], query=nil, match=nil, owned_by_groups=[])
      self.search do
        if filters.present?
          build_filters(self, filters)
        end

        if filter_associated_users?(match, associated_user_names) || filter_owned_by_groups?(match, owned_by_groups)
          any_of do
            if filter_owned_by_groups?(match, owned_by_groups)
              owned_by_groups.each do |group|
                with(:owned_by_groups, group)
              end
            end
            if filter_associated_users?(match, associated_user_names)
              associated_user_names.each do |user_name|
                with(:associated_user_names, user_name)
              end
            end
          end
        end
        if query.present?
          fulltext(query.strip) do
            #In schema.xml defaultOperator is "AND"
            #the following change that behavior to match on
            #any of the search terms instead all of them.
            minimum_match(1)
            fields(*self.quicksearch_fields)
          end
        end

        sort={:average_rating => :desc} if match.present?
        sort.each {|sort_field, order| order_by(sort_field, order)}
        paginate pagination(pagination_parms)
      end
    end

    #This method controls filtering logic
    def build_filters(sunspot, filters={})
      sunspot.instance_eval do
        #TODO: pop off the locations filter and perform a fulltext search
        filters.each do |filter,filter_value|
          if searchable_location_fields.include? filter
            #TODO: Putting this code back in, but we need a better system for filtering locations in the future
            if filter_value[:type] == 'location_list'
              with(filter.to_sym, filter_value[:value])
            else
              fulltext("\"#{filter_value[:value]}\"", fields: filter)
            end
          else
            values = filter_value[:value]
            type = filter_value[:type]
            any_of do
              case type
              when 'range'
                values.each do |filter_value|
                  if filter_value.count == 1
                    # Range +
                    with(filter).greater_than_or_equal_to(filter_value.first.to_i)
                  else
                    range_start, range_stop = filter_value.first.to_i, filter_value.last.to_i
                    with(filter, range_start...range_stop)
                  end
                end
              when 'date_range'
                if values.count > 1
                  to, from = values.first, values.last
                  with(filter).between(to..from)
                else
                  with(filter, values.first)
                end
              when 'list'
                with(filter).any_of(values)
              when 'neg'
                without(filter, values)
              when 'or_op'
                any_of do
                  values.each do |k, v|
                    with(k, v)
                  end
                end
              else
                with(filter, values) unless values == 'all'
              end
            end
          end
        end
      end
    end

    def searchable_date_fields
      Field.all_searchable_date_field_names(self.parent_form)
    end

    def searchable_date_time_fields
      Field.all_searchable_date_time_field_names(self.parent_form)
    end

    def searchable_boolean_fields
      (['duplicate', 'flag', 'has_photo', 'record_state', 'case_status_reopened'] +
      Field.all_searchable_boolean_field_names(self.parent_form)).uniq
    end

    def searchable_string_fields
      %w(unique_identifier short_id created_by created_by_full_name
         last_updated_by last_updated_by_full_name created_organization
         owned_by_agency_id owned_by_location) +
      Field.all_filterable_field_names(self.parent_form)
    end

    def searchable_multi_fields
      Field.all_filterable_multi_field_names(self.parent_form)
    end

    def searchable_numeric_fields
      Field.all_filterable_numeric_field_names(self.parent_form)
    end

    #TODO - This is likely deprecated and needs to be refactored away
    #TODO - searchable_location_fields currently used by filtering
    def searchable_location_fields
      ['location_current', 'incident_location']
    end

    def all_searchable_location_fields
      %w[owned_by_location] + Field.all_location_field_names(parent_form)
    end

    def pagination(pagination_parms={})
      #This is to allow pagination to be overriden in the parent class
      pagination_parms
    end

    def filter_associated_users?(match=nil, associated_user_names=nil)
      match.blank? && associated_user_names.present? && associated_user_names.first != ALL_FILTER
    end

    def filter_owned_by_groups?(match=nil, owned_by_groups=nil)
      match.blank? && owned_by_groups.present? && owned_by_groups.first != ALL_FILTER
    end

    def search_numeric_fields?
      true
    end

  end
end
