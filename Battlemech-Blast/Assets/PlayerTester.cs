using System;
using DG.Tweening;
using Photon.Pun;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class PlayerTester : MonoBehaviour
{

    private AudioSource audioSource;
    private Animator animator;
    private Rigidbody2D rb;

    public Canvas canvas;
    public Transform gunPos;
    public Transform cursor;
    public IExplodeable explodeable;


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

    public Transform bombPlacement;

    public Action AttackAction;
    public Action ReloadAction;
    private Quaternion rotation;
    public Transform weaponTransform;
    public GameObject bombPreviewGO;
    public Weapon weapon;

    void Start()
    {
        startScale = new Vector2(transform.localScale.x, transform.localScale.y);


        audioSource = GetComponent<AudioSource>();
        rb = GetComponent<Rigidbody2D>();
        animator = GetComponent<Animator>();





        cursor.gameObject.SetActive(true);
        canvas.gameObject.SetActive(true);
        maxSpeed = moveSpeed;
        lastMovementDirection = 1;
        lastWeaponDirection = 1;



    }

    void Update()
    {


        Shoot();
        TestRadius();

    }


    public float Radius = .5f;
    
    void TestRadius()
    {
        for (int i = 0; i < 30; i++)
        {
            Vector2 next = transform.position;
            float angle = Mathf.Atan2(next.y+Radius, transform.position.x + Radius);
            angle *= i;
            next = transform.position * angle;
            Debug.DrawLine(transform.position, next, Color.red);
        }
    }

    private void Shoot()
    {
        if (AttackAction != null)
            AttackAction.Invoke();
        else
            Debug.Log("Shoot is null");

    }
    public void PlantBomb()
    {
        RPC_PlantBomb(new Vector2(transform.position.x + 1f, transform.position.y), rotation);

    }
    public void RPC_PlantBomb(Vector2 spawnPos, Quaternion rotation)
    {
        GameObject projectile = Instantiate(weapon.GetComponent<WeaponUnit>().bulletPrefab, spawnPos, rotation);
    }
    private void Cursor()
    {
        cursor.position = Vector3.Lerp(cursor.position, mousePos, cursorSpeed * Time.deltaTime);
    }



    private void FixedUpdate()
    {
        mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        Vector2 lookDir = (mousePos - rb.position).normalized;
        int flipDirection = (lookDir.x > 0) ? 1 : -1;
        MovePlayer(new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical")), lookDir, flipDirection);
        //Deactivate joysticks
    }
    void MovePlayer(Vector2 movement, Vector2 lookDir, int flipDirection)
    {

        Cursor();
        RotateMapCursor(lookDir);

        if (movement.y != 0 || movement.x != 0)
        {
            if (!audioSource.isPlaying)
            {
                audioSource.volume = UnityEngine.Random.Range(.14f, .4f);
                audioSource.Play();
            }
            animator.SetTrigger("Moving");
            animator.SetBool("Idle", false);
            RotateCharacter();

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
        weaponTransform.eulerAngles = new Vector3(weaponTransform.eulerAngles.x, weaponTransform.eulerAngles.y, (angle));


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
        //float angle = Mathf.Atan2(lookDir.y, lookDir.x) * Mathf.Rad2Deg;
        //minimapPlayer.eulerAngles = (new Vector3(weapon.eulerAngles.x, weapon.eulerAngles.y, (angle - 90f)));

    }

    void RotateCharacter()
    {
        //DOTween.Sequence()
        //    .Append(transform.DORotate(new Vector3(0f, 0f, 30f), 1f))
        //    .Append(transform.DORotate(new Vector3(0f, 0f, -30f), 1f)).Loops();
    }
}
