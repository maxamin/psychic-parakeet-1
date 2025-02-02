require 'yaml'
require 'csv'

# MIGRATION STATUS: Done!
raise 'Migration already performed.' # Don't run this. Kept for posterity

def order_of_keys
  %w(
    CVE
    yaml_instructions
    curated_instructions
    curated
    reported_instructions
    reported_date
    announced_instructions
    announced_date
    published_instructions
    published_date
    description_instructions
    description
    bounty_instructions
    bounty
    reviews
    bugs
    repo
    fixes_vcc_instructions
    fixes
    vccs
    upvotes_instructions
    upvotes
    unit_tested
    discovered
    autodiscoverable
    specification
    subsystem
    interesting_commits
    i18n
    ipc
    lessons
    mistakes
    CWE_instructions
    CWE
    CWE_note
    nickname_instructions
    nickname
  )
end



Dir['cves/*.yml'].each do |yml_file|
    h = YAML.load(File.open(yml_file, 'r').read)

    h['subsystem']['question'] = <<~EOS
What subsystems was the mistake in?

Most systems don't have a formal list of their subsystems, but you can
usually infer them from path names, bug report tags, or other key words
used. A single source file is not what we mean by a subsystem. In Django,
the "Component" field on the bug report is useful. But there may be other
subsystems involved.

Your subsystem name(s) should not have any dots or slashes in them. Only
alphanumerics, whitespace, _, - and @.Feel free to add multiple using a YAML
array.

In the answer field, explain where you saw these words.
In the name field, a subsystem name (or an array of names)

e.g. clipboard, model, view, controller, mod_dav, ui, authentication
    EOS

    # Also do discoverable --> autodiscoverable
    h['autodiscoverable'] = h['discoverable']


    # remove sandbox question
    h.delete('sandbox')

    # Reconstruct the hash in the order we specify
    out_h = {}
    order_of_keys.each do |key|
      out_h[key] = h[key]
    end

    # Generate the new YML, clean it up, write it out.
    File.open(yml_file, "w+") do |file|
      yml_txt = out_h.to_yaml[4..-1] # strip off ---\n
      stripped_yml = ""
      yml_txt.each_line do |line|
        stripped_yml += "#{line.rstrip}\n" # strip trailing whitespace
      end
      file.write(stripped_yml)
      print '.'
    end
end
puts 'Done!'
