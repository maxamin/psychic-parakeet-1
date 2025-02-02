using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;

namespace ShootingSystem
{

    /// <summary>
    /// A demo scene manager component that handles GUI for weapon configurations in the weapon configuration scene.
    /// </summary>
    public class DemoWeaponConfigSceneManager : MonoBehaviour
    {
        public WeaponSystem playerWeaponSystemRef;
        public GUIStyle style;
        public GUISkin guiSkin;
        public Texture2D highlightTexture;

        private GUIStyle weaponNameStyle;
        private GUIStyle normalTextStyle;
        private string loadedLevelName;

        private List<Texture2D> weaponIconTextures = new List<Texture2D>();
        private int currentWeaponIconIndex;
        private float offsetMulti;

        // Use this for initialization
        void Start()
        {
            loadedLevelName = SceneManager.GetActiveScene().name;
            weaponNameStyle = new GUIStyle { fontSize = 13, normal = { textColor = Color.white }, fontStyle = FontStyle.Normal };
            normalTextStyle = new GUIStyle { fontSize = 12, normal = { textColor = Color.white }, fontStyle = FontStyle.Normal };

            if (playerWeaponSystemRef != null)
            {
                playerWeaponSystemRef.WeaponConfigurationChanged += PlayerWeaponSystemRefWeaponConfigurationChanged;

                // Setup texture array for weapon icons
                if (playerWeaponSystemRef.weaponConfigs.Count > 0)
                {
                    foreach (var weaponConfig in playerWeaponSystemRef.weaponConfigs)
                    {
                        weaponIconTextures.Add(weaponConfig.weaponIcon);
                    }
                }
            }

            offsetMulti = 40f;

            switch (loadedLevelName)
            {
                case "WeaponConfigurationAndInventoryDemoScene":
                    offsetMulti = 40f;
                    break;
                case "SpaceTopDownDemoScene":
                    offsetMulti = 64f;
                    break;
            }
        }

        void PlayerWeaponSystemRefWeaponConfigurationChanged(Transform gunPointTransform, int weaponConfigIndex)
        {
            // Update the GUI to highlight the current weapon...
            currentWeaponIconIndex = weaponConfigIndex;
        }

        void OnGUI()
        {
            GUI.skin = guiSkin;

            if (loadedLevelName == "WeaponConfigurationAndInventoryDemoScene" || loadedLevelName == "SpaceTopDownDemoScene") // Manual entry for demo scene where we need a bigger weapon icons in the GUI panel.
            {
                GUI.BeginGroup(new Rect(5, 5, 320, 110));
                GUI.Box(new Rect(0, 0, 320, 110), string.Empty);

                if (playerWeaponSystemRef.weaponIcon != null) GUI.DrawTexture(new Rect(30, 30, 64, 64), playerWeaponSystemRef.weaponIcon);

                var ammoRemaining = playerWeaponSystemRef.startingAmmo - playerWeaponSystemRef.ammoUsed;

                GUI.Label(new Rect(30, 17, 250, 16),
                            playerWeaponSystemRef.weaponName, weaponNameStyle);

                if (!playerWeaponSystemRef.limitedAmmo)
                {
                    GUI.Label(new Rect(120, 42, 250, 30),
                            "Ammo remaining: infinite", normalTextStyle);
                }
                else
                {
                    GUI.Label(new Rect(120, 42, 250, 30),
                            "Ammo remaining: " + ammoRemaining, normalTextStyle);
                }


                if (playerWeaponSystemRef.usesMagazines)
                {
                    var remainingMags = Mathf.Abs(ammoRemaining / playerWeaponSystemRef.magazineSize);

                    GUI.Label(new Rect(120, 62, 250, 30),
                            "Magazines remaining: " + remainingMags, normalTextStyle);

                    GUI.Label(new Rect(120, 82, 250, 30),
                        "Current magazine: " + playerWeaponSystemRef.magazineRemainingBullets + "/" +
                        playerWeaponSystemRef.magazineSize, normalTextStyle);
                }
            }
            else
            {
                GUI.BeginGroup(new Rect(5, 5, 250, 110));
                GUI.Box(new Rect(0, 0, 250, 110), string.Empty);

                if (playerWeaponSystemRef.weaponIcon != null) GUI.DrawTexture(new Rect(20, 42, 32, 32), playerWeaponSystemRef.weaponIcon);

                var ammoRemaining = playerWeaponSystemRef.startingAmmo - playerWeaponSystemRef.ammoUsed;

                GUI.Label(new Rect(20, 17, 250, 16),
                            playerWeaponSystemRef.weaponName, weaponNameStyle);

                GUI.Label(new Rect(64, 42, 250, 30),
                            "Ammo remaining: " + ammoRemaining, normalTextStyle);

                if (playerWeaponSystemRef.usesMagazines)
                {
                    var remainingMags = Mathf.Abs(ammoRemaining / playerWeaponSystemRef.magazineSize);

                    GUI.Label(new Rect(64, 62, 250, 30),
                            "Magazines remaining: " + remainingMags, normalTextStyle);

                    GUI.Label(new Rect(64, 82, 250, 30),
                        "Current magazine: " + playerWeaponSystemRef.magazineRemainingBullets + "/" +
                        playerWeaponSystemRef.magazineSize, normalTextStyle);
                }
            }

            GUI.EndGroup();

            // Weapon icons down the side
            for (var i = 0; i < weaponIconTextures.Count; i++)
            {
                var offset = i * offsetMulti;

                var icon = weaponIconTextures[i];
                GUI.Label(new Rect(20, Screen.height - 160 - offset, 70, 70), icon);
            }

            // Highlight current weapon icon.
            if (currentWeaponIconIndex <= weaponIconTextures.Count - 1)
            {
                if (highlightTexture != null) GUI.Label(new Rect(20, Screen.height - 160 - currentWeaponIconIndex * offsetMulti, 70, 70), highlightTexture);
            }

            if (GUI.Button(new Rect(Screen.width - 420, Screen.height - 90, 140, 30), "Next demo scene >>"))
            {
                var currentLevelIndex = SceneManager.GetActiveScene().buildIndex;
                if (currentLevelIndex < SceneManager.sceneCountInBuildSettings - 1)
                {
                    SceneManager.LoadScene(currentLevelIndex + 1);
                }
                else
                {
                    SceneManager.LoadScene(0);
                }
            }
            if (GUI.Button(new Rect(280, Screen.height - 90, 140, 30), "<< Prev demo scene"))
            {
                var currentLevelIndex = SceneManager.GetActiveScene().buildIndex;
                if (currentLevelIndex > 0)
                {
                    SceneManager.LoadScene(currentLevelIndex - 1);
                }
                else
                {
                    SceneManager.LoadScene(SceneManager.sceneCountInBuildSettings - 1);
                }
            }

            if (loadedLevelName == "SpaceTopDownDemoScene")
            {
                GUI.Label(new Rect(Screen.width / 2 - 150, 10, 700, 25),
                    "Left click to shoot, scroll mousewheel to change weapon. 'R' to reload, 'E' to reload one bullet at a time.");
            }

        }
    }

}