using UnityEngine;
using Photon.Pun;
using System.Collections;
using TMPro;
using UnityEngine.UIElements;

public class CheckCollider : MonoBehaviour
{

    public GameObject healEffect;
    public GameObject spawnEffect;
    public Pickable pickableObject;
    public Transform weaponListContainer;



    public float checkRaduis;



    void Update()
    {
        CheckBounds();
    }


    private void CheckBounds()
    {
        Vector2 direction = new Vector2(transform.position.x + checkRaduis, transform.position.y + checkRaduis);
        RaycastHit2D bound = Physics2D.CircleCast(transform.position, checkRaduis, direction);
        if (bound.collider != null)
        {
            if (bound.collider != this.gameObject.GetComponent<BoxCollider2D>())
            {

                transform.position = new Vector3(transform.position.x, transform.position.y, 0f);
                //Debug.Log(bound.collider);
            }
        }
    }
    private void OnTriggerEnter2D(Collider2D collision)
    {
        if (collision.gameObject.tag == "DoorTrigger")
        {
            //PlayerPhotonManager.Instance.DestroyPlayer();
            TransitionHandler.Instance.MapSwitchingCoroutine(collision.gameObject);

        }
        else if (collision.gameObject.tag == "Pickable")
        {
            CheckPickable(collision.gameObject);
        }
    }

    void AddItemToWeaponList(GameObject pickableComponent)
    {
        //Loop check if item is there

        for (int i = 0; i < weaponListContainer.childCount; i++)
        {
            if (weaponListContainer.GetChild(i).gameObject.GetComponent<Weapon>().weaponName == pickableComponent.GetComponent<Weapon>().weaponName)
                return;
        }
        GameObject component = Instantiate(pickableComponent, weaponListContainer);

    }

    public void ItemTimeOut(GameObject gameObject, TextMeshProUGUI text, float timeToDie)
    {
        //Text countdown
        //Die after time out 
        Destroy(gameObject, timeToDie);

    }
    private void PickableCollision(GameObject gameObject, GameObject collisionEff)
    {
        GameObject eff = Instantiate(collisionEff, gameObject.transform.position, Quaternion.identity);
        Destroy(eff, 2f);
        Destroy(gameObject);
    }


    void CheckPickable(GameObject pickable)
    {
        switch (pickable.GetComponent<Pickable>().type)
        {
            case Pickable.ItemType.None:
                Debug.Log("None");
                break;
            case Pickable.ItemType.Weapon:
                Debug.Log("Weapon");
                //Add Item to weapon list
                AddItemToWeaponList(pickable.GetComponent<Pickable>().pickablePrefab);
                PickableCollision(pickable, spawnEffect);

                break;
            case Pickable.ItemType.SpecialPower:
                Debug.Log("Special Power");
                //Add Item to weapon list

                break;
            case Pickable.ItemType.Currency:
                Debug.Log("Currency");
                //Add Item to currency

                break;
            case Pickable.ItemType.PowerUp:
                Debug.Log("Power Up Object");
                PowerUps powerUp = pickable.GetComponent<PowerUps>();
                switch (powerUp.type)
                {
                    case PowerUps.PowerType.None:
                        Debug.Log("Null power up");

                        break;
                    case PowerUps.PowerType.Ammo:
                        this.gameObject.GetComponent<PlayerAttackController>().weapon.GetComponent<IWeapon>().IncreaseAmmo(powerUp.Amount);
                        PickableCollision(pickable, spawnEffect);
                        break;

                    case PowerUps.PowerType.Health:
                        this.gameObject.GetComponent<HealthSystem>().GetHealth(powerUp.Amount);
                        PickableCollision(pickable, healEffect);

                        break;

                    default:
                        Debug.Log("Null power up");

                        break;
                }


                break;
            default:
                Debug.Log("Pickable is not identified");
                break;
        }


    }



    void OnDrawGizmos()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, checkRaduis);
    }

}
