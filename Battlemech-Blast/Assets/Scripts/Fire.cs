using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public abstract class Fire : Weapon
{
    public IFireable client;

    public virtual void ReloadAmmo(ref int currentAmmo, ref int capacity, int maxCapacity)
    {
        if (currentAmmo < capacity)
        {
            int ammoToReload = Mathf.Min(maxCapacity - currentAmmo, capacity);

            // Subtract ammo from the ammo container and add it to the active ammo
            capacity -= ammoToReload;
            currentAmmo += ammoToReload;
        }
    }
    public virtual void AddAmmo(int ammoToAdd, ref int currentAmmo, ref int capacity, int maxCapacity)
    {
        int spaceLeft = maxCapacity - capacity;

        if (spaceLeft > 0 && capacity < maxCapacity)
        {
            // Calculate how much ammo to add without exceeding max capacity
            int actualAmmoToAdd = Mathf.Min(ammoToAdd, spaceLeft);

            // Add the collected ammo to the ammo container
            capacity += actualAmmoToAdd;

            Debug.Log("Collected " + actualAmmoToAdd + " ammo. Current Ammo: " + currentAmmo);
        }
        else
        {
            Debug.Log("Ammo at maximum capacity. Cannot collect more.");
            // You might want to play a sound or show a message indicating that the player cannot collect more ammo.
        }
    }


}
