using Photon.Pun;
using System.Collections;
using System.Collections.Generic;
using System.Net;
using Unity.Burst.CompilerServices;
using UnityEngine;
using DG.Tweening;
using static UnityEditor.Experimental.GraphView.Port;
using UnityEditor.PackageManager;

public class ThrowableWeapon : Throwable, IThrowable
{ 
    [SerializeField] protected float m_Radius;
    [SerializeField] protected float m_Damage;
    [SerializeField] protected float m_DamageInterval;
    [SerializeField] protected float m_ElapseDuration;
    [SerializeField] protected float m_TimeToExecute;
    [SerializeField] protected float m_TimeToDie;
    [SerializeField] protected float m_ShootForce;
    [SerializeField] protected float m_TorqueSpeed;

    [SerializeField] private bool m_isFiring;



    #region Interface_Variables
     
    public float Radius => m_Radius;
    public float Damage => m_Damage;
    public float DamageInterval => m_DamageInterval;
    public float ElapseDuration => m_ElapseDuration;
    public float TimeToExecute => m_TimeToExecute;
    public float TimeToDie => m_TimeToDie;
    public float ShootForce => m_ShootForce;
    public float TorqueSpeed => m_TorqueSpeed;



    #endregion

    #region Components


    [HideInInspector] public PhotonView myOwner;
    Rigidbody2D rb;


    #endregion


    private List<GameObject> colliders = new List<GameObject>();

    public GameObject collisionEffect;
    private bool isExecuted = false;
    private bool isShooted = false;
    public bool debug = true;

    Vector2 target;
    public float gravity;
    public float height;


    private void Start()
    {
        rb = GetComponent<Rigidbody2D>();

         
         



    }

    private void Update()
    {
        CheckColliderBeforeExecute();
        ReachTarget();


    }

    private void ExecuteWeapon()
    {
        //Execute Collision effect
        ExplosionEffect();
        CheckHitColliders();

        //

        isExecuted = true;
    }
    public float radius;
    bool CheckCollision() // AABB - AABB collision
    {
        // collision x-axis?
        bool collisionX = transform.position.x <= target.x + radius &&
            target.x - radius <= transform.position.x;
        // collision y-axis?
        bool collisionY = transform.position.y <= target.x + radius &&
            target.y - radius <= transform.position.y;
        // collision only if on both axes
        return collisionX && collisionY;
    }
    private void ReachTarget()
    {
        if (!isExecuted && CheckCollision())
        {
            Debug.Log("Reach Target");
            rb.isKinematic = false;
            rb.gravityScale = 0f;
            transform.position = target;
            ExecuteWeapon();
        }
    }
    public void ExplosionEffect()
    {
        gameObject.GetComponent<SpriteRenderer>().enabled = false;
        //Bullet hit point effect
        GameObject hitObject = Instantiate(collisionEffect, transform.position, Quaternion.identity);
        Destroy(hitObject, 3f);
        KillTime();
    }
    private void CheckColliderBeforeExecute()
    {
        Collider2D hit = Physics2D.OverlapBox(transform.position, GetComponent<BoxCollider2D>().size, Radius);
        if (hit != null && !isExecuted && hit.gameObject != this.gameObject && hit.tag == "Bounds")
        {
            //if (hit.GetComponent<PhotonView>() != null)
            //    if (hit.GetComponent<PhotonView>().Owner == myOwner.Owner)
            //        return;
            Debug.Log("Collides with " + hit.name + "\n");

            ExecuteWeapon();
        }
    }

    private void CheckHitColliders()
    {

        Collider2D[] hits = Physics2D.OverlapCircleAll(this.transform.position, Radius);

        if (hits.Length <= 0)
            return;

        for (int i = 0; i < hits.Length; i++)
        {
            if (hits[i].tag == "Player" || hits[i].tag == "Enemy"
                || hits[i].tag == "EnemyRanged" || hits[i].tag == "EnemyClose")
            {
                if (hits[i].GetComponent<PhotonView>() != null)
                    if (hits[i].GetComponent<PhotonView>().Owner == myOwner.Owner)
                        return;
                Debug.Log("You Hit " + i + ": " + hits[i].name + "\n");
                colliders.Add(hits[i].gameObject);
            }
        }

        StartCoroutine(DamageByInterval(colliders));
    }

    private IEnumerator DamageByInterval(List<GameObject> hitObjects)
    {
        //Stun player for a while
        for (int i = 0; i < colliders.Count; i++)
        {
            DealDamage(hitObjects[i]);
        }
        yield return new WaitForSeconds(DamageInterval);

    }
    private void KillTime()
    {
        Destroy(gameObject, TimeToDie);

    }
    private void DealDamage(GameObject hitObject)
    {
        if (hitObject.GetComponent<PhotonView>().Owner == myOwner.Owner && hitObject.tag == "Player") return;

        hitObject.GetComponent<HealthSystem>().LoseHealth((int)Damage, myOwner);
    }
    public void ProjctileMovement(Vector2 targetPosition, Rigidbody2D rb, float turnDireciton)
    {

        target = new Vector2(targetPosition.x, targetPosition.y);
        rb.gravityScale = 0f;

        Launch(rb, turnDireciton);

    }

    private void Launch(Rigidbody2D rb, float turnDireciton)
    {
        //Physics2D.gravity = Vector2.up * gravity;
        //rb.gravityScale = 1f;
        //rb.AddForce(CalculateLaunchData().initialVelocity * ShootForce* turnDireciton, ForceMode2D.Impulse);
        //transform.DORotate(transform.eulerAngles + Vector3.forward * turnDireciton * TorqueSpeed, .5f, RotateMode.Fast);

    }
    private LaunchData CalculateLaunchData()
    {
        Vector2 targetPoint = target - (Vector2)transform.position;
        float displacementY = target.y - transform.position.y;
        Vector2 displacementXZ = new Vector2(target.x - transform.position.x, 0);
        float time = Mathf.Sqrt(-2 * height / gravity) + Mathf.Sqrt(2 * (displacementY - height) / gravity);
        Vector2 velocityY = Vector2.up * Mathf.Sqrt(-2 * gravity * height);
        Vector2 velocityXZ = displacementXZ / time;

        return new LaunchData(target, time);
    }
    private void DrawPath()
    {
        LaunchData launchData = CalculateLaunchData();
        Vector2 previousDrawPoint = (Vector2)rb.position; //Initial throwing position

        int resolution = 30;
        for (int i = 1; i <= resolution; i++)
        {
            float simulationTime = i / (float)resolution * launchData.timeToTarget;
            Vector2 displacement = launchData.initialVelocity * simulationTime + Vector2.up * gravity * simulationTime * simulationTime / 2f;
            Vector2 drawPoint = (Vector2)transform.position + displacement;
            Debug.DrawLine(previousDrawPoint, drawPoint, Color.green);
            previousDrawPoint = drawPoint;
        }
    }
    private struct LaunchData
    {
        public readonly Vector2 initialVelocity;
        public readonly float timeToTarget;

        public LaunchData(Vector2 initialVelocity, float timeToTarget)
        {
            this.initialVelocity = initialVelocity;
            this.timeToTarget = timeToTarget;
        }

    }
    private void OnDrawGizmos()
    {
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(target, radius);
    }
}
