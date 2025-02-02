module Flaggable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do

    searchable do
      boolean :flagged do
        self.flagged?
      end
    end

    has_many :flags, as: :record

    def add_flag(message, date, user_name)
      date_flag = date.presence || Date.today
      flag = Flag.new(flagged_by: user_name, message: message, date: date_flag, created_at: DateTime.now)
      self.flags << flag
      flag
    end

    def remove_flag(id, user_name, unflag_message)
      flag = self.flags.find(id)
      if flag.present?
        flag.unflag_message = unflag_message
        flag.unflagged_date = Date.today
        flag.unflagged_by = user_name
        flag.removed = true
        flag.save!
      end
      flag
    end

    def flag_count
      flags.where(removed: false).count
    end

    def flagged?
      flag_count.positive?
    end
    alias_method :flagged, :flagged?

    def self.batch_flag(records, message, date, user_name)
      ActiveRecord::Base.transaction do
        records.each do |record|
          record.add_flag(message, date, user_name)
        end
      end
    end

  end
end
