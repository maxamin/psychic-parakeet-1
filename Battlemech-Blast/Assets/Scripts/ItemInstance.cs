using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class ItemInstance
{
    public ItemData itemData;


    public ItemInstance(ItemData itemData)
    {
        this.itemData = itemData;

    }
}