using System.Collections;
using System.Collections.Generic;
using UnityEngine; 

[CreateAssetMenu]
public class Inventory : ScriptableObject
{

    public List<ItemInstance> itemInstances = new List<ItemInstance>();
    public int maxItems;
    public bool AddItem(ItemInstance itemToAdd)
    {
        for (int i = 0; i < itemInstances.Count; i++)
        {
            if (itemInstances[i] == null)
            {
                itemInstances.Add(itemToAdd);
                return true;

            }
        }
        // Adds a new item if the inventory has space
        if (itemInstances.Count < maxItems)
        {
            itemInstances.Add(itemToAdd);
            return true;
        }
        Debug.Log("No space in the inventory");
        return false;
    }

    public void RemoveItem(ItemInstance itemToRemove)
    {
        itemInstances.Remove(itemToRemove);
    }
    public void MatchItems(ItemInstance item)
    {
        for (int i = 0; i < itemInstances.Count; i++)
        {
            if (itemInstances[i].itemData == item.itemData)
            {
                //Multiple items of the same kind
                //Indicate the number of items
            }
        }
    }

}
