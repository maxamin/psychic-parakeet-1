using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using Photon.Pun;
using UnityEngine.UI;

public class ConnectToServer : MonoBehaviourPunCallbacks
{
    public Slider progress;

    void Start()
    {

        //PhotonNetwork.ConnectUsingSettings();

    }

    //public override void OnConnectedToMaster()
    //{
    //    PhotonNetwork.JoinLobby();
    //}
     void Update()
    {
        if (progress.value == 1)
        {
            SceneManager.LoadScene("MainMenu");
        }
    }
}
