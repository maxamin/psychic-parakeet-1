module ApplicationHelper
  def breadcrumbs(page)
    links = []
    
    unless page.nil?
      links << link_to(page.name, page)
      page.ancestors.reverse.each do |p|
        links << link_to(p.name, p)
      end
    end
    
    content_tag :div, :id => 'breadcrumbs' do
      raw(links.reverse.join(' &gt; '))
    end
  end  
end
