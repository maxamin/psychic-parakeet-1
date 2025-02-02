using UnityEngine;
using System.Collections;

/// <summary>
/// Simple health component to track health for turrets in turret demo scene.
/// </summary>
[RequireComponent(typeof(Collider2D))]
public class DemoTurretHealth : MonoBehaviour {

    public int health = 10;
    public GameObject explosionParticle;
        
	// Use this for initialization
	void Start () {
	}
	
    void OnCollisionEnter2D(Collision2D other)
    {
        if (other.gameObject.layer == LayerMask.NameToLayer("WeaponSystemBullets"))
        {
            health--;
        }
    }

	// Update is called once per frame
	void Update () {
	    if (health <= 0)
        {
            Instantiate(explosionParticle, transform.position, Quaternion.identity);
            Destroy(gameObject);
        }
	}
}
