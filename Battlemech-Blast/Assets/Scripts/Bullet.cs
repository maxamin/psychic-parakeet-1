using UnityEngine;
using Photon.Pun;
using Photon.Realtime;

public class Bullet : MonoBehaviour
{
    [HideInInspector] public PhotonView myOwner;
    private HealthSystem hp;
    private IFireable fireable;

    public Weapon weapon;
    public AudioClip bulletSound;
    public GameObject hitEffect;
    public GameObject explosionEffect;




    private void Start()
    {
        fireable = weapon.GetComponent<IFireable>();
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.tag == "Player")
        {
            if (gameObject.tag == "EnemyBullet")
            {
                collision.GetComponent<HealthSystem>().LoseHealth((int)fireable.Damage, myOwner);
                Destroy(this.gameObject);
                DestroyEffect();

            }
            else
            {
                if (collision.gameObject.GetComponent<PhotonView>().Owner != myOwner.Owner)
                {
                    collision.GetComponent<HealthSystem>().LoseHealth((int)fireable.Damage, myOwner);
                    Destroy(this.gameObject);
                    DestroyEffect();

                }
            }
        }

        if (collision.gameObject.tag == "Enemy" || collision.gameObject.tag == "EnemyRanged" || collision.gameObject.tag == "EnemyClose")
        {
            if (gameObject.tag == "EnemyBullet")
            {

            }
            else
            {
                hp = collision.GetComponent<HealthSystem>();
                DestroyEffect();
                hp.LoseHealth((int)fireable.Damage, myOwner);
                Destroy(this.gameObject);

            }
        }
        if (collision.name == "Tilemap_Bounds")
        {
            DestroyEffect();
            Destroy(this.gameObject);
        }
        if (collision.tag == "Bound")
        {
            DestroyEffect();
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
