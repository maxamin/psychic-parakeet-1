using System.Collections;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;

public class PlayerAttackController : MonoBehaviour
{

    public static PlayerAttackController Instance;

    #region COMPONENTS

    [HideInInspector] public Animator anim;
    [HideInInspector] public PhotonView view;
    [HideInInspector] public GameObject gunBtn;
    [HideInInspector] public Quaternion rotation;

    public IWeapon myWeapon;



    public IFireable fireableWeapon;
    public IThrowable throwableWeapon; //It's one time use item
    public IExplodeable explodableWeapon; //It's one time use item
    public Weapon weapon;
    public GameObject bullet;
    public Transform firePoint;
    public Transform bombPlacement;
    public Transform weaponContainer;
    public GameObject gunPrefab;
    public Text t_currentAmmo;
    public Transform knifeHurtPoint;
    public LayerMask TargetLayer;
    public LayerMask UILayerMask;
    public Button attackButton;
    public Button reloadButton;
    public Slider taskTimeSlider;
    public GameObject bombPreviewGO;
    public Bomb bomb;

    #endregion



    //New Shooting controller v0.2
    public Action AttackAction;
    public Action ReloadAction;
    public Action<float, float> OnTimeElapsing;
    public Action OnSliderUpdated;


    private void Awake()
    {
        Instance = this;

    }
    private void Start()
    {
        view = GetComponent<PhotonView>();
        anim = GetComponent<Animator>();

        OnTimeElapsing += UpdateSlider;
        OnSliderUpdated += SliderUpdated;
        //attackButton.onClick.AddListener(() => Shoot());

    }
    private void Update()
    {
        if (!view.IsMine)
            return;
        if (this.view.CreatorActorNr != PhotonNetwork.LocalPlayer.ActorNumber)
            return;



        Shoot();
        Reload();

        if (weapon != null)
        {

            t_currentAmmo.text = myWeapon.CurrentAmmo.ToString() + " / " + myWeapon.Capacity.ToString();
        }
        else
            t_currentAmmo.text = "";

    }


    #region BOMB_PLANTING
    public void UpdateSlider(float value, float workTime)
    {

        taskTimeSlider.gameObject.SetActive(true);
        taskTimeSlider.value = value / workTime;

    }
    public void SliderUpdated()
    {
        taskTimeSlider.gameObject.SetActive(false);
    }
    public void PlantBomb()
    {
        view.RPC("RPC_PlantBomb", RpcTarget.AllBuffered, (Vector2)bombPlacement.position, Quaternion.identity);
    }

    #endregion

    public void FireWeapon()
    {

        if (Physics2D.Raycast(Vector2.zero, Camera.main.ScreenToWorldPoint(Input.mousePosition), Mathf.Infinity, UILayerMask))
            return;
        Vector2 lookDir;
        int weaponDirection;

        if (PlayerInstantiator.Instance.controllerState == PlayerInstantiator.Controller.Joystick)
        {
            lookDir = JoystickLookingDiretion();
            weaponDirection = GetComponent<PlayerMovement>().GetShootingDirection(JoystickLookingDiretion());
        }
        else if (PlayerInstantiator.Instance.controllerState == PlayerInstantiator.Controller.Keyboard)
        {
            lookDir = MouseLookingDiretion();
            weaponDirection = (MouseLookingDiretion().x > 0) ? 1 : -1;
        }
        else
        {
            lookDir = Vector2.zero;
            weaponDirection = 1;
        }

        Vector2 spawnPos = firePoint.position;
        rotation = Quaternion.Euler(rotation.x, rotation.y, WeaponShootingAngle(lookDir, weaponDirection));


        view.RPC("RPC_Shoot", RpcTarget.AllBuffered, weaponDirection, spawnPos, rotation, firePoint.right);

    }

    //Get Shooting Angle
    public float WeaponShootingAngle(Vector2 lookDir, int weaponDirection)
    {
        return Mathf.Atan2(lookDir.y * weaponDirection, lookDir.x * weaponDirection) * Mathf.Rad2Deg;
    }
    public Vector2 MouseLookingDiretion()
    {
        return (Camera.main.ScreenToWorldPoint(Input.mousePosition) - transform.position).normalized;
    }
    public Vector2 JoystickLookingDiretion()
    {
        return GetComponent<PlayerMovement>().aimJoystick.Direction.normalized;
    }

    //Shooting
    public void Shoot()
    {
        if (IsRiffleShooting() || IsThrowingWeapon())
            AttackAction.Invoke();
    }

    //Reloading
    private void Reload()
    {
        if (Input.GetKeyDown(KeyCode.R))
            ReloadAction.Invoke();
    }
    public void JoystickReload()
    {
        ReloadAction.Invoke();
    }


    //Check Throwing
    public bool IsThrowingWeapon()
    {
        if (Input.GetMouseButtonDown(0))
            return true;
        else return false;
    }

    //Check Shooting
    public bool IsRiffleShooting()
    {
        switch (PlayerInstantiator.Instance.controllerState)
        {
            case PlayerInstantiator.Controller.Keyboard:
                return Input.GetMouseButton(0);
            case PlayerInstantiator.Controller.Joystick:
                return (int)GetComponent<PlayerMovement>().aimJoystick.Direction.magnitude > 0;
            default:
                return false;
        }
    }
    public bool IsSpecialWeaponShooting()
    {
        switch (PlayerInstantiator.Instance.controllerState)
        {
            case PlayerInstantiator.Controller.Keyboard:
                return Input.GetMouseButtonDown(0);
            case PlayerInstantiator.Controller.Joystick:
                return (int)(GetComponent<PlayerMovement>().aimJoystick.Direction.magnitude) > 0;
            default:
                return false;
        }
    }


    //Throw Weapon

    public void ThrowWeapon()
    {

        if (Physics2D.Raycast(Vector2.zero, Camera.main.ScreenToWorldPoint(Input.mousePosition), Mathf.Infinity, UILayerMask))
            return;
        Vector2 lookDir;
        int weaponDirection;

        if (PlayerInstantiator.Instance.controllerState == PlayerInstantiator.Controller.Joystick)
        {
            lookDir = JoystickLookingDiretion();
            weaponDirection = GetComponent<PlayerMovement>().GetShootingDirection(JoystickLookingDiretion());
        }
        else if (PlayerInstantiator.Instance.controllerState == PlayerInstantiator.Controller.Keyboard)
        {
            lookDir = MouseLookingDiretion();
            weaponDirection = (MouseLookingDiretion().x > 0) ? 1 : -1;
        }
        else
        {
            lookDir = Vector2.zero;
            weaponDirection = 1;
        }

        Vector2 spawnPos = firePoint.position;
        Vector2 endPoint = Camera.main.ScreenToWorldPoint(Input.mousePosition);
        view.RPC("RPC_ThrowWeapon", RpcTarget.AllBuffered, spawnPos, endPoint, weaponDirection);

    }


    #region RPC_CALLBACK


    [PunRPC]
    public void RPC_PlantBomb(Vector2 spawnPos, Quaternion rotation)
    {
        GameObject projectile = Instantiate(weapon.GetComponent<WeaponUnit>().bulletPrefab,
            spawnPos,
            rotation);
        bomb = projectile.GetComponent<Bomb>();
        bomb.myOwner = view;
    }

    [PunRPC]
    public void RPC_Shoot(int dir, Vector2 spawnPos, Quaternion rotation, Vector3 right)
    {

        GameObject projectile = Instantiate(weapon.GetComponent<WeaponUnit>().bulletPrefab, spawnPos, rotation);
        projectile.GetComponent<Bullet>().myOwner = view;
        projectile.GetComponent<Bullet>().weapon = weapon;
        float initialScale = projectile.transform.localScale.x;
        float spriteScale = (transform.localScale.x > 0) ? Mathf.Abs(initialScale) : -initialScale;
        projectile.transform.localScale = new Vector2(spriteScale, projectile.transform.localScale.y);
        projectile.transform.localRotation = rotation;

        Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
        rb.AddForce(right * dir * fireableWeapon.Speed, ForceMode2D.Impulse);


    }

    [PunRPC]
    public void RPC_ThrowWeapon(Vector2 spawnPos, Vector2 endPoint, int dir)
    {
        Quaternion rotation = weapon.GetComponent<WeaponUnit>().bulletPrefab.transform.rotation;
        GameObject projectile = Instantiate(weapon.GetComponent<WeaponUnit>().bulletPrefab, spawnPos, rotation);
        ThrowableWeapon throwWeapon = projectile.GetComponent<ThrowableWeapon>();
        throwWeapon.myOwner = view;

        float initialScale = projectile.transform.localScale.x;
        float spriteScale = (transform.localScale.x > 0) ? Mathf.Abs(initialScale) : -initialScale;
        projectile.transform.localScale = new Vector2(spriteScale, projectile.transform.localScale.y);
        projectile.transform.localRotation = rotation;

        Rigidbody2D rb = projectile.GetComponent<Rigidbody2D>();
        //Add force to the projectile

        projectile.GetComponent<ThrowableWeapon>().ProjctileMovement(endPoint, rb, dir);
        //Destroy when hit cursor position


        Vector2 target = endPoint - spawnPos;
        rb.AddForce(target.normalized * target.x * dir * throwableWeapon.ShootForce, ForceMode2D.Impulse);
        rb.AddTorque(throwableWeapon.TorqueSpeed, ForceMode2D.Force);

        //Detach Weapon from container


    }



    #endregion


}
