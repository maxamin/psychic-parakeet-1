using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class UnitManager : MonoBehaviour
{

    [Header("Main Menu References")]
    public PlayerData mechData;


    [Header("Upper Body")]
    public SpriteRenderer rightArm;
    public SpriteRenderer leftArm;
    public SpriteRenderer neckless;
    public SpriteRenderer glass;
    public SpriteRenderer head;
    public SpriteRenderer chasis;
    public SpriteRenderer board;
    public SpriteRenderer guns;
    public SpriteRenderer body;

    [Header("Lower Body")]
    public SpriteRenderer rightLeg;
    public SpriteRenderer leftLeg;
    public SpriteRenderer rightKnee;
    public SpriteRenderer leftKnee;
    public SpriteRenderer rightFoot;
    public SpriteRenderer leftFoot;


    void Start()
    {

    }

    public void InitializePlayer(string playerName, string pilotName)
    {
        mechData = Resources.Load("ScriptableObjects/Mechs/" + playerName) as PlayerData;
        this.head.sprite = (Resources.Load("ScriptableObjects/Mechs/" + pilotName)as PlayerData).myPilotSprite;

        this.gameObject.name = mechData.name;
        this.rightArm.sprite = mechData.rightArm;
        this.leftArm.sprite = mechData.leftArm;
        this.neckless.sprite = mechData.neckless;
        this.glass.sprite = mechData.glass;
        this.chasis.sprite = mechData.chasis;
        this.body.sprite = mechData.body;
        this.board.sprite = mechData.board;
        this.guns.sprite = mechData.guns;
        
        this.rightLeg.sprite = mechData.rightLeg;
        this.leftLeg.sprite = mechData.leftLeg;
        this.rightKnee.sprite = mechData.rightKnee;
        this.leftKnee.sprite = mechData.leftKnee;
        this.rightFoot.sprite = mechData.rightFoot;
        this.leftFoot.sprite = mechData.leftFoot;

    }


}
