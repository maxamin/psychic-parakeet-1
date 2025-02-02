using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Pun;

public class EnemyBullet : MonoBehaviour
{
    [HideInInspector] public PhotonView myOwner;
    private HealthSystem hp;

    public int damage;
    public float fireRate;
    public AudioClip bulletSound;
    public GameObject hitEffect;
    public GameObject explosionEffect;




    private void Start()
    { 
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.tag == "Player")
        {
            if (gameObject.tag == "EnemyBullet")
            {
                collision.GetComponent<HealthSystem>().LoseHealth(damage, myOwner);
                Destroy(this.gameObject);
                DestroyEffect();

            }
            else
            {
                if (collision.gameObject.GetComponent<PhotonView>().Owner != myOwner.Owner)
                {
                    collision.GetComponent<HealthSystem>().LoseHealth(damage, myOwner);
                    Destroy(this.gameObject);
                    DestroyEffect();

                }
            }
        }

        if (collision.name == "Tilemap_Bounds")
        {
            Destroy(this.gameObject);
        }
        if (collision.tag == "Bound")
        {
            Destroy(this.gameObject);
        }

    }
    public void DestroyEffect()
    {

        //Bullet hit point effect
        GameObject hitObject = Instantiate(hitEffect, transform.position, Quaternion.identity);
        Destroy(hitObject, 3f);

    } 
    public void TimetoDie()
    {

        Destroy(this.gameObject, 3.5f);

    }
    private void Update()
    {
        TimetoDie();
    }


}
