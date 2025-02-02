require 'yaml'

class NewDjangoCVEs

  def initialize(security_txt)
    @security_txt = security_txt
  end

  def run
    File.open(@security_txt) do |f| # rst_cve means "reStructured Text"
      cves = f.read.scan(/:cve:`[\d\-]*`/).each do |rst_cve|
        cve = cve_from_rst(rst_cve)
        puts "#{cve} ..... #{yml_exists?(cve)}"
        unless yml_exists?(cve)
          skeleton = YAML.load(File.read('skeletons/cve.yml'))
          skeleton["CVE"] = cve
          File.open("cves/#{cve}.yml", "w+") do |file|
            yml_txt = skeleton.to_yaml[4..-1] # strip off ---\n
            file.write(yml_txt)
          end
        end
      end
    end
  end

  def yml_exists?(cve)
    File.exist? "cves/#{cve}.yml"
  end

  def cve_from_rst(rst_cve)
    cve = rst_cve.match(/:cve:`([\d\-]*)`/).captures[0]
    return "CVE-#{cve}"
  end

end
