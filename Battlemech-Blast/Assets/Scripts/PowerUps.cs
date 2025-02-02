using UnityEngine;

public class PowerUps : MonoBehaviour, IPowerUp
{

    public enum PowerType
    {
        None,
        Ammo,
        Health,
    }

    public PowerType type;


    [SerializeField] private int m_amount;
    
    private float checkRaduis = .5f;

    public int Amount { get => m_amount; set => m_amount = value; }



    void Update()
    {
        CheckCollider();
    }



    void CheckCollider()
    {

        Collider2D collision = Physics2D.OverlapCircle(transform.position, checkRaduis);

        if (collision.name == "Tilemap_Bounds")
        {
            Destroy(gameObject);

        }
    }
    void OnDrawGizmos()
    {
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(transform.position, checkRaduis);
    }

}


public interface IPowerUp
{
    public int Amount { get; set; }
}