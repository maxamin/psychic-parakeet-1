using Photon.Pun;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;


public class RewardManager : MonoBehaviour
{
    [System.Serializable]
    public class Reward
    {

        public ItemInstance rewardItem;


        public bool isClaimed = false;
        public bool isUnlocked;

        public Reward(ItemInstance item)
        {
            rewardItem = item;
        }
    }

    public InventoryManager inventoryManager;
    public Stack<Reward> rewardStack = new Stack<Reward>();

    public Image emptyImageObject;
    public Transform itemDisplayContainer;
    public Stack<GameObject> itemStack = new Stack<GameObject>();
    public Button claimRewardButton;



    private void Start()
    {
        claimRewardButton.onClick.AddListener(() =>
        {
            ClaimReward(rewardStack.Peek());
        });
    }
    private void Update()
    {
        if (claimRewardButton != null)
        {
            claimRewardButton.interactable = rewardStack.Count > 0;
        }
    }
    public void GetReward()
    {
        rewardStack.Push(GenerateReward());
        DisplayItemProperties(rewardStack.Peek());
        Debug.Log("Your reward is " + rewardStack.Peek().rewardItem.itemData.itemName);
    }

    public void DisplayItemProperties(Reward reward)
    {
        //Always show the peek item of the stack
        Image img = Image.Instantiate(emptyImageObject, itemDisplayContainer);
        img.sprite = reward.rewardItem.itemData.itemSprite;
        img.gameObject.SetActive(false);
        itemStack.Push(img.gameObject);
        CheckItemOnStack();
    }
    public void CheckItemOnStack()
    {
        foreach (var item in itemStack)
        {
            if (itemStack.Peek() == item)
                item.gameObject.SetActive(true);
            else
                item.gameObject.SetActive(false);
        }
    }

    public Reward GenerateReward()
    {
        Reward r = new Reward(inventoryManager.GetRandomItem());
        r.isUnlocked = true;
        return r;
    }


    public void ClaimReward(Reward r)
    {
        //Add to your inventory
        if (!r.isClaimed)
        {
            inventoryManager.inventory.AddItem(r.rewardItem);
            r.isClaimed = true;

            Destroy(itemStack.Peek());
            itemStack.Pop();
            CheckItemOnStack();

            Debug.Log("You claimed " + r.rewardItem.itemData.itemName);
            rewardStack.Pop();
        }
    }


}
