using Photon.Pun;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Bomb : BombPlanter, IExplodeable
{

    Animator animator;
    private List<GameObject> colliders = new List<GameObject>();
    [HideInInspector] public PhotonView myOwner;

    [SerializeField] private float radius;
    [SerializeField] private float mass;
    [SerializeField] private float m_StartTimeToExplode;
    [SerializeField] private GameObject explosionEffect;
    [SerializeField] private GameObject novaExplosionEffect;

    private float m_TimeToExplode;
    public bool m_IsExploded;



    public float Radius => radius;
    public float Mass => mass;


    void Start()
    {

        animator = GetComponent<Animator>();

        m_IsExploded = false;

        StartBombCountdown();
    }


    void Update()
    {
        if (m_TimeToExplode <= 0 && !m_IsExploded)
        {
            Explode();
        }
        else
        {
            m_TimeToExplode -= Time.deltaTime;
        }
    }



    public void Explode()
    {
        Debug.Log("You Destroyed the area of " + radius + "m²");
        gameObject.GetComponent<SpriteRenderer>().enabled = false;
        m_IsExploded = true;
        ExplosionEffect();
    }
    public void StartBombCountdown()
    {
        m_TimeToExplode = m_StartTimeToExplode;
        Debug.Log("You Planted a Bomb");
    }


    private void CheckHitColliders()
    {

        Collider2D[] hits = Physics2D.OverlapCircleAll(this.transform.position, radius);
        if (hits.Length <= 0)
            return;

        for (int i = 0; i < hits.Length; i++)
        {
            if (hits[i].tag == "Player" || hits[i].tag == "Enemy"
                || hits[i].tag == "EnemyRanged" || hits[i].tag == "EnemyClose")
            {
                Debug.Log(i + ": " + hits[i].name + "\n");
                colliders.Add(hits[i].gameObject);
            }
        }

        for (int i = 0; i < colliders.Count; i++)
        {
            DealDamage(colliders[i]);
        }
    }

    private void DealDamage(GameObject hitObject)
    {
        if (hitObject.GetComponent<PhotonView>().Owner == myOwner.Owner && hitObject.tag == "Player") return;
        
        hitObject.GetComponent<HealthSystem>().LoseHealth((int)mass, myOwner);
    }

    public void ExplosionEffect()
    {

        CheckHitColliders();
        //Bullet hit point effect
        GameObject hitObject = Instantiate(explosionEffect, transform.position, Quaternion.identity);
        GameObject nova = Instantiate(novaExplosionEffect, transform.position, Quaternion.identity);
        Destroy(nova, 3f);
        Destroy(hitObject, 3f);
        Destroy(this.gameObject, 3f);
    }

    private void OnDrawGizmos()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, radius);
    }

    public void Execute()
    {
        throw new System.NotImplementedException();
    }

    public void Reload()
    {
        throw new System.NotImplementedException();
    }

    public void IncreaseAmmo(int amount)
    {
        throw new System.NotImplementedException();
    }
}
