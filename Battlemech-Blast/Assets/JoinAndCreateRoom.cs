using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;

public class JoinAndCreateRoom : MonoBehaviourPunCallbacks
{

    public InputField joinInputField;
    public InputField createInputField;

    public void CreateRoom()
    {
        PhotonNetwork.CreateRoom(createInputField.text);
    }

    public void JoinRoom()
    {
        PhotonNetwork.JoinRoom(joinInputField.text);
    }


    public override void OnJoinedRoom()
    {
        //PhotonNetwork.CurrentRoom.IsOpen = false;
        //PhotonNetwork.CurrentRoom.IsVisible = false;

        //PhotonNetwork.LoadLevel("Gamescene");
    }


}
