using UnityEngine;
using UnityEngine.AI;
using UnityEngine.UI;
using Photon.Pun;
public class EnemyDetection : MonoBehaviour
{
    public static EnemyDetection instance;

    PhotonView photonV ;
    Animator anim;
    NavMeshAgent agent;
    Collider2D collider;
    HealthSystem hp;

    public LayerMask whatIsTargetedLayer;
    public Transform[] firePoints;
    public GameObject bullet;
    private Vector2 startPoint;
    private Quaternion rotation;


    public float detectingRaduis;
    public float moveSpeed = 1f;
    public bool shooting;
    public float shootPower = 10f;
    public float whatTimeToShoot;

    private int rndmXIndex;
    private int rndmYIndex;
    private float timeToShoot;
    private float timeToFire;
    private bool thereIsPlayer;
    private bool isPartoling;


    void Awake()
    {
        if (instance == null)
            instance = this;

        agent = GetComponent<NavMeshAgent>();
        agent.updateRotation = false;
        agent.updateUpAxis = false;





    }

    void Start()
    {
        photonV  = GetComponent<PhotonView>();


        if (!photonV .IsMine)
            return;

        if (!PhotonNetwork.IsMasterClient)
            return;


        hp = GetComponent<HealthSystem>();
        anim = GetComponent<Animator>();

        startPoint = transform.position;
        timeToShoot = whatTimeToShoot;
        rndmXIndex = UnityEngine.Random.Range(-(int)detectingRaduis, (int)detectingRaduis);
        rndmYIndex = UnityEngine.Random.Range(-(int)detectingRaduis, (int)detectingRaduis);

    }
    void Update()
    {
        if (!photonV .IsMine)
            return;

        if (!PhotonNetwork.IsMasterClient)
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

    bool Detection()
    {
        Collider2D detectedCollider = Physics2D.OverlapCircle(transform.position, detectingRaduis, whatIsTargetedLayer);
        if (detectedCollider != null)
        {
            collider = detectedCollider;
            LookAtPlayer(detectedCollider.transform.position);
            if (Vector2.Distance(transform.position, detectedCollider.transform.position) >= detectingRaduis / 4)
            {
                Vector2 pointToGet = new Vector2(
                    detectedCollider.transform.position.x - (detectingRaduis / rndmXIndex),
                    detectedCollider.transform.position.y - (detectingRaduis / rndmYIndex));
                ComeAfterTarget(pointToGet);
                hp.sliderHealth.gameObject.SetActive(true);


                if (shooting)
                {
                    Shooting();
                }
            }
            thereIsPlayer = true;
        }
        else
        {
            collider = null;
            rndmXIndex = UnityEngine.Random.Range(-6, 6);
            rndmYIndex = UnityEngine.Random.Range(-6, 6);
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
    void Patrol()
    {

    }



    void Shooting()
    {
        if (gameObject.tag == "Enemy")
        {
            if (Time.time >= timeToFire)
            {
                for (int i = 0; i < firePoints.Length; i++)
                {
                    if (collider == null)
                        return;
                    Vector2 direction = collider.transform.position - firePoints[i].position;
                    float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg - 180f;

                    Vector2 spawnPos = firePoints[i].position;
                    rotation = Quaternion.Euler(rotation.x, rotation.y, angle);

                    photonV .RPC("RPC_Fire", RpcTarget.AllViaServer, spawnPos, rotation, firePoints[i].up);
                    timeToFire = Time.time + 1 / bullet.GetComponent<EnemyBullet>().fireRate;
                }
                anim.SetTrigger("Attack");
                anim.SetBool("Idle", false);
            }
        }
        if (gameObject.tag == "EnemyRanged")
        {

            anim.SetTrigger("Attack");
            anim.SetBool("Idle", false);


        }
    }

    [PunRPC]
    public void RPC_Fire(Vector2 spawnPos, Quaternion rotation, Vector3 up)
    {

        GameObject projectile = Instantiate(bullet, spawnPos, Quaternion.identity);
        projectile.GetComponent<EnemyBullet>().myOwner = photonV ;

        projectile.transform.localRotation = rotation;
        Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
        rb.AddForce(up * shootPower, ForceMode2D.Impulse);
    }
    public void RangedEnemyShoots()
    {
        Debug.Log("ranged attacks");
        for (int i = 0; i < firePoints.Length; i++)
        {
            if (collider == null)
                return;
            Vector2 direction = collider.transform.position - firePoints[i].position;
            float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg - 180f;


            Vector2 spawnPos = firePoints[i].position;

            rotation = Quaternion.Euler(rotation.x, rotation.y, angle);
            GameObject projectile = Instantiate(bullet, spawnPos, Quaternion.identity);

            projectile.transform.localRotation = rotation;
            Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
            rb.AddForce(firePoints[i].up * (shootPower + 10), ForceMode2D.Impulse);

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
    }

    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.tag == "Player")
        {
            //collision.GetComponent<HealthSystem>().LoseHealth(10);
        }
    }
}
