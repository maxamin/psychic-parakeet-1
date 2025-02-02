using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Photon.Pun;

public class ControllerManager : MonoBehaviour
{
    public static ControllerManager Instance;


    private PhotonView photonV;

    public List<GameObject> mobileElements = new List<GameObject>();

    public bool fireInput;

    private void Awake()
    {
        if (Instance == null)
            Instance = this;


    }



    void Start()
    {
        photonV = GetComponent<PhotonView>();



        if (PlayerInstantiator.Instance.controllerState == PlayerInstantiator.Controller.Joystick)
        {
            for (int i = 0; i < mobileElements.Count; i++)
            {
                mobileElements[i].SetActive(true);
            }
        }
        else if (PlayerInstantiator.Instance.controllerState == PlayerInstantiator.Controller.Keyboard)
        {
            for (int i = 0; i < mobileElements.Count; i++)
            {
                mobileElements[i].SetActive(false);
            }
        }




    }



    void Update()
    {
        fireInput = Input.GetMouseButton(0);

        RocketInput();

    }

    public float throwTime = 3f;
    private float throwDelta;

    public bool RocketInput()
    {
        bool input = Input.GetKey(KeyCode.Space);
        bool timeToThrow = false;

        if (input)
            throwDelta += Time.deltaTime;
        else
            throwDelta= 0;


        if (throwDelta >= throwTime)
        {
            timeToThrow = true;
            throwDelta = 0;
        }
        return timeToThrow;
    }

}
