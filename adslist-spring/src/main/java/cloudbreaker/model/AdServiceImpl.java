package cloudbreaker.model;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AdServiceImpl implements AdService {

	@Autowired
	private AdRepo repo;
	
	@PersistenceContext
	private EntityManager em;
	
	@Override
	public Iterable<Ad> find(String query) {
		if (query == null || query == "") {
			query="approved=true";
		}
		TypedQuery<Ad> jpql = em.createQuery("select a from Ad a where " + query, Ad.class);
		return jpql.getResultList();
	}
	
	@Override
	public Iterable<Ad> findAll() {
		return repo.findAll();
	}

	@Override
	public Ad findOne(long adId) {
		return repo.findOne(adId);
	}

	@Override
	public void save(Ad input) {
		repo.save(input);
	}
}
