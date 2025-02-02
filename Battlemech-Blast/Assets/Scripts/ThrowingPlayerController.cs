using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine;
using UnityEngine.UI;

public class ThrowingPlayerController : MonoBehaviour
{
    private Rigidbody2D rb;
    private BoxCollider2D boxCollider2d;
    private SpriteRenderer _spr;
    private Animator anim;
    private Vector2 movement;
    private Vector2 mousePos;


    public LayerMask groundLayer;
    public LayerMask beanLayer;
    public LayerMask enemyLayer;
    public Camera cam;
    public Transform head;
    public Transform container;
    public Transform checkPoint;
    public ParticleSystem[] brokenEffects;
    private Transform coffeeBean;

    [Header("UI Entities")]
    public Transform entityContainer;
    public GameObject grabEntity;
    public GameObject tabSwitchEntity;
    public GameObject throwEntity;
    public GameObject shootEntity;

    [Header("Movement")]
    public float checkRadius;
    public float headRotSpeed;
    public float speed;
    public float timeToJumpApex;
    public float jumpHeight;
    private float initialVelocity;
    private float direction;


    [Header("Projectile")]
    public float shootForce;
    public float torqueSpeed;
    public GameObject pointPrefab;
    public GameObject[] points;
    public Transform pointsContainer;
    public int numberOfPoints;


    [Header("Ground Check")]
    public float castGroundDistance;
    public int numberOfRays;
    public bool isGrabbing;
    public bool isThrowing;
    private List<Ray2D> rays = new List<Ray2D>();
    private List<RaycastHit2D> hits = new List<RaycastHit2D>();
    private bool canDoubleJump;
    private bool isGrounded;


    private void OnEnable()
    {
        for (int i = 0; i < entityContainer.childCount; i++)
        {
            entityContainer.GetChild(i).gameObject.SetActive(false);
        }
    }

    void Start()
    {
        boxCollider2d = GetComponent<BoxCollider2D>();
        rb = GetComponent<Rigidbody2D>();
        _spr = GetComponent<SpriteRenderer>();
        anim = head.GetComponent<Animator>();
        IntializeTrajectoryPoints();
    }
    void Update()
    {
        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");

        if (movement.x != 0)
        {
            direction = movement.x;
        }
        //if (!GameManager.instance.isOver)
        //{
        InitialJumpPhysics();
        Jump();
        CheckGround();
        ApplyMovement();
        RotateHead(movement.x);
        FlipScale(direction);
        CheckCoffeeBean();
        ShootDirection();
        Entities();
        UpdateTrajectoryPoints();
        TrajectoryVisibility();

        //}
    }
    void IntializeTrajectoryPoints()
    {
        if (points.Length > 0)
        {
            for (int i = 0; i < points.Length; i++)
            {
                Destroy(points[i]);
            }
        }
        points = new GameObject[numberOfPoints];
        for (int i = 0; i < numberOfPoints; i++)
        {
            points[i] = Instantiate(pointPrefab, transform.position, Quaternion.identity, pointsContainer);
        }
    }
    void UpdateTrajectoryPoints()
    {
        ShootDirection();
        checkPoint.right = ShootDirection();
        for (int i = 1; i <= points.Length; i++)
        {
            points[i - 1].transform.position = PointPosition(i * .1f);
            SpriteRenderer sp = points[i - 1].GetComponent<SpriteRenderer>();
            Color color = sp.color;
            color.a = (float)1f / i;
            sp.color = color;
        }


    }
    Vector2 PointPosition(float p)
    {
        Vector2 currentPointPos = (Vector2)checkPoint.position + (ShootDirection() * shootForce * p) + .5f * Physics2D.gravity * (p * p);
        return currentPointPos;
    }
    void ApplyMovement()
    {
        if (isGrounded)
        {
            float targetVelocityX = movement.x * speed;
            float targetVelocityY = 0f;
            transform.Translate(new Vector2(targetVelocityX * Time.deltaTime, targetVelocityY));
        }
        else if (!isGrounded)
        {
            rb.velocity += new Vector2(movement.x * speed * 2f * Time.deltaTime, 0f);
        }
        if (movement.x != 0 && isGrounded)
        {
            //Run animation
            anim.SetBool("Move", true);

        }
        else if (movement.x == 0 && isGrounded)
        {
            //Idle animation
            anim.SetBool("Move", false);
        }
        else if (!isGrounded)
        {
            //Jump animation
        }
        head.GetChild(0).gameObject.SetActive(isGrabbing);
    }
    void InitialJumpPhysics()
    {
        rb.gravityScale = (2 * jumpHeight) / Mathf.Pow(timeToJumpApex, 2);
        initialVelocity = Mathf.Sqrt(2 * rb.gravityScale * jumpHeight);
    }
    void Jump()
    {
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            rb.velocity = Vector2.up * initialVelocity;
        }
        if (Input.GetKeyDown(KeyCode.Space) && !isGrounded && isGrabbing && canDoubleJump)
        {
            bool itsaBean = false;
            //bool itsaBean= this.coffeeBean.GetComponent<BeanBehaviour>();
            if (itsaBean)
            {
                rb.velocity = Vector2.up * initialVelocity;
                isGrabbing = false;
                //GameManager.instance.RemovePlayer(this.coffeeBean);
                for (int i = 0; i < brokenEffects.Length; i++)
                {
                    Transform ps = Instantiate(brokenEffects[i].transform, this.coffeeBean.transform.position, Quaternion.identity);
                    Destroy(ps.gameObject, 2f);
                }
                Destroy(this.coffeeBean.gameObject);
                canDoubleJump = false;
            }
        }
    }
    void FlipScale(float xInput)
    {
        transform.localScale = (xInput > 0) ? new Vector2(.65f, transform.localScale.y) : new Vector2(-.65f, transform.localScale.y);
    }
    void FlipSprite(float xInput)
    {
        _spr.flipX = (xInput >= 0) ? false : true;
    }
    void RotateHead(float input)
    {
        Vector3 eulers = new Vector3(0, 0, -input * headRotSpeed);
        Quaternion rotation = Quaternion.Lerp(head.rotation, Quaternion.Euler(eulers), Time.deltaTime * 5f);
        head.rotation = rotation;
    }
    void CheckGround()
    {
        float distance = castGroundDistance;
        float sizeX = boxCollider2d.bounds.size.x;
        float left = boxCollider2d.bounds.center.x - boxCollider2d.bounds.size.x / 2;
        float bottom = boxCollider2d.bounds.center.y - boxCollider2d.bounds.size.y / 2;
        Vector2 bottomLeft = new Vector2(left, bottom);
        for (int i = 0; i < numberOfRays; i++)
        {

            Vector2 origin = new Vector2(bottomLeft.x + i * (sizeX / numberOfRays), bottomLeft.y);
            Vector2 direction = -transform.up;

            Ray2D ray = new Ray2D(origin, direction);
            rays.Add(ray);
            Debug.DrawRay(rays[i].origin, rays[i].direction * distance, Color.blue);

        }

        for (int i = 0; i < rays.Count; i++)
        {
            RaycastHit2D hit;
            hit = Physics2D.Raycast(rays[i].origin, rays[i].direction, distance, groundLayer);
            hits.Add(hit);
        }
        if (hits[0] || hits[1] || hits[2] || hits[3] || hits[hits.Count - 1])
            isGrounded = true;
        else isGrounded = false;

        rays.Clear();
        hits.Clear();

    }
    void CheckCoffeeBean()
    {
        //if there is a bean detected, the player can grab it then
        Collider2D beanCollider = Physics2D.OverlapCircle(checkPoint.position, checkRadius, beanLayer);

        if (!isGrabbing && beanCollider != null)
        {
            //Show a key ui for grabbing the bean 
            ShowEntity(grabEntity);

            //Attach the bean to a stored object
            this.coffeeBean = beanCollider.transform;
        }
        else
        {
            //Hide a key ui for grabbing the bean
            HideEntity(grabEntity);

        }

        if (this.coffeeBean != null)
        {

            //big throw 
            if (Input.GetMouseButtonDown(0) && isGrabbing)
            {
                if (ShootDirection().x < 0 && direction < 0)
                {
                    isGrabbing = false;
                    isThrowing = true;
                }
                else if (ShootDirection().x > 0 && direction > 0)
                {
                    isGrabbing = false;
                    isThrowing = true;
                }
            }


            if (isThrowing)
            {
                Shoot(this.coffeeBean);
                return;
            }

            //Grab with a key
            if (Input.GetKeyDown(KeyCode.E) && !isGrabbing)
            {
                isGrabbing = true;
                canDoubleJump = true;

            }
            else if (Input.GetKeyDown(KeyCode.E) && isGrabbing)
            {
                isGrabbing = false;
                canDoubleJump = false;
            }

            if (isGrabbing && !isThrowing)
                Grab(this.coffeeBean);
            else if (!isGrabbing && !isThrowing)
                ThrowBean(this.coffeeBean);

        }
    }
    public void TrajectoryVisibility()
    {
        if (ShootDirection().x < 0 && direction < 0 && isGrabbing)
        {
            pointsContainer.gameObject.SetActive(true);
        }
        else if (ShootDirection().x > 0 && direction > 0 && isGrabbing)
        {
            pointsContainer.gameObject.SetActive(true);
        }
        else
        {
            pointsContainer.gameObject.SetActive(false);
        }
    }
    public void Entities()
    {

        if (isGrabbing)
        {
            HideEntity(grabEntity);
            ShowEntity(throwEntity);
            ShowEntity(shootEntity);
        }
        else
        {
            HideEntity(throwEntity);
            HideEntity(shootEntity);
        }
        if (isThrowing)
        {
            HideEntity(throwEntity);
            HideEntity(shootEntity);
        }
        //if (GameManager.instance.coffeeBeans.Count > 1)
        //{
        //    ShowEntity(tabSwitchEntity);
        //}
        //else
        //    HideEntity(tabSwitchEntity);
    }
    void HideEntity(GameObject entity)
    {
        entity.SetActive(false);
    }
    void ShowEntity(GameObject entity)
    {
        entity.SetActive(true);
    }
    void Grab(Transform coffeeBean)
    {
        //if (this.coffeeBean.GetComponent<EnemyBehaviour>() != null)
        //    this.coffeeBean.GetComponent<EnemyBehaviour>().isGrabbed = true;
        //if (this.coffeeBean.GetComponent<BeanBehaviour>() != null)
        //    this.coffeeBean.GetComponent<BeanBehaviour>().isGrabbed = true;
        this.coffeeBean.GetComponent<Rigidbody2D>().gravityScale = 0;
        this.coffeeBean.position = checkPoint.position;
        this.coffeeBean.SetParent(container);
    }
    void ThrowBean(Transform coffeeBean)
    {
        //if (this.coffeeBean.GetComponent<EnemyBehaviour>() != null)
        //    this.coffeeBean.GetComponent<EnemyBehaviour>().isGrabbed = false;
        //if (this.coffeeBean.GetComponent<BeanBehaviour>() != null)
        //    this.coffeeBean.GetComponent<BeanBehaviour>().isGrabbed = false;
        isGrabbing = false;
        this.coffeeBean = coffeeBean;
        this.coffeeBean.GetComponent<Rigidbody2D>().gravityScale = 1;
        this.container.DetachChildren();
        this.coffeeBean = null;

    }
    void Shoot(Transform coffeeBean)
    {

        //Addforce to the projectile
        this.coffeeBean = coffeeBean;
        Rigidbody2D rb = this.coffeeBean.GetComponent<Rigidbody2D>();
        rb.gravityScale = 1;
        rb.velocity = checkPoint.right * shootForce;
        rb.AddTorque(torqueSpeed, ForceMode2D.Force);
        this.container.DetachChildren();
        this.coffeeBean = null;
        isThrowing = false;

    }
    Vector2 ShootDirection()
    {
        mousePos = cam.ScreenToWorldPoint(Input.mousePosition);
        return (mousePos - (Vector2)checkPoint.position).normalized;
    }
    private void OnDrawGizmos()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(checkPoint.position, checkRadius);
    }
    Quaternion LerpRotation(Transform player, float x, float y, float z)
    {
        return player.rotation = Quaternion.Lerp(player.rotation, Quaternion.Euler(new Vector3(x, y, z)), Time.deltaTime * 5f);
    }


}
