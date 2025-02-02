class User < ActiveRecord::Base
  # relationships
  
  # validations
  validates :session_id, :first_name, :last_name, :username, :password, :presence => true
  validates :password, :confirmation => true
  validates :username, :uniqueness => { :scope => :session_id }
  
  # scopes
  
  # attr
  attr_protected :session_id
  
  # class methods
  
  # instance methods
  def name
    "#{first_name} #{last_name}"
  end
end