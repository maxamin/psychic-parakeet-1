using Photon.Pun;
using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Shooting : MonoBehaviour
{
    public static Shooting instance;

    #region COMPONENTS

    private Animator anim;
    private PhotonView view;
    private GameObject gunBtn;


    public Weapon weapon;


    #endregion


    void Awake()
    {
        instance = this;
    }

    private void OnEnable()
    {
    }

    void Start()
    {
        view = GetComponent<PhotonView>();
        anim = GetComponent<Animator>();

    }

    void Update()
    {


    }

}
