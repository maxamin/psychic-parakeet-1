using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Photon.Pun;

public class GUIManager : MonoBehaviour
{
    public static GUIManager instance;

    public enum GameMode
    {
        PVE,
        PVP
    }


    public GameMode gameMode;


    public Button _playerVsAI;
    public Button _playerVsPlayer;



    [Header("Authentication Panel")]
    public GameObject AuthPanel;


    [Header("Login Panel")]
    public GameObject LoginPanel;
    public GameObject LobbyPanel;

    [Header("Selection Panel")]
    public GameObject ModeSelectionPanel;
    public GameObject BattleHangerPanel;
    public GameObject BattleBankerPanel;


    public Transform _selectWarriorMenu;
    public Transform _pilotMenu;
    public Transform _mechMenu;
    public GameObject connectingStatus;

    public GameObject btnUnitTemplate;
    public GameObject pilotContainer;
    public GameObject mechContainer;


    public GameObject playerEntity;
    public List<PlayerData> playerDataList = new List<PlayerData>();



    void OnEnable()
    {
        SetActivePanel(ModeSelectionPanel.name);
    }
    void Awake()
    {
        if (instance == null)
            instance = this;

    }
    void Start()
    {
    }
    public void PlayGame(PlayerData battlemech)
    {
        if (gameMode == GameMode.PVE)
        {
            Debug.Log("<Color=Red><a>YOU SELECT </a></Color>" + battlemech.name);
            //StartCoroutine(PlayerInstantiator.instance.InstantiatePlayerPVE(battlemech, 1f, "Blast"));
        }
        else if (gameMode == GameMode.PVP)
        {
            Debug.Log("<Color=Red><a>YOU SELECT </a></Color>" + battlemech.name);

            PlayerInstantiator.Instance.InstantiatePlayerPVP(battlemech.name, "Blast");
        }
        SoundManager.PlaySound("buttonclick");
    }
    public void PlayerVSAI()
    {
        if (CharacterSelection.instance.selectedBattleMech == null)
            Debug.Log("You have to Select your character");
        else
        {
            gameMode = GameMode.PVE;
            Debug.Log(gameMode.ToString());
            ModeSelectionPanel.gameObject.SetActive(false);
            SoundManager.PlaySound("buttonclick");

            //PlayGame
            PlayGame(CharacterSelection.instance.selectedBattleMech);
        }
    }

    public void PlayerVSPlayer()
    {
        if (CharacterSelection.instance.selectedBattleMech == null)
            Debug.Log("You have to Select your character");
        else
        {
            gameMode = GameMode.PVP;
            if (PhotonNetwork.NetworkingClient.IsConnected)
            {
                Debug.Log("isConnected");
                LobbyPanel.SetActive(true);
                //connectingStatus.SetActive(true);
                LoginPanel.SetActive(false);
            }
            else
            {
                Debug.Log("isn't connected");
                LobbyPanel.SetActive(false);
                LoginPanel.SetActive(true);
                //connectingStatus.SetActive(true);
            }
            ModeSelectionPanel.gameObject.SetActive(false);
            Debug.Log(gameMode.ToString());
            SoundManager.PlaySound("buttonclick");

            //PlayGame
            PlayGame(CharacterSelection.instance.selectedBattleMech);
        }
    }
    public void BattleHanger()
    {
        LoginPanel.SetActive(false);
        BattleHangerPanel.gameObject.SetActive(true);
        _selectWarriorMenu.gameObject.SetActive(true);
        ModeSelectionPanel.gameObject.SetActive(false);
        Debug.Log("Select your character");
        SoundManager.PlaySound("buttonclick");
    }
    public void BattleBankers()
    {
        LoginPanel.SetActive(false);
        BattleBankerPanel.gameObject.SetActive(true);
        ModeSelectionPanel.gameObject.SetActive(false);
        Debug.Log("Battle Bankers!!");
        SoundManager.PlaySound("buttonclick");
    }
    public void SetActivePanel(string activePanel)
    {
        LoginPanel.SetActive(activePanel.Equals(LoginPanel.name));
        BattleHangerPanel.SetActive(activePanel.Equals(BattleHangerPanel.name));
        BattleBankerPanel.SetActive(activePanel.Equals(BattleBankerPanel.name));
        ModeSelectionPanel.SetActive(activePanel.Equals(ModeSelectionPanel.name));
        LobbyPanel.SetActive(activePanel.Equals(LobbyPanel.name));
        AuthPanel.SetActive(activePanel.Equals(AuthPanel.name));
    }

    public void InitializeUnits()
    {
        for (int i = 0; i < playerDataList.Count; i++)
        {
            GameObject mechBtn = Instantiate(btnUnitTemplate, mechContainer.transform);
            GameObject pilotBtn = Instantiate(btnUnitTemplate, pilotContainer.transform);

            InitializeMechUnit(mechBtn, playerDataList[i]);
            InitializePilotUnit(pilotBtn, playerDataList[i]);

            CharacterSelection.instance.AddButtonEvents(mechBtn.GetComponent<Button>(), pilotBtn.GetComponent<Button>());

        }
    }
    public void InitializeMechUnit(GameObject playerUnit, PlayerData data)
    {
        Unit unit = playerUnit.GetComponent<Unit>();
        unit.mechDataPrefab= data;
        unit.sprite = data.myMechSprite;
        unit.playerName = data.name;
        playerUnit.transform.GetChild(0).GetComponent<Text>().text = data.name;
        playerUnit.transform.GetChild(1).GetComponent<Image>().sprite = data.myMechSprite;
    }
    public void InitializePilotUnit(GameObject playerUnit, PlayerData data)
    {
        Unit unit = playerUnit.GetComponent<Unit>();
        unit.mechDataPrefab = data;
        unit.sprite = data.myPilotSprite;
        unit.playerName = data.name;
        playerUnit.transform.GetChild(0).GetComponent<Text>().text = data.name;
        playerUnit.transform.GetChild(1).GetComponent<Image>().sprite = data.myPilotSprite;
    }

    public void CheckIfCharacterSelected()
    {
        if (CharacterSelection.instance.myMech != null && CharacterSelection.instance.myPilot != null)
        {

            //CharacterSelection.instance.SetUpBattlemech();
            ModeSelectionPanel.gameObject.SetActive(true);
            BattleHangerPanel.gameObject.SetActive(false);
            BattleBankerPanel.gameObject.SetActive(false);
            //connectingStatus.gameObject.SetActive(false);
            _pilotMenu.gameObject.SetActive(false);
            _mechMenu.gameObject.SetActive(false);


        }
        else if (CharacterSelection.instance.myMech == null)
        {
            _selectWarriorMenu.gameObject.SetActive(true);
            _pilotMenu.gameObject.SetActive(false);
        }
        else if (CharacterSelection.instance.myPilot == null)
        {
            _selectWarriorMenu.gameObject.SetActive(true);
            _mechMenu.gameObject.SetActive(false);
        }
    }


    public void ExitGame()
    {
        SoundManager.PlaySound("buttonclick");
        Application.Quit();
    }



}
