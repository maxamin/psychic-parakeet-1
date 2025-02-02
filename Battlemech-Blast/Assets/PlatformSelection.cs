using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;


public class PlatformSelection : MonoBehaviour
{

    [SerializeField] private Toggle mobileToggle;
    [SerializeField] private bool isMobileOn;


    private void OnEnable()
    {

    }
    void Start()
    {
        mobileToggle.onValueChanged.AddListener(delegate {
            CheckMobileSwitcher(mobileToggle);
        });
    }
    void CheckMobileSwitcher(Toggle toggle)
    {
        if (toggle.isOn)
        {
            PlayerInstantiator.Instance.controllerState = PlayerInstantiator.Controller.Joystick;
        }
        else
        {
            PlayerInstantiator.Instance.controllerState = PlayerInstantiator.Controller.Keyboard;
        }
    }
    void Update()
    {

    }
}
