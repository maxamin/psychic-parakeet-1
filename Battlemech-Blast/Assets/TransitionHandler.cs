using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;
using Photon.Pun;

public class TransitionHandler : MonoBehaviour
{
    public static TransitionHandler Instance;

    public Image switchingImage;
    public float duration = .3f;
    public float mapChangingDelay = 2f;
    private void Awake()
    {
        if (Instance == null)
        {
            Instance = this;
            DontDestroyOnLoad(Instance);
        }
    }

    void Start()
    {

    }

    public void InTransition()
    {
        switchingImage.DOFillAmount(1, duration);
    }
    public void OutTransition()
    {
        switchingImage.DOFillAmount(0, duration);
    }
    public void MapSwitchingCoroutine(GameObject collision)
    {
        StartCoroutine(SwitchMapTransition(collision));
    }
    public IEnumerator SwitchMapTransition(GameObject collision)
    {
        InTransition();
        yield return new WaitForSeconds(mapChangingDelay);
        PlayerPhotonManager.Instance.SwitchMap(collision.GetComponent<DoorManager>().nextScene);
        yield return new WaitForSeconds(mapChangingDelay);
        OutTransition();
    }
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.I))
        {
            InTransition();
        }
        if (Input.GetKeyDown(KeyCode.O))
        {
            OutTransition();
        }
    }
}
