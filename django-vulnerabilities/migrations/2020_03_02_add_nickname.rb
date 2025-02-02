require 'yaml'

# MIGRATION STATUS: Done. No longer need to run this. Kept for posterity
raise 'Migration already performed.'

Dir['cves/*.yml'].each do |yml_file|

    h = YAML.load(File.open(yml_file, 'r').read)
    h['nickname'] = nil
    h['nickname_instructions'] = <<~EOS
      A catchy name for this vulnerability that would draw attention it. If the
      report mentions a nickname, use that. Must be under 30 characters.
      Optional.
    EOS
    File.open(yml_file, "w+") do |file|
      yml_txt = h.to_yaml[4..-1] # strip off ---\n
      stripped_yml = ""
      yml_txt.each_line do |line|
        stripped_yml += "#{line.rstrip}\n" # strip trailing whitespace
      end
      file.write(stripped_yml)
    end
end
