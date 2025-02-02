using Photon.Pun;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.AI;

public class BossController : MonoBehaviour
{

    public static BossController instance;

    PhotonView _photonV;
    Animator _anim;
    NavMeshAgent _agent;
    Collider2D _collider;
    HealthSystem _hp;

    public LayerMask _targetLayer;
    public Transform[] firePoints;
    public GameObject bullet;
    private Vector2 startPoint;
    private Quaternion rotation;


    public float detectingRaduis;
    public float moveSpeed = 1f;
    public bool shooting;
    public float shootPower = 10f;
    public float InitialTimeToShoot;

    private int rndmXIndex;
    private int rndmYIndex;
    private float timeToShoot;
    private float timeToFire;

    void Awake()
    {
        if (instance == null)
            instance = this;

        _agent = GetComponent<NavMeshAgent>();
        _agent.updateRotation = false;
        _agent.updateUpAxis = false;





    }

    void Start()
    {
        _photonV = GetComponent<PhotonView>();


        if (!_photonV.IsMine)
            return;

        if (!PhotonNetwork.IsMasterClient)
            return;


        _hp = GetComponent<HealthSystem>();
        _anim = GetComponent<Animator>();

        startPoint = transform.position;
        timeToShoot = InitialTimeToShoot;
        rndmXIndex = UnityEngine.Random.Range(-(int)detectingRaduis, (int)detectingRaduis);
        rndmYIndex = UnityEngine.Random.Range(-(int)detectingRaduis, (int)detectingRaduis);

    }
    void Update()
    {
        if (!_photonV.IsMine)
            return;

        if (!PhotonNetwork.IsMasterClient)
            return;

        if (!shooting)
        {
            _anim.SetBool("Idle", true);

        }
        ShootingTime();
        IsDetected();


        if (_collider != IsDetected())
        {
            float distance = Vector2.Distance(transform.position, _collider.transform.position);
            if (distance < detectingRaduis)
                IsDetected();
        }
        else
        {
            //ReturnToArea();
            //_anim.SetBool("Attack", false);
            //_anim.SetBool("Idle", true);
        }


        UIFollowPlayer();
    }
    public void ResetShootingDelay()
    {
        timeToShoot = InitialTimeToShoot;
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

    bool IsDetected()
    {
        Collider2D detectedCollider = Physics2D.OverlapCircle(transform.position, detectingRaduis, _targetLayer);
        if (detectedCollider != null)
        {
            _collider = detectedCollider;
            LookAtPlayer(detectedCollider.transform.position);
            if (Vector2.Distance(transform.position, detectedCollider.transform.position) >= detectingRaduis / 4)
            {
                Vector2 pointToGet = new Vector2(
                    detectedCollider.transform.position.x - (detectingRaduis / rndmXIndex),
                    detectedCollider.transform.position.y - (detectingRaduis / rndmYIndex));
                ComeAfterTarget(pointToGet);
                _hp.sliderHealth.gameObject.SetActive(true);


                if (shooting)
                {
                    Shooting();
                }
            }
        }
        else
        {
            _collider = null;
            rndmXIndex = Random.Range(-6, 6);
            rndmYIndex = Random.Range(-6, 6);
        }
        return detectedCollider;
    }


    void ComeAfterTarget(Vector2 playerPosition)
    {
        _agent.SetDestination(playerPosition);

    }


    void LookAtPlayer(Vector3 pointToLookAt)
    {
        Vector3 lookDir = pointToLookAt - transform.position;
        float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg - 90f;
        transform.rotation = Quaternion.Euler(transform.rotation.x, transform.rotation.y, angle);


    }




    void Shooting()
    {

        if (Time.time >= timeToFire)
        {
            for (int i = 0; i < firePoints.Length; i++)
            {
                if (_collider == null)
                    return;
                Vector2 direction = _collider.transform.position - firePoints[i].position;
                float angle = Mathf.Atan2(direction.y, direction.x) * Mathf.Rad2Deg - 180f;

                Vector2 spawnPos = firePoints[i].position;
                rotation = Quaternion.Euler(rotation.x, rotation.y, angle);

                _photonV.RPC("RPC_Fire", RpcTarget.AllViaServer, spawnPos, rotation, firePoints[i].up);
                timeToFire = Time.time + 1 / bullet.GetComponent<EnemyBullet>().fireRate;
            }
            _anim.SetTrigger("Attack");
            _anim.SetBool("Idle", false);
        }
    }

    [PunRPC]
    public void RPC_Fire(Vector2 spawnPos, Quaternion rotation, Vector3 up)
    {

        GameObject projectile = Instantiate(bullet, spawnPos, Quaternion.identity);
        projectile.GetComponent<EnemyBullet>().myOwner = _photonV;

        projectile.transform.localRotation = rotation;
        Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
        rb.AddForce(up * shootPower, ForceMode2D.Impulse);
    }


    void UIFollowPlayer()
    {
        Slider hpSlider = _hp.sliderHealth;
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
