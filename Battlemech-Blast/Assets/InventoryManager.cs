using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class InventoryManager : MonoBehaviour
{
    public Inventory inventory;
    public GameObject itemUnitSample;
    public Transform itemContainer;
    public List<ItemInstance> rewardItemStack = new List<ItemInstance>();

    void Start()
    {
    }

    void Update()
    {

    }

    public void LoadItems()
    {
        if (inventory == null || inventory.itemInstances.Count == 0)
            return;


        //Loop through inventory items
        for (int i = 0; i < inventory.itemInstances.Count; i++)
        {
            GameObject unitGO = Instantiate(itemUnitSample, itemContainer);
            ItemUnit unit = unitGO.GetComponent<ItemUnit>();
            unit.InitializeItemData(inventory.itemInstances[i].itemData);
            unitGO.name = unit.itemName;
        }


    }
    public ItemInstance GetRandomItem()
    {
        ItemInstance item = rewardItemStack[Random.Range(0, rewardItemStack.Count)];
        return item;
    }
}
