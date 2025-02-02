using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ItemUnit : MonoBehaviour
{

    public int ID;
    public string itemName;
    public string Description;
    public Sprite itemIcon;


    void Start()
    {
        
    }

    public void InitializeItemData(ItemData itemData)
    {
        //Initialize items from local scriptable object data
        this.ID = itemData.id;
        this.itemName= itemData.name;
        this.Description = itemData.description;
        this.itemIcon = itemData.itemSprite;
    }
}
