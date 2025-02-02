using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro; 
public class AuthenticatorPass : MonoBehaviour
{
    public string myUsername { get; private set; }
    public TextMeshProUGUI loginStatus;
    [SerializeField] private InputField usernameInput;

    void Start()
    {
        //Load username and wax wallet
        LoadAuth();
         

    }
    public void LoginAuthenticator()
    {
        GUIManager.instance.ModeSelectionPanel.SetActive(true);
        this.gameObject.SetActive(false);
        SaveAuth(usernameInput.text);
    }

    public void SaveAuth(string username )
    {
        PlayerPrefs.SetString("Username", username); 
    }

    public void LoadAuth()
    {
        if (PlayerPrefs.HasKey("Username"))
        {
            myUsername = PlayerPrefs.GetString("Username");
            usernameInput.text = myUsername;
        }   
    }
}
