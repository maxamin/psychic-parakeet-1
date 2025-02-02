using System.Collections;
using System;
using System.Collections.Generic;
using UnityEngine.AI;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;
public class SlappingEnemy : MonoBehaviour
{


    Animator anim;
    NavMeshAgent agent; 
    PhotonView pv;
    public float detectingRaduis;
    public float moveSpeed = 1f;
    Vector2 startPoint;
    public LayerMask whatIsTargetedLayer;
    Collider2D collider;
    HealthSystem hp;
    public bool shooting;
    bool thereIsPlayer;
    public Transform[] firePoints;

    void Awake()
    {
        agent = GetComponent<NavMeshAgent>();
        agent.updateRotation = false;
        agent.updateUpAxis = false;

    }
    private int rndmXIndex;
    private int rndmYIndex;


    void Start()
    {
        hp = GetComponent<HealthSystem>();
        anim = GetComponent<Animator>();
        pv= GetComponent<PhotonView>();
        shooting = true;
        startPoint = transform.position;
        timeToShoot = whatTimeToShoot;
        rndmXIndex = UnityEngine.Random.Range(-3, 3);
        rndmYIndex = UnityEngine.Random.Range(-3, 3);

    }
    void Update()
    {

        if (!pv.IsMine)
            return;
        if (!shooting)
        {
            anim.SetBool("Idle", true);
        }


        ShootingTime();
        Detection();
        if (collider != Detection())
        {
            float distance = Vector2.Distance(transform.position, collider.transform.position);
            if (distance < detectingRaduis)
                Detection();
            else ReturnToArea();
        }
        else
        {
            //ReturnToArea();
            //anim.SetBool("Attack", false);
            //anim.SetBool("Idle", true);
        }
        UIFollowPlayer();
    }

    bool Detection()
    {
        Collider2D detectedCollider = Physics2D.OverlapCircle(transform.position, detectingRaduis, whatIsTargetedLayer);
        if (detectedCollider != null)
        {
            collider = detectedCollider;
            LookAtPlayer(detectedCollider.transform.position);
            if (Vector2.Distance(transform.position, detectedCollider.transform.position) >= detectingRaduis / 3)
            {
                Vector2 pointToGet = new Vector2(
                    detectedCollider.transform.position.x - (detectingRaduis / rndmXIndex),
                    detectedCollider.transform.position.y - (detectingRaduis / rndmYIndex));
                ComeAfterTarget(pointToGet);
                hp.sliderHealth.gameObject.SetActive(true);


                if (shooting )
                {
                    Shooting();
                }
            }
            thereIsPlayer = true;
        }
        return detectedCollider;
    }
    void ComeAfterTarget(Vector2 playerPosition)
    {
        agent.SetDestination(playerPosition);

    }
    void ReturnToArea()
    {
        thereIsPlayer = false;
        hp.sliderHealth.gameObject.SetActive(false);
        LookAtPlayer(startPoint);
        ComeAfterTarget(startPoint);
        anim.SetBool("Idle", true);
    }
    void LookAtPlayer(Vector3 pointToLookAt)
    {
        Vector3 lookDir = pointToLookAt - transform.position;
        float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg - 90f;
        transform.rotation = Quaternion.Euler(transform.rotation.x, transform.rotation.y, angle);


    }

    Quaternion rotation;
    float timeToFire;

    void Shooting()
    {

        anim.SetTrigger("Attack");
        anim.SetBool("Idle", false);

    }
    public float whatTimeToShoot;
    private float timeToShoot;
    public void ResetShootingDelay()
    {
        timeToShoot = whatTimeToShoot;
    }
    void ShootingTime()
    {
        if (timeToShoot <= 0)
        {
            shooting = true;
        }
        else
        {
            shooting = false;
            timeToShoot -= Time.deltaTime;
        }
    }

    public float attackRaduis;
    public void Slap()
    {
        Collider2D collider = Physics2D.OverlapCircle(firePoints[0].position, attackRaduis, whatIsTargetedLayer);
        if (collider != null)
        {
            HealthSystem phealth = collider.GetComponent<HealthSystem>();
            phealth.LoseHealth(9, null);
        }
    }

    void UIFollowPlayer()
    {
        Slider hpSlider = hp.sliderHealth;
        float multiplier = (transform.rotation.z > 0) ? 1f : -1f;
        hpSlider.transform.rotation = transform.rotation;

    }

    void OnDrawGizmos()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, detectingRaduis);
        Gizmos.color = Color.blue;
        Gizmos.DrawWireSphere(firePoints[0].position, attackRaduis);
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.tag == "Player")
        {
            collision.GetComponent<HealthSystem>().LoseHealth(10, pv);
        }
    }
}


