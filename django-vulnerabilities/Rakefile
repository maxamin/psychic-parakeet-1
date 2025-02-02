require 'rspec/core/rake_task'
require 'yaml'
require 'csv'
require_relative 'scripts/new_django_cves'

desc 'Run the specs by default'
task default: :spec

RSpec::Core::RakeTask.new(:spec)

task :new_cves do
  NewDjangoCVEs.new('tmp/src/docs/releases/security.txt').run
end
