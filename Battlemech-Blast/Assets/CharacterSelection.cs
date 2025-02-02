using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class CharacterSelection : MonoBehaviour
{

    public static CharacterSelection instance;


    public PlayerData selectedBattleMech;
    public Sprite myMech;
    public Sprite myPilot;




    private void Awake()
    {
        if (instance == null)
            instance = this;
        GUIManager.instance.InitializeUnits();
    }


    void Start()
    {


    }

    public void AddButtonEvents(Button mech, Button pilot)
    {

        ButtonExtension.AddEventListener(mech, mech.GetComponent<Unit>(), SelectMech);
        ButtonExtension.AddEventListener(pilot, pilot.GetComponent<Unit>(), SelectPilot);

    }

    public void SelectMech(Unit playerUnit)
    {

        selectedBattleMech = playerUnit.mechDataPrefab;
        myMech = playerUnit.sprite;
        GUIManager.instance.CheckIfCharacterSelected();
    }

    public void SelectPilot(Unit playerUnit)
    {
        PlayerInstantiator.Instance.pilotName = playerUnit.playerName;
        myPilot = playerUnit.sprite;
        GUIManager.instance.CheckIfCharacterSelected();
    }


}
