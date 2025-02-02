using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[CreateAssetMenu(fileName = "Mech Data Name", order = 1)]
public class PlayerData : ScriptableObject
{
    public string mechName;

    [Header("Mech")]
    public Sprite myPilotSprite;
    public Sprite myMechSprite;

    [Header("Upper Body")]
    public Sprite rightArm;
    public Sprite leftArm;
    public Sprite neckless;
    public Sprite glass;
    public Sprite chasis;
    public Sprite board;
    public Sprite guns;
    public Sprite body;

    [Header("Lower Body")]
    public Sprite rightLeg;
    public Sprite leftLeg;
    public Sprite rightKnee;
    public Sprite leftKnee;
    public Sprite rightFoot;
    public Sprite leftFoot;
    


}
