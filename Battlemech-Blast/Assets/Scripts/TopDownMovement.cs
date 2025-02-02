using Photon.Pun;
using System.Collections;
using UnityEngine;

public class TopDownMovement : MonoBehaviour
{

    [Header("Components")]
    private Transform targetMap;
    private PhotonView view;
    private AudioSource audioSource;

    public Rigidbody2D rb;
    public Animator animator;




    public GameObject pilot;
    public Transform gunPos;
    public Transform cursor;

    [Header("Variables")]
    private float timeBtwAttacks;
    public float moveSpeed = 2f;
    public float cursorSpeed = 2f;
    private float maxSpeed;
    private Vector2 movement;
    private Vector2 mousePos;

    [Header("Boost")]
    public float coolDown;
    public float boostForce;
    private float timeToBoost;

    void Start()
    {
        view = GetComponent<PhotonView>();
        targetMap = GameHandler.instance.mapTarget;
        maxSpeed = moveSpeed;
        audioSource = GetComponent<AudioSource>();

        if (view.IsMine)
        {
            GameHandler.instance.playerTransform = this.transform;
            cursor.gameObject.SetActive(true);
        }
        else
        {
            cursor.gameObject.SetActive(false);
        }


#if UNITY_EDITOR

        //cursor.gameObject.SetActive(true);
#endif
    }

    private void Cursor()
    {
        cursor.position = Vector3.Lerp(cursor.position, mousePos, cursorSpeed * Time.deltaTime);
    }
    void Update()
    {
        if (view.IsMine)
        {

            movement.x = Input.GetAxisRaw("Horizontal");
            movement.y = Input.GetAxisRaw("Vertical");

            mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            Cursor();


            if (movement.y != 0 || movement.x != 0)
            {
                if (!audioSource.isPlaying)
                {
                    audioSource.volume = Random.Range(.1f, .4f);
                    audioSource.Play();
                }
                animator.SetTrigger("Moving");
                animator.SetBool("Idle", false);
            }
            else if (movement.y == 0 || movement.x == 0)
            {
                audioSource.Stop();
                animator.SetBool("Idle", true);
            }
            if (timeToBoost <= 0)
            {
                if (Input.GetKeyDown(KeyCode.Space))
                {
                    StartCoroutine(Boost(.15f));
                }
            }
            else
            {
                timeToBoost -= Time.deltaTime;
            }
        }

#if UNITY_EDITOR
        #region editor
        //movement.x = Input.GetAxisRaw("Horizontal");
        //movement.y = Input.GetAxisRaw("Vertical");

        //mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        //Cursor();

        //if (movement.y != 0 || movement.x != 0)
        //{
        //    SoundManager.PlaySound("footsteps");
        //    animator.SetTrigger("Moving");
        //    animator.SetBool("Idle", false);
        //}
        //else if (movement.y == 0 || movement.x == 0)
        //{
        //    SoundManager.ExitSound();
        //    animator.SetBool("Idle", true);
        //}


        //if (timeToBoost <= 0)
        //{
        //    if (Input.GetKeyDown(KeyCode.Space))
        //    {
        //        StartCoroutine(Boost(.15f));
        //    }
        //}
        //else
        //{
        //    timeToBoost -= Time.deltaTime;
        //}
        #endregion
#endif

    }

    IEnumerator Boost(float delay)
    {
        animator.SetTrigger("Boost");
        yield return new WaitForSeconds(delay);
        Vector2 direction = mousePos - rb.position;
        rb.AddForce(direction * boostForce * Time.deltaTime, ForceMode2D.Force);
        timeToBoost = coolDown;
    }
    private void FixedUpdate()
    {
        if (view.IsMine)
        {
            RotatePlayer();

        }
#if UNITY_EDITOR

        RotatePlayer();

#endif


    }
    void RotatePlayer()
    {

        rb.MovePosition(rb.position + movement * moveSpeed * Time.fixedDeltaTime);

        Vector2 lookDir = mousePos - rb.position;
        float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg - 90f;
        rb.rotation = angle;
        targetMap.rotation = Quaternion.Euler(targetMap.rotation.x, targetMap.rotation.y, angle);
        Debug.DrawLine(gunPos.position, mousePos, Color.green);
    }
}
