using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 2f;
    public float cursorSpeed = 2f;
    private float maxSpeed;

    public Rigidbody2D rb;
    public Animator animator;
    public Transform gunPos;
    public Transform cursor;
    Transform targetMap;
    AudioSource audioSource;


    private Vector2 movement;
    private Vector2 mousePos;

    void Start()
    {


        //targetMap = GameHandler.instance.mapTarget;
        maxSpeed = moveSpeed;


        FindObjectOfType<Cinemachine.CinemachineVirtualCamera>().Follow = transform;
        audioSource = GetComponent<AudioSource>();

    }

    private void Cursor()
    {
        cursor.position = Vector3.Lerp(cursor.position, mousePos, cursorSpeed * Time.deltaTime);
    }
    void Update()
    {



        movement.x = Input.GetAxisRaw("Horizontal");
        movement.y = Input.GetAxisRaw("Vertical");

        mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Cursor();
        RotateMapCursor();

        if (movement.y != 0 || movement.x != 0)
        {
            if (!audioSource.isPlaying)
            {
                audioSource.volume = Random.Range(.14f, .4f);
                audioSource.Play();
            }
            animator.SetTrigger("Moving");
            animator.SetBool("Idle", false);
        }
        else if (movement.y == 0 && movement.x == 0 && !this.gameObject.GetComponent<Attacking>().isFiring)
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
    public Transform weapon;
    public Transform minimapPlayer;
    public float coolDown;
    public float boostForce;
    private float timeToBoost;
    IEnumerator Boost(float delay)
    {
        animator.SetTrigger("Boost");
        yield return new WaitForSeconds(delay);
        Vector2 direction = mousePos - rb.position;
        rb.AddForce(direction * boostForce, ForceMode2D.Force);
        timeToBoost = coolDown;
    }
    private void FixedUpdate()
    {
        MovePlayer();

    }
    public float flipDuration = .2f;
    void MovePlayer()
    {

        rb.MovePosition((Vector2)transform.position + movement * moveSpeed * Time.fixedDeltaTime);

        Vector2 lookDir = (mousePos - rb.position).normalized;
        int dir = (lookDir.x > 0) ? 1 : -1;

        FlipPlayer(dir);

        float angle = Mathf.Atan2(lookDir.y * dir, lookDir.x * dir) * Mathf.Rad2Deg;
        weapon.eulerAngles = (new Vector3(weapon.eulerAngles.x, weapon.eulerAngles.y, (angle)));
        Debug.Log(" dir Y " + lookDir.y + " dir X " + lookDir.x);

    }

    void FlipPlayer(int lookDir)
    {
        Vector2 newScale = new Vector2(Mathf.Abs(.5f) * lookDir, transform.localScale.y);
        transform.DOScale(newScale, flipDuration);
    }
    void RotateMapCursor()
    {
        Vector2 lookDir = (mousePos - rb.position).normalized;
        int dir = (lookDir.x > 0) ? 1 : -1;

        float angle = Mathf.Atan2(lookDir.y * dir, lookDir.x * dir) * Mathf.Rad2Deg;
        minimapPlayer.eulerAngles = (new Vector3(minimapPlayer.eulerAngles.x, minimapPlayer.eulerAngles.y, (angle)));
        Debug.Log(" dir Y " + lookDir.y + " dir X " + lookDir.x);

    }

}
