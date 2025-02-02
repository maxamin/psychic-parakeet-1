using System.Diagnostics;
using UnityEngine;
using UnityEditor;
using System.Collections;
using System.Collections.Generic;
using System;
using Debug = UnityEngine.Debug;
using ShootingSystem;

[Flags]
public enum EditorListOption {
	None = 0,
	ListSize = 1,
	ListLabel = 2,
	ElementLabels = 4,
	Buttons = 8,
	Default = ListSize | ListLabel | ElementLabels,
	NoElementLabels = ListSize | ListLabel,
	All = Default | Buttons
}

/// <summary>
/// Custom inspector / editor for the main WeaponSystem component script.
/// </summary>
[CustomEditor(typeof(WeaponSystem)), CanEditMultipleObjects] 
public class WeaponSystemEditor : Editor {

    private bool showPositioningParams = true;
    private bool showMagazineAndReloadParams = true;
    private bool showMainParams = true;
    private bool showAmmoParams = true;
	private bool showTargetTrackingParams;

	void OnEnable ()
	{
		hideFlags = HideFlags.HideAndDontSave;
	}

    /// <summary>
    /// Draws a basic separator texture in the custom inspector.
    /// </summary>
	public static void DrawSeparator()
	{
		GUILayout.Space( 12f );
		
		if( Event.current.type == EventType.Repaint )
		{
			Texture2D tex = EditorGUIUtility.whiteTexture;
			
			Rect rect = GUILayoutUtility.GetLastRect();
			
			var savedColor = GUI.color;
			GUI.color = new Color( 0f, 0f, 0f, 0.25f );
			
			GUI.DrawTexture( new Rect( 0f, rect.yMin + 6f, Screen.width, 4f ), tex );
			GUI.DrawTexture( new Rect( 0f, rect.yMin + 6f, Screen.width, 1f ), tex );
			GUI.DrawTexture( new Rect( 0f, rect.yMin + 9f, Screen.width, 1f ), tex );
			
			GUI.color = savedColor;
		}
		
	}

    /// <summary>
    /// All the custom WeaponSystem editor inspector is done here.
    /// </summary>
	public override void OnInspectorGUI() {

		serializedObject.Update();

        var weaponSystem = (WeaponSystem)target;

        var weaponNameProp = serializedObject.FindProperty("weaponName");
	    EditorGUILayout.PropertyField(weaponNameProp);

        #region WeaponIcon

        GUILayout.Label("Weapon Icon");
	    var weaponIconProp = serializedObject.FindProperty("weaponIcon");
	    EditorGUILayout.PropertyField(weaponIconProp, GUIContent.none);

        #endregion

        DrawSeparator();

        #region Ammo

        var limitedAmmoTooltip = new GUIContent("Limited Ammo", "Enable or disable limited ammo for weapon configuration.");
        var startingAmmoTooltip = new GUIContent("Starting Ammo", "Set how much ammo this weapon configuration starts with.");
        var ammoUsedTooltip = new GUIContent("Ammo Used", "(Read only) This shows how much ammo has been used so far. Should not be set using the editor.");

        var limitedAmmoProp = serializedObject.FindProperty("limitedAmmo");
        var startingAmmoProp = serializedObject.FindProperty("startingAmmo");
        var ammoUsedProp = serializedObject.FindProperty("ammoUsed");
        var bulletCountsAsAmmoProp = serializedObject.FindProperty("bulletCountsAsAmmo");
        var bcaampGuiContent = new GUIContent("Bullet counts as ammo", "If enabled, then every single bullet coming out will count toward ammo usage if limitedAmmo is enabled. (Disable this for shotguns for example so that 10 bullets come out as spray, but only count as one 'bullet' used for ammo).");

        showAmmoParams = EditorGUILayout.Foldout(showAmmoParams, "Ammo settings");
	    if (showAmmoParams)
	    {
            EditorGUI.indentLevel++;
            limitedAmmoProp.boolValue = EditorGUILayout.Toggle(limitedAmmoTooltip, limitedAmmoProp.boolValue);
            EditorGUILayout.PropertyField(startingAmmoProp, startingAmmoTooltip);
            EditorGUILayout.PropertyField(ammoUsedProp, ammoUsedTooltip);
            bulletCountsAsAmmoProp.boolValue = EditorGUILayout.Toggle(bcaampGuiContent, bulletCountsAsAmmoProp.boolValue);
            EditorGUILayout.Space();

            if (!startingAmmoProp.hasMultipleDifferentValues && limitedAmmoProp.boolValue)
            {
                if (startingAmmoProp.intValue <= 0) startingAmmoProp.intValue = 300; // Give 300 ammo as default if this is not set correctly
                var percentValueRemaining = (float)(startingAmmoProp.intValue - ammoUsedProp.intValue) / (float)startingAmmoProp.intValue * 1f;
                ProgressBar(percentValueRemaining, "Ammo remaining");
            }
            EditorGUI.indentLevel--;
	    }

        #endregion

        DrawSeparator();

        #region WeaponSettings

        var bulletSpreadTooltip = new GUIContent("Bullet Spread", "How much bullets should spread after firing.");
        var bulletSpreadPingPongMinTooltip = new GUIContent("Bullet Spread PingPong Min", "If PingPong spread is enabled, this sets the minimum value the spread will change to.");
		var bulletSpreadPingPongMaxTooltip = new GUIContent("Bullet Spread PingPong Max", "If PingPong spread is enabled, this sets the maximum value the spread will change to.");
		var bulletSpreadSpeedTooltip = new GUIContent("Spread PingPong Speed", "How fast the PingPong is executed (how fast the bullet spread bounces between min and max values).");
		var bulletSpacingTooltip = new GUIContent("Bullet Spacing", "How far apart bullets are created from eachother when fired (when using more than 1 bullet count).");
		var bulletCountTooltip = new GUIContent("Bullet Count", "How many bullets are fired in one shot.");
		var bulletRandomnessTooltip = new GUIContent("Bullet Randomness", "Gives each bullet a slight randomness in positioning when fired.");
		var bulletSpeedTooltip = new GUIContent("Bullet Speed", "How fast the bullets travel.");
		var weaponFireRateTooltip = new GUIContent("Weapon Fire Rate", "Controls the delay between each shot from the weapon.");
        var mirrorXTooltip = new GUIContent("Mirror bullets X", "Duplicates the number of bullets being used and mirrors the extra bullets on the X-axis");
        var weaponOffsetXTooltip = new GUIContent("Weapon X Offset", "Applies an X offset to the bullets fired when using the relative to object mode (not used in relative to gunpoint mode)");
		var weaponOffsetYTooltip = new GUIContent("Weapon Y Offset", "Applies a Y offset to the bullets fired when using the relative to object mode (not used in relative to gunpoint mode)");
		var ricochetChancePercentTooltip = new GUIContent("Ricochet chance percent", "If bullet ricochets are enabled, this determines what chance a bullet has to ricochet on each hit of a suitable Collider2D.");
		var autoFireTooltip = new GUIContent("Weapon auto fire", "Enable or disable weapon auto fire. Useful for when this is used for enemy / AI weapons for example.");
		var pingPongSpreadTooltip = new GUIContent("PingPong Spread", "Enable or disable the change of spread distance of bullets between min and max values.");
		var ricochetBulletsTooltip = new GUIContent("Ricochet bullets", "Enable or disable bullet ricochets (determined with ricochet chance value when enabled).");
		var hitEffectsTooltip = new GUIContent("Hit effects", "Enable or disable bullet hit effects (Sparks) when hitting suitable Collider2D objects.");

        var bulletSpreadProp = serializedObject.FindProperty("bulletSpread");
        var bulletSpreadPingPongMaxProp = serializedObject.FindProperty("bulletSpreadPingPongMax");
        var bulletSpreadPingPongMinProp = serializedObject.FindProperty("bulletSpreadPingPongMin");
        var spreadPingPongSpeedProp = serializedObject.FindProperty("spreadPingPongSpeed");
        var bulletSpacingProp = serializedObject.FindProperty("bulletSpacing");
        var bulletCountProp = serializedObject.FindProperty("bulletCount");
        var bulletRandomnessProp = serializedObject.FindProperty("bulletRandomness");
        var bulletSpeedProp = serializedObject.FindProperty("bulletSpeed");
        var weaponFireRateProp = serializedObject.FindProperty("weaponFireRate");
        var mirrorXProp = serializedObject.FindProperty("mirrorX");
        var weaponXOffsetProp = serializedObject.FindProperty("weaponXOffset");
        var weaponYOffsetProp = serializedObject.FindProperty("weaponYOffset");
        var ricochetChancePercentProp = serializedObject.FindProperty("ricochetChancePercent");
        var bulletColourProp = serializedObject.FindProperty("bulletColour");
        var autoFireProp = serializedObject.FindProperty("autoFire");
        var pingPongSpreadProp = serializedObject.FindProperty("pingPongSpread");
        var richochetsEnabledProp = serializedObject.FindProperty("richochetsEnabled");
        var hitEffectEnabledProp = serializedObject.FindProperty("hitEffectEnabled");
        var shotFiredSfxProp = serializedObject.FindProperty("shotFiredClip");

        showMainParams = EditorGUILayout.Foldout(showMainParams, "Weapon settings");
        if (showMainParams)
        {
            EditorGUI.indentLevel++;
            EditorGUILayout.Slider(bulletSpreadProp, 0f, 5f, bulletSpreadTooltip);
            EditorGUILayout.Slider(bulletSpreadPingPongMinProp, 0f, 5f, bulletSpreadPingPongMinTooltip);
            EditorGUILayout.Slider(bulletSpreadPingPongMaxProp, 0f, 5f, bulletSpreadPingPongMaxTooltip);
            EditorGUILayout.Slider(spreadPingPongSpeedProp, 1f, 3f, bulletSpreadSpeedTooltip);
            EditorGUILayout.Slider(bulletSpacingProp, 0f, 5f, bulletSpacingTooltip);
            EditorGUILayout.IntSlider(bulletCountProp, 0, 20, bulletCountTooltip);
            EditorGUILayout.Slider(bulletRandomnessProp, 0f, 5f, bulletRandomnessTooltip);
            EditorGUILayout.Slider(bulletSpeedProp, 5f, 35f, bulletSpeedTooltip);
            EditorGUILayout.Slider(weaponFireRateProp, 0f, 3f, weaponFireRateTooltip);
            EditorGUILayout.Slider(weaponXOffsetProp, -3f, 3f, weaponOffsetXTooltip);
            EditorGUILayout.Slider(weaponYOffsetProp, -3f, 3f, weaponOffsetYTooltip);
            EditorGUILayout.Slider(ricochetChancePercentProp, 0f, 100f, ricochetChancePercentTooltip);
            mirrorXProp.boolValue = EditorGUILayout.Toggle(mirrorXTooltip, mirrorXProp.boolValue);
            EditorGUILayout.Space();
            EditorGUILayout.PropertyField(bulletColourProp);

            autoFireProp.boolValue = EditorGUILayout.Toggle(autoFireTooltip, autoFireProp.boolValue);
            pingPongSpreadProp.boolValue = EditorGUILayout.Toggle(pingPongSpreadTooltip, pingPongSpreadProp.boolValue);
            richochetsEnabledProp.boolValue = EditorGUILayout.Toggle(ricochetBulletsTooltip, richochetsEnabledProp.boolValue);
            hitEffectEnabledProp.boolValue = EditorGUILayout.Toggle(hitEffectsTooltip, hitEffectEnabledProp.boolValue);
            EditorGUILayout.PropertyField(shotFiredSfxProp);
            EditorGUI.indentLevel--;
        }

        #endregion
        
        DrawSeparator();

        #region MagazineAndReloadRelated

        var usesMagazinesTooltip = new GUIContent("Uses Magazines", "If enabled, bullets are split into magazines for the weapon based on magazine settings that appear below when enabled. Entities are then required to reload when magazine clips run out.");
        var magSizeTooltip = new GUIContent("Magazine capacity", "The number of bullets a magazine holds.");
        var magChangeDelayTooltip = new GUIContent("Reload time", "The time in seconds it takes to reload a magazine.");
        var playReloadTooltip = new GUIContent("Play reload SFX", "Enable this to choose a SFX clip to play when reloading happens.");
        var playEmptyMagTooltip = new GUIContent("Play Empty Mag SFX", "Enable this to choose a SFX clip to play when magazine runs out of ammo.");


	    var usesMagazinesProp = serializedObject.FindProperty("usesMagazines");
        var magazineSizeProp = serializedObject.FindProperty("magazineSize");
        var magazineRemainingBulletsProp = serializedObject.FindProperty("magazineRemainingBullets");
        var magazineChangeDelayProp = serializedObject.FindProperty("magazineChangeDelay");
        var playReloadingSfxProp = serializedObject.FindProperty("playReloadingSfx");
        var playEmptySfxProp = serializedObject.FindProperty("playEmptySfx");
	    var reloadSfxClipProp = serializedObject.FindProperty("reloadSfxClip");
        var emptySfxClipProp = serializedObject.FindProperty("emptySfxClip");
        
        showMagazineAndReloadParams = EditorGUILayout.Foldout(showMagazineAndReloadParams, "Reload and magazine settings");
	    if (showMagazineAndReloadParams)
	    {
            EditorGUI.indentLevel++;
            usesMagazinesProp.boolValue = EditorGUILayout.Toggle(usesMagazinesTooltip, usesMagazinesProp.boolValue);

            if (usesMagazinesProp.boolValue)
            {
                magazineSizeProp.intValue = EditorGUILayout.IntField(magSizeTooltip, magazineSizeProp.intValue);
                if (magazineSizeProp.intValue < 0) magazineSizeProp.intValue = 0;

                EditorGUILayout.Slider(magazineChangeDelayProp, 0f, 10f, magChangeDelayTooltip);

                EditorGUILayout.IntField("Remaining in current mag", magazineRemainingBulletsProp.intValue);

                playReloadingSfxProp.boolValue = EditorGUILayout.Toggle(playReloadTooltip, playReloadingSfxProp.boolValue);
                playEmptySfxProp.boolValue = EditorGUILayout.Toggle(playEmptyMagTooltip, playEmptySfxProp.boolValue);

                if (playReloadingSfxProp.boolValue)
                {
                    EditorGUILayout.PropertyField(reloadSfxClipProp);
                }

                if (playEmptySfxProp.boolValue)
                {
                    EditorGUILayout.PropertyField(emptySfxClipProp);
                }
            }
            EditorGUI.indentLevel--;
        }

        #endregion

        DrawSeparator();

        #region Weapon positioning related

        var gunPointTooltip = new GUIContent("Gun Point", "Specify a GunPoint transform that bullets will be fired from.");
        var relativeToObjectTooltip = new GUIContent("Weapon relative to Object", "The aiming/facing direction is calculated relative to the transform that the WeaponSystem component is placed on. Offset X and Y positioning of bullets is taken into account and applied in this mode.");
        var relativeToGunPointTooltip = new GUIContent("Weapon relative to GunPoint", "The aiming/facing direction is calculated relative to the GunPoint transform for the currently selected WeaponConfiguration that the WeaponSystem component is using. Offset X and Y positioning of bullets is NOT taken into account.");

        var gunPointProp = serializedObject.FindProperty("gunPoint");
        var weaponRelativeToComponentProp = serializedObject.FindProperty("weaponRelativeToComponent");
        
        showPositioningParams = EditorGUILayout.Foldout(showPositioningParams, "Weapon positioning settings");
        if (showPositioningParams)
	    {
	        EditorGUI.indentLevel++;
            EditorGUILayout.PropertyField(gunPointProp, gunPointTooltip);

            bool relativeToggleState = weaponRelativeToComponentProp.boolValue == false;
            relativeToggleState = GUILayout.Toggle(relativeToggleState, relativeToObjectTooltip, (GUIStyle)"Radio");
            if (relativeToggleState)
            {
                weaponRelativeToComponentProp.boolValue = false;
            }

            relativeToggleState = weaponRelativeToComponentProp.boolValue == true;
            relativeToggleState = GUILayout.Toggle(relativeToggleState, relativeToGunPointTooltip, (GUIStyle)"Radio");
            if (relativeToggleState)
            {
                weaponRelativeToComponentProp.boolValue = true;
            }
            EditorGUI.indentLevel--;
        }

        #endregion

        DrawSeparator();

        #region General options

        var shooterDirectionTypeTooltip = new GUIContent("Shooter Type", "Choose the type of control and aim mode used on the WeaponSystem.");
        var bulletOptionTypeTooltip = new GUIContent("Bullet Type", "Specify the bullet type that should be used (ensure you have the bullet / object pool manager script instance in your scene!)");
        
        weaponSystem.shooterDirectionType = (WeaponSystem.ShooterType)EditorGUILayout.EnumPopup(shooterDirectionTypeTooltip, weaponSystem.shooterDirectionType);
        weaponSystem.bulletOptionType = (WeaponSystem.BulletOption)EditorGUILayout.EnumPopup(bulletOptionTypeTooltip, weaponSystem.bulletOptionType);

		if (weaponSystem.shooterDirectionType == WeaponSystem.ShooterType.TargetTracking)
		{
			EditorGUI.indentLevel++;
			var targetToTrackProp = serializedObject.FindProperty("targetToTrack");
			var targetToTrackTooltip = new GUIContent("Target to track", "Specify a transform that this Weapon System should track (aim at).");
			EditorGUILayout.PropertyField(targetToTrackProp, targetToTrackTooltip);
			if (targetToTrackProp.objectReferenceValue == null)
			{
				GUI.color = Color.white;
				EditorGUILayout.HelpBox(
					"To use Target Tracking mode you must assign a valid Transform for the Weapon System to track. Specify this on the 'Target to track' field in the editor, or via the public 'targetToTrack' Transform field on the WeaponSystem in code..",
					MessageType.Error, true);
				GUI.color = Color.white;
			}
			else
			{
				GUI.color = Color.green;
				EditorGUILayout.HelpBox(
					"A valid Transform for this Weapon System to track has been specified.",
					MessageType.None, true);
				GUI.color = Color.white;
			}

            EditorGUI.indentLevel--;
		}

        if (weaponSystem.shooterDirectionType == WeaponSystem.ShooterType.FreeAim 
            || weaponSystem.shooterDirectionType == WeaponSystem.ShooterType.TargetTracking)
        {
            var lerpTurnRateTooltip = new GUIContent("Lerp tracking turn rate", "Enable or disable the interpolation of the Weapon System turn/rotation. This is useful for enemy turret type setups where you wish the turret " +
                "to slowly turn to face it's target. Only available for FreeAim and Target Tracking aim modes.");
            EditorGUI.indentLevel++;
            var lerpTurnRateProp = serializedObject.FindProperty("lerpTurnRate");
            lerpTurnRateProp.boolValue = EditorGUILayout.Toggle(lerpTurnRateTooltip, lerpTurnRateProp.boolValue);

            var trackingTurnRateProp = serializedObject.FindProperty("trackingTurnRate");
            var trackingTurnRateTooltip = new GUIContent("Lerp track rate", "The rate at which the WeaponSystem will track the current aim position (FreeAim) or tracking target position (TargetTracking).");
            EditorGUILayout.Slider(trackingTurnRateProp, 1f, 15f, trackingTurnRateTooltip);

            EditorGUI.indentLevel--;
        }

        #endregion

        DrawSeparator();

        #region Inventory management

        if (GUILayout.Button("Add weapon configuration to inventory", GUILayout.Height(40)))
        {
            var weaponConfig = new WeaponSystemConfiguration();

            weaponConfig.weaponName = weaponNameProp.stringValue;
            weaponConfig.bulletCount = bulletCountProp.intValue;
            weaponConfig.bulletRandomness = bulletRandomnessProp.floatValue;
            weaponConfig.bulletSpacing = bulletSpacingProp.floatValue;
            weaponConfig.bulletSpread = bulletSpreadProp.floatValue;
            weaponConfig.bulletSpeed = bulletSpeedProp.floatValue;
            weaponConfig.bulletSpreadPingPongMax = bulletSpreadPingPongMaxProp.floatValue;
            weaponConfig.bulletSpreadPingPongMin = bulletSpreadPingPongMinProp.floatValue;
            weaponConfig.bulletColour = bulletColourProp.colorValue;
            
            if (weaponIconProp.objectReferenceValue != null) weaponConfig.weaponIcon = (Texture2D) weaponIconProp.objectReferenceValue;

            weaponConfig.hitEffectEnabled = hitEffectEnabledProp.boolValue;
            weaponConfig.pingPongSpread = pingPongSpreadProp.boolValue;
            weaponConfig.richochetsEnabled = richochetsEnabledProp.boolValue;
            weaponConfig.weaponFireRate = weaponFireRateProp.floatValue;
            weaponConfig.ricochetChancePercent = ricochetChancePercentProp.floatValue;
            weaponConfig.spreadPingPongSpeed = spreadPingPongSpeedProp.floatValue;
            weaponConfig.weaponXOffset = weaponXOffsetProp.floatValue;
            weaponConfig.weaponYOffset = weaponYOffsetProp.floatValue;
            weaponConfig.autoFire = autoFireProp.boolValue;
            weaponConfig.limitedAmmo = limitedAmmoProp.boolValue;
            weaponConfig.ammoAvailable = startingAmmoProp.intValue;
            weaponConfig.ammoUsed = ammoUsedProp.intValue;

            weaponConfig.isFirstEquip = true;
            weaponConfig.usesMagazines = usesMagazinesProp.boolValue;
            weaponConfig.magazineChangeDelay = magazineChangeDelayProp.floatValue;
            weaponConfig.magazineRemainingBullets = magazineRemainingBulletsProp.intValue;
            weaponConfig.magazineSize = magazineSizeProp.intValue;
            weaponConfig.playReloadingSfx = playReloadingSfxProp.boolValue;
            weaponConfig.playEmptySfx = playEmptySfxProp.boolValue;

            if (shotFiredSfxProp.objectReferenceValue != null) weaponConfig.shotFiredClip = (AudioClip)shotFiredSfxProp.objectReferenceValue;
            if (reloadSfxClipProp.objectReferenceValue != null) weaponConfig.reloadSfxClip = (AudioClip)reloadSfxClipProp.objectReferenceValue;
            if (emptySfxClipProp.objectReferenceValue != null) weaponConfig.emptySfxClip = (AudioClip)emptySfxClipProp.objectReferenceValue;
            if (gunPointProp.objectReferenceValue != null) weaponConfig.gunPoint = (Transform) gunPointProp.objectReferenceValue;

            weaponConfig.weaponRelativeToComponent = weaponRelativeToComponentProp.boolValue;
            weaponConfig.BulletOptionType = weaponSystem.bulletOptionType;
            weaponConfig.ShooterType = weaponSystem.shooterDirectionType;
            weaponConfig.targetToTrack = weaponSystem.targetToTrack;
            weaponConfig.trackingTurnRate = weaponSystem.trackingTurnRate;
            weaponConfig.lerpTurnRate = weaponSystem.lerpTurnRate;
            weaponConfig.mirrorX = weaponSystem.mirrorX;

            weaponSystem.weaponConfigs.Add(weaponConfig);
        }

		WeaponSystemEditorList.Show (serializedObject.FindProperty("_weaponConfigs"), EditorListOption.All);

        #endregion

        if (GUI.changed) {
			EditorUtility.SetDirty(weaponSystem);
		}

		serializedObject.ApplyModifiedProperties();
	}

    /// <summary>
    /// Custom GUILayout progress bar for ammo remaining display and other progress bar usage...
    /// </summary>
    /// <param name="value"></param>
    /// <param name="label"></param>
    void ProgressBar(float value, string label)
    {
        // Get a rect for the progress bar using the same margins as a textfield:
        Rect rect = GUILayoutUtility.GetRect(18, 18, "TextField");
        EditorGUI.ProgressBar(rect, value, label);
        EditorGUILayout.Space();
    }
}
