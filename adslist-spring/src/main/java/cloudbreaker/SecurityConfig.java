package cloudbreaker;

import java.util.regex.Pattern;

import javax.servlet.Filter;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.*;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication()
		.withUser("user").password("password").roles("USER").and()
		.withUser("user1").password("password").roles("USER").and()
		.withUser("user2").password("password").roles("USER").and()
		.withUser("admin").password("password").roles("USER", "ADMIN");
	}

	@Bean
	public Filter csrfHeaderFilter() {
	    return new CsrfHeaderFilter();
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {

		// Selectively disable CSRF protection on the manager API
		// Based on
		// http://stackoverflow.com/questions/22524470/spring-security-3-2-csrf-disable-for-specfic-urls
		RequestMatcher csrfRequestMatcher = new RequestMatcher() {

			// Disable CSFR protection on the following urls:
			private AntPathRequestMatcher[] requestMatchers = {
					new AntPathRequestMatcher("/logout"),
					new AntPathRequestMatcher("/login"),
					new AntPathRequestMatcher("/api/manager/**")
					};

			private Pattern allowedMethods = 
					    Pattern.compile("^(GET|HEAD|TRACE|OPTIONS)$");

			@Override
			public boolean matches(HttpServletRequest request) {
				// If the request match one url the CSFR protection will be
				// disabled
				for (AntPathRequestMatcher rm : requestMatchers) {
					if (rm.matches(request)) {
						return false;
					}
				}
				return !(allowedMethods.matcher(request.getMethod()).matches());
			} // method matches

		}; // new RequestMatcher

		http.authorizeRequests().antMatchers("/app/**", "/assets/**", "/dist/**", "/lib/**", "/public/**", "/api/ad/**", "/api/user/current", "/notification/**").permitAll()
				.antMatchers("/admin/**").hasRole("ADMIN").anyRequest().authenticated().and().csrf()
				.requireCsrfProtectionMatcher(csrfRequestMatcher).and()
				.formLogin().defaultSuccessUrl("/home", true)
				.and()
				.logout()
		          .logoutRequestMatcher(new AntPathRequestMatcher("/logout"));
	}
}