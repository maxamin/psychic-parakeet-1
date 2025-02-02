using System;
using UnityEngine;
using System.Collections;

namespace ShootingSystem
{

    /// <summary>
    /// The main bullet component class for bullets used by the WeaponSystem component.
    /// </summary>
    public class Bullet : MonoBehaviour
    {

        public enum BulletOwner
        {
            Player, Enemy
        }

        /// <summary>
        /// Sample enum that allows differentiation of bullets based on whether fired from a 'player' or 'enemy'.
        /// </summary>
        public BulletOwner bulletOwner { get; set; }

        /// <summary>
        /// The speed at which the bullet will travel at
        /// </summary>
        public float speed = 1f;

        /// <summary>
        /// The sprite renderer for the bullet - used to modify bullet color when bullets are instantiated if custom color is selected in Weapon Configuration.
        /// </summary>
        public SpriteRenderer bulletSpriteRenderer;

        /// <summary>
        /// The direction bullet is travelling in radians.
        /// </summary>
        public float directionAngle;

        /// <summary>
        /// The direction bullet is travelling in degrees.
        /// </summary>
        public float directionDegrees;

        /// <summary>
        /// Used when calculating reflection / ricochet angles when the bullet impacts a collider.
        /// </summary>
        public Vector3 newDirection;

        /// <summary>
        /// Used to set bullet travel direction based on directionAngle
        /// </summary>
        public float bulletXPosition;

        /// <summary>
        /// Used to set bullet travel direction based on directionAngle
        /// </summary>
        public float bulletYPosition;

        /// <summary>
        /// The percent chance this bullet has to ricochet (set from the Weapon configuration that fired the bullet)
        /// </summary>
        public float ricochetChancePercent;

        /// <summary>
        /// Flag to enable / disable ricochet chance
        /// </summary>
        public bool canRichochet;

        /// <summary>
        /// Flag to enable / disable bullet impact effects
        /// </summary>
        public bool useHitEffects;

        /// <summary>
        /// Tag of GameObjects that should generate a 'blood impact' effect if this bullet hits them. For example if you have a subject with tag 'Enemy' and this field is set to 'Enemy', when this bullet hits that subject, as the tags match, a bullet impact effect will be generated. (See demo scenes).
        /// </summary>
        public string bloodEffectTriggerTag;

        /// <summary>
        /// Used to simplify access to the bullet transforms' eulerAngles property.
        /// </summary>
        private Vector3 currentBulletEuler;

        // Use this for initialization
        void Start()
        {
            // Cache the sprite renderer on start when bullets are initially created and pooled for better performance
            bulletSpriteRenderer = gameObject.GetComponent<SpriteRenderer>();
        }

        void OnEnable()
        {
            // When the bullet is enabled, ensure it faces the correct direction
            transform.eulerAngles = new Vector3(0.0f, 0.0f, directionAngle * Mathf.Rad2Deg);
        }

        /// <summary>
        /// Check to determine if a random roll meets the ricochet chance or not.
        /// </summary>
        /// <returns></returns>
        public bool GetRicochetChance()
        {
            return UnityEngine.Random.Range(0f, 100f) < ricochetChancePercent;
        }

        /// <summary>
        /// This is a basic reflection algorithm (works the same way that Vector3.Reflect() works, but specifically for Vector2. Not currently used.
        /// </summary>
        /// <param name="vector"></param>
        /// <param name="normal"></param>
        /// <returns></returns>
        public static Vector2 Reflect(Vector2 vector, Vector2 normal)
        {
            return vector - 2 * Vector2.Dot(vector, normal) * normal;
        }

        void OnCollisionEnter2D(Collision2D coll)
        {
            // Note that you will need a rigidbody2d and Collider2D (not trigger) set up on your bullets to support ricochet behaviour.
            // The objects that you wish bullets to bounce off of, will in turn need their own Collider2D (any type, and not set to trigger).
            // If you wish to tell bullets to ignore collisions on various objects, use layers and edit your Physics2D collision matrix to tell the layer your bullets use to ignore collisions with other layers you don't want involved.

            // Store current rotation
            currentBulletEuler = transform.eulerAngles;

            if (canRichochet)
            {
                // Get the bullet heading/direction based on the collision point and the bullet's current position.
                var heading = coll.contacts[0].point - (Vector2)transform.position;

                // Get a new direction for the bullet by working out it's reflection vector by feeding in the current heading, and the collision point normal.
                newDirection = Vector3.Reflect(heading, coll.contacts[0].normal).normalized;

                // As our bullets are controlled by feeding them an angle to travel in, we need to calculate the new reflected direction angle from our new direction, and convert that to work for eulerangles, then assign that back to the bullet.
                directionAngle = Mathf.Atan2(newDirection.y, newDirection.x);
                transform.eulerAngles = new Vector3(0.0f, 0.0f, directionAngle * Mathf.Rad2Deg);

                // Set a new chance to ricochet up based on the initially set chance to ricochet value.
                canRichochet = GetRicochetChance();
            }
            else
            {
                // If the bullet cannot ricochet, then disable it to send it back to the bullet object pool.
                gameObject.SetActive(false);
            }

            if (useHitEffects)
            {
                if (coll.gameObject.tag == bloodEffectTriggerTag && bulletOwner == BulletOwner.Player)
                {
                    // Fetch a blood splatter particle effect from our object pool to use for the bullet impact effect if enabled.
                    var blood = ObjectPoolManager.instance.GetUsableBloodSplatterParticleEffect();

                    if (blood != null)
                    {
                        blood.transform.position = coll.gameObject.transform.position;
                        blood.transform.eulerAngles = new Vector3(-currentBulletEuler.z, blood.transform.eulerAngles.y, blood.transform.eulerAngles.z);
                        blood.SetActive(true);
                    }
                }
                else
                {
                    // Fetch a hit effect spark from our object pool to use for the bullet impact effect if enabled.
                    var spark = ObjectPoolManager.instance.GetUsableSparkParticle();

                    if (spark != null)
                    {
                        spark.transform.position = transform.position;
                        spark.SetActive(true);
                    }
                }
            }
        }

        // Update is called once per frame
        void Update()
        {
            directionDegrees = directionAngle * Mathf.Rad2Deg;

            if (gameObject != null)
            {
                // Account for bullet movement at any angle
                bulletXPosition += Mathf.Cos(directionAngle) * speed * Time.deltaTime;
                bulletYPosition += Mathf.Sin(directionAngle) * speed * Time.deltaTime;

                transform.position = new Vector2(bulletXPosition, bulletYPosition);

                // If the bullet is no longer visible by the main camera, then set it back to disabled, which means the bullet pooling system will then be able to re-use this bullet.
                if (!bulletSpriteRenderer.isVisible) gameObject.SetActive(false);
            }
        }
    }
}