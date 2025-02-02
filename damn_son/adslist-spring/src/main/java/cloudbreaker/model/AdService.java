package cloudbreaker.model;

public interface AdService {

	Iterable<Ad> find(String query);

	Iterable<Ad> findAll();

	Ad findOne(long adId);

	void save(Ad input);

}
