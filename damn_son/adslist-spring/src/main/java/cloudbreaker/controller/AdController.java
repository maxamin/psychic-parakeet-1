package cloudbreaker.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestWrapper;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cloudbreaker.model.Ad;
import cloudbreaker.model.AdService;
import cloudbreaker.model.HTMLSanitizer;
import cloudbreaker.model.ReviewCommand;

@RestController
@RequestMapping("/api/ad")
public class AdController {

	@Autowired
	private AdService repo;

	@Autowired
	private SimpMessagingTemplate template;

	@RequestMapping(method = RequestMethod.GET)
	public Iterable<Ad> find(SecurityContextHolderAwareRequestWrapper request, @RequestParam(required = false) String query) {	
		if (query != null && !query.startsWith("status='published' and") && !request.isUserInRole("ADMIN")) {
			throw new UnathorizedException();
		}
		return repo.find(query);
	}

	@RequestMapping(value = "/myads", method = RequestMethod.GET)
	public Iterable<Ad> getMyAds() {
		return repo.find("creator='"
				+ ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername()
				+ "'");
	}

	@RequestMapping(value = "/{adId}", method = RequestMethod.GET)
	public Ad getById(@PathVariable long adId) {
		return repo.findOne(adId);
	}

	@RequestMapping(value = "/{adId}/token/{token}", method = RequestMethod.GET)
	public Ad getByIdWithToken(@PathVariable long adId, @PathVariable String token) {
		Ad retval = repo.findOne(adId);
		if (retval.getToken().replaceAll("-", "").equals(token.replaceAll("-", ""))) {
			return retval;
		}
		throw new BadRequestException();
	}

	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<?> create(SecurityContextHolderAwareRequestWrapper request, @RequestBody Ad input) {
		input.setText(HTMLSanitizer.sanitize(input.getText()));
		input.setCreator(
				((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername());
		if (!request.isUserInRole("ADMIN")) {
			input.setApproved(false);
			input.setStatus("waitingforreview");
		}
		repo.save(input);
		return new ResponseEntity<>(HttpStatus.CREATED);
	}

	@RequestMapping(value = "/{adId}", method = RequestMethod.PUT)
	public ResponseEntity<?> update(SecurityContextHolderAwareRequestWrapper request, @PathVariable long adId, @RequestBody Ad input) {
		Ad ad = repo.findOne(adId);
		if (input.getText() != "") {
			ad.setText(input.getText());			
		}
		if (input.getToken() != "") {
			ad.setToken(input.getToken());			
		}
		if (!request.isUserInRole("ADMIN")) {
			ad.setStatus("waitingforreview");
			ad.setApproved(false);
			ad.setPublished(false);
		}
		repo.save(ad);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@RequestMapping(value = "/{adId}/review", method = RequestMethod.POST)
	@PreAuthorize("hasRole('ADMIN')")
	public Ad review(@PathVariable long adId, @RequestBody ReviewCommand input) {
		Ad ad = repo.findOne(adId);
		ad.setStatus("reviewed");
		ad.setApproved(input.approved);
		ad.setRejected(!input.approved);
		repo.save(ad);
		if (ad.isApproved()) {
			this.template.convertAndSend("/ad/accepted", ad);
		}
		return ad;
	}

	@RequestMapping(value = "/{adId}/publish", method = RequestMethod.POST)
	public Ad publish(@PathVariable long adId) {
		Ad ad = repo.findOne(adId);
		ad.publish();
		repo.save(ad);
		return ad;
	}
}