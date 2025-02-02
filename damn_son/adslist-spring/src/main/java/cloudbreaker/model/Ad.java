package cloudbreaker.model;

import java.util.Date;
import java.util.Random;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Ad {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private long id;
    private String text = "";
    private Date createdOn = new Date();
    private boolean approved = false;
    private boolean rejected = false;
    private String status = "waitingforreview";
    private boolean published = false;
    private String token = "";
    private String creator = "";

    protected Ad() {}

    public Ad(String text) {
        this.text = text;
    }
    
    public void publish() {
    		if (this.token == "") {
        		Random r = new Random();
        		this.token = "" + r.nextInt() + r.nextInt() + r.nextInt();    			
    		}
    		this.status = "published";
    }
 
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
	}

	public boolean isRejected() {
		return rejected;
	}

	public void setRejected(boolean rejected) {
		this.rejected = rejected;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isPublished() {
		return published;
	}

	public void setPublished(boolean published) {
		this.published = published;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

}