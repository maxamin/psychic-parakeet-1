using UnityEngine;
using System.Collections;
using UnityEngine.UI;
namespace ShootingSystem
{

/// <summary>
/// Used to configure simple demo turrets in the Turret weapon demo scene.
/// </summary>
public class DemoTurretScene : MonoBehaviour {

    public WeaponSystem[] wsRefs;
    public Toggle lerpToggle;
    public Toggle autoFireToggle;
    public Slider lerpSlider;

	// Use this for initialization
	void Start () {
        lerpToggle.onValueChanged.AddListener(Toggle);
        lerpSlider.onValueChanged.AddListener(Slide);
        autoFireToggle.onValueChanged.AddListener(AutoFireToggle);

        foreach (var wsRef in wsRefs)
        {
            StartCoroutine(EnableTurret(wsRef, Random.Range(1f, 8f)));
        }

    }

    IEnumerator EnableTurret(WeaponSystem ws, float delay)
    {
        yield return new WaitForSeconds(delay);
        if (ws != null) ws.enabled = true;
    }
	
	void Toggle(bool state)
    {
        foreach (var wsRef in wsRefs) wsRef.lerpTurnRate = state;
    }

    void AutoFireToggle(bool state)
    {
        foreach (var wsRef in wsRefs) wsRef.autoFire = state;
    }

    void Slide(float value)
    {
        foreach (var wsRef in wsRefs) wsRef.trackingTurnRate = value;
    }
}

}