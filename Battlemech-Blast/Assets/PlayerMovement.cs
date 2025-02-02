using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DG.Tweening;
using Photon.Pun;
using Cinemachine;



public class PlayerMovement : MonoBehaviour
{

    private AudioSource audioSource;
    private PhotonView view;
    private Animator animator;
    private Rigidbody2D rb;

    public Canvas canvas;
    public GameObject pilot;
    public Transform gunPos;
    public Transform cursor;
    public Transform weapon;
    public Transform minimapPlayer;
    public VariableJoystick movementJoystick;
    public VariableJoystick aimJoystick;



    #region PUBILC_VARIABLES

    public float moveSpeed = 2f;
    public float cursorSpeed = 2f;
    public float coolDown;
    public float boostForce;
    public float flipDuration = .2f;

    #endregion

    #region PRIVATE_VARIABLES

    private Vector2 movement;
    private Vector2 mousePos;
    private Vector2 startScale;

    private float maxSpeed;
    private float timeToBoost;

    //Directions
    int lastMovementDirection;
    int lastWeaponDirection;
    int movementDirection;
    int weaponDirection;

    #endregion


    void Start()
    {
        view = GetComponent<PhotonView>();
        startScale = new Vector2(transform.localScale.x, transform.localScale.y);


        if (view.IsMine)
        {
            audioSource = GetComponent<AudioSource>();
            rb = GetComponent<Rigidbody2D>();
            animator = GetComponent<Animator>();





            cursor.gameObject.SetActive(true);
            canvas.gameObject.SetActive(true);
            maxSpeed = moveSpeed;
            lastMovementDirection = 1;
            lastWeaponDirection = 1;


        }
        else
        {
            canvas.gameObject.SetActive(false);
            cursor.gameObject.SetActive(false);
        }

    }

    void Update()
    {


    }

    [PunRPC]
    public void RPC_Space()
    {
        Debug.Log("space with " + this.gameObject.name);
    }

    private void Cursor()
    {
        cursor.position = Vector3.Lerp(cursor.position, mousePos, cursorSpeed * Time.deltaTime);
    }



    private void FixedUpdate()
    {
        if (view.IsMine)
        {
            switch (PlayerInstantiator.Instance.controllerState)
            {
                case PlayerInstantiator.Controller.Keyboard:
                    mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
                    Vector2 lookDir = (mousePos - rb.position).normalized;
                    int flipDirection = (lookDir.x > 0) ? 1 : -1;
                    MovePlayer(new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical")), lookDir, flipDirection);
                    //Deactivate joysticks

                    break;
                case PlayerInstantiator.Controller.Joystick:


                    MovePlayer(movementJoystick.Direction, aimJoystick.Direction, movementDirection);
                    break;
                default:
                    break;
            }
        }


    }
    void MovePlayer(Vector2 movement, Vector2 lookDir, int flipDirection)
    {

        Cursor();
        RotateMapCursor(lookDir);

        if (movement.y != 0 || movement.x != 0)
        {
            if (!audioSource.isPlaying)
            {
                audioSource.volume = Random.Range(.14f, .4f);
                audioSource.Play();
            }
            animator.SetTrigger("Moving");
            animator.SetBool("Idle", false);

            if (movement.x > 0)
                lastMovementDirection = 1;
            else if (movement.x < 0)
                lastMovementDirection = -1;

        }
        else if (movement.y == 0 && movement.x == 0)
        {
            audioSource.Stop();
            animator.SetBool("Idle", true);
        }
        rb.MovePosition((Vector2)transform.position + movement * moveSpeed * Time.fixedDeltaTime);


        if (lookDir.x != 0)
        {
            if (lookDir.x > 0 && movementDirection > 0)
                lastWeaponDirection = 1;
        }




        if (lookDir.x > 0)
            weaponDirection = 1;
        else if (lookDir.x < 0)
            weaponDirection = -1;
        else
            weaponDirection = lastWeaponDirection;

        if (movement.x > 0)
            movementDirection = 1;
        else if (movement.x < 0)
            movementDirection = -1;
        else
        {
            movementDirection = lastMovementDirection;
        }


        FlipPlayer(flipDirection);

        float angle = Mathf.Atan2(lookDir.y * weaponDirection, lookDir.x * weaponDirection) * Mathf.Rad2Deg;
        weapon.eulerAngles = new Vector3(weapon.eulerAngles.x, weapon.eulerAngles.y, (angle));


    }

    public int GetShootingDirection(Vector2 lookDir)
    {
        int weaponDirection;
        if (lookDir.x > 0 && movementDirection > 0)
            weaponDirection = 1;
        else if (lookDir.x < 0 && movementDirection < 0)
            weaponDirection = -1;
        else if (lookDir.x > 0 && movementDirection < 0)
            weaponDirection = -1;
        else
            weaponDirection = lastWeaponDirection;
        return weaponDirection;

    }
    void FlipPlayer(int lookDir)
    {
        Vector2 newScale = new Vector3(Mathf.Abs(startScale.x) * lookDir, transform.localScale.y, 1f);
        transform.DOScale(newScale, flipDuration);
    }

    void RotateMapCursor(Vector2 lookDir)
    {
        float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg;
        minimapPlayer.eulerAngles = (new Vector3(weapon.eulerAngles.x, weapon.eulerAngles.y, (angle - 90f)));

    }

    void RotateCharacter()
    {
        DOTween.Sequence()
            .Append(transform.DORotate(new Vector3(0f, 0f, 30f), 1f))
            .Append(transform.DORotate(new Vector3(0f, 0f, -30f), 1f)).Loops();
    }
}
