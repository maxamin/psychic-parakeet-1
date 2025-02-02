package cloudbreaker;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import cloudbreaker.model.Ad;
import cloudbreaker.model.AdRepo;

@SpringBootApplication
public class AdsListApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(AdsListApplication.class, args);
	}
	
	@Bean
	public CommandLineRunner demo(AdRepo repository) {
		return (args) -> {
			Ad first = new Ad("This is the <b>first</b> ad");
			first.setStatus("reviewed");
			first.setApproved(true);
			first.setCreator("admin");
			repository.save(first);
			repository.save(new Ad("FCK"));
		};
	}
}
