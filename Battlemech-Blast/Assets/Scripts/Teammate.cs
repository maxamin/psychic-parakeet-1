using UnityEngine;
using UnityEngine.AI;

public class Teammate : MonoBehaviour
{

    public static Teammate instance;


    [Header("Movement")]
    Animator anim;
    NavMeshAgent agent;
    public float distanceBetweenPlayer = .5f;
    float moveSpeed = 2f;

    [Header("Detection")]
    public float detectionRaduis;
    public Transform detectedCollider;
    public LayerMask whichLayer;

    [Header("Attacking")]
    public Transform[] firePoints;
    public GameObject bullet;
    Quaternion rotation;
    public float whatTimeToShoot;
    public float shootPower = 10f;
    public bool shoot;
    private float timeToShoot;
    private float timeToFire;
    Vector2 mousePos;


    void Awake()
    {
        instance = this;
    }

    void Start()
    {
        anim = GetComponent<Animator>();
        agent = GetComponent<NavMeshAgent>();
        agent.updateRotation = false;
        agent.updateUpAxis = false;

    }

    void Update()
    {
        float distance = Vector2.Distance(this.transform.position, GameHandler.instance.playerTransform.position);
        if (this.distanceBetweenPlayer < distance && detectedCollider == null)
        {
            ComeAfterTarget(GameHandler.instance.playerTransform.position);
        }
        else
        {
            agent.isStopped = true;

        }

        if (agent.isStopped)
        {
            Debug.Log("the agent is stopped");
            anim.SetBool("Idle", true);
            anim.SetBool("Walk", false);
        }
        if (GameHandler.instance.playerTransform.hasChanged)
        {
            agent.isStopped = false;
        }
        if (!shoot)
        {
        }
        ShootingTime();
        Detection();
    }
    void ComeAfterTarget(Vector2 playerPosition)
    {

        playerPosition = new Vector2(playerPosition.x + 1f,
            playerPosition.y + 1f);
        agent.SetDestination(playerPosition);
        if (transform.position == agent.destination)
        {
            agent.isStopped = true;
            Debug.Log("Teammate in the spot");
        }
        else
        {
            anim.SetBool("Idle", false);
            anim.SetBool("Walk", true);
        }

    }
    void Detection()
    {
        Collider2D collider = Physics2D.OverlapCircle(transform.position, detectionRaduis, whichLayer);
        if (collider != null)
        {
            detectedCollider = collider.transform;
            float distance = Vector2.Distance(transform.position, collider.transform.position);
            if (distance > detectionRaduis)
            {
                //the detected collider out of the range
                //ResetShootingDelay();
            }
            if (shoot)
            {
                Shooting();
            }
        }
        else
        {
            detectedCollider = null;
        }
    }

    public void ResetShootingDelay()
    {
        timeToShoot = whatTimeToShoot;
    }

    void ShootingTime()
    {
        if (timeToShoot <= 0)
        {
            shoot = true;
        }
        else
        {
            shoot = false;
            timeToShoot -= Time.deltaTime;
        }
    }

    void Shooting()
    {
        anim.SetTrigger("Shoot");
        anim.SetBool("Idle", false);
        anim.SetBool("Walk", false);
        if (Time.time >= timeToFire)
        {
            for (int i = 0; i < firePoints.Length; i++)
            {
                Vector2 direction = detectedCollider.transform.position - firePoints[i].position;
                float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg - 180f;

                Vector2 spawnPos = firePoints[i].position;

                rotation = Quaternion.Euler(rotation.x, rotation.y, angle);
                GameObject projectile = Instantiate(bullet, spawnPos, Quaternion.identity);

                projectile.transform.localRotation = rotation;
                Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
                rb.AddForce(firePoints[i].up * shootPower, ForceMode2D.Impulse);
                timeToFire = Time.time + 1 / 2;
            }
        }
    }
    private void FixedUpdate()
    {
        LookAtTarget(MousePosition());
    }

    void LookAtTarget(Vector3 pointToLookAt)
    {
        Vector3 lookDir = pointToLookAt - transform.position;
        float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg - 90f;
        transform.rotation = Quaternion.Euler(transform.rotation.x, transform.rotation.y, angle);
    }
    Vector2 MousePosition()
    {
        if (detectedCollider != null)
        {
            return detectedCollider.transform.position;
        }
        else
        {
            return mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        }
    }
    void OnDrawGizmos()
    {
        Gizmos.color = Color.green;
        Gizmos.DrawWireSphere(transform.position, detectionRaduis);
    }
}
