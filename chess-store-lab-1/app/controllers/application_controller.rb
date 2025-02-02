class ApplicationController < ActionController::Base
  # ensure people are sandboxed to their environment
  before_filter :sandbox

  include CustomAuth
  protect_from_forgery
  before_filter :do_level
  
  private
  def sandbox
    if !session[:session_secret]
      session[:session_secret] = SecureRandom.hex(12)
      DB::reset(session[:session_id])
    end
    
    return redirect_to "/#{session[:session_secret]}" if !params[:session_secret]
    return render :text => 'Invalid session secret!', :status => 500 if params[:session_secret] != session[:session_secret]
  end
  
  # easy = 1
  # medium = 2
  # difficult = anything else
  def do_level
    level = session[:level] ||= 1
    text = %w(Low Medium)[level-1] || 'High'
    
    # this is probably a security risk in itself :)
    class_eval("include Levels::#{text}")
  end
end