package cloudbreaker;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class StaticResourceConfiguration extends WebMvcConfigurerAdapter {

 private static final Logger LOG = LoggerFactory.getLogger(StaticResourceConfiguration.class);

 @Override
 public void addResourceHandlers(ResourceHandlerRegistry registry) {

	 String staticPath = "src/public/";
    if(staticPath != null) {
        LOG.info("Serving static content from " + staticPath);
        registry.addResourceHandler("/**").addResourceLocations("file:" + staticPath);
    }
 }

 @Override
 public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/").setViewName("forward:/index.html");
    registry.addViewController("/admin/**").setViewName("forward:/index.html");
    registry.addViewController("/edit/**").setViewName("forward:/index.html");
    registry.addViewController("/home").setViewName("forward:/index.html");
    registry.addViewController("/myads").setViewName("forward:/index.html");
    registry.addViewController("/about").setViewName("forward:/index.html");
    registry.addViewController("/public/**").setViewName("forward:/index.html");
 }
}