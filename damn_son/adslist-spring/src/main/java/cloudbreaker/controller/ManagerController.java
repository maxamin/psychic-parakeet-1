package cloudbreaker.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import cloudbreaker.model.Ad;
import cloudbreaker.model.AdService;

/**
 * This controller provides functionality to the manager app, which is a (theoretical) desktop application. 
 * 
 * @author ko
 *
 */

@RestController
@RequestMapping("/api/manager")
public class ManagerController {
	@Autowired
	private AdService repo;
	
    @RequestMapping(value = "/ad/{adId}", method = RequestMethod.PUT)
    public ResponseEntity<?> update(@PathVariable long adId, @RequestBody Map<String, Object> input) {
    		Ad ad = repo.findOne(adId);
    		ad.setText((String)input.get("text"));
    		if (input.get("approved") != null) {
        		ad.setApproved(Boolean.parseBoolean((String)input.get("approved")));    			
    		}
        repo.save(ad);
        return new ResponseEntity<>(HttpStatus.OK);
    }

}
