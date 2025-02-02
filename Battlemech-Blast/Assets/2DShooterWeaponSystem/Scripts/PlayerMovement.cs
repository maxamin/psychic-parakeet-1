using UnityEngine;
using System.Collections;

namespace ShootingSystem
{

    /// <summary>
    /// Very basic, example player movement script for demo scenes.
    /// </summary>
    public class PlayerMovement : MonoBehaviour
    {

        public enum PlayerMovementType
        {
            Normal,
            FreeAim
        }

        /// <summary>
        /// Sets the player movement type - either normal top down horizontal or vertical (good for shmups), or to FreeAim, which allows for free aiming type top down shooter style controls.
        /// </summary>
        public PlayerMovementType playerMovementType;

        /// <summary>
        /// Reference to a light object used as an example flash light in some demo scenes for the player.
        /// </summary>
        public Light FlashLight;

        /// <summary>
        /// Flag if the player is moving or not.
        /// </summary>
        public bool IsMoving;

        /// <summary>
        /// Movement speed in free aim mode
        /// </summary>
        [Range(1f, 5f)]
        public float freeAimMovementSpeed = 2f;

        private float SmoothSpeedX = 0f;
        private float SmoothSpeedY = 0f; //Don't touch this
        private const float SmoothMaxSpeedX = 7f;
        private const float SmoothMaxSpeedY = 7f; //This is the maximum speed that the object will achieve
        private const float AccelerationX = 22f;
        private const float AccelerationY = 22f; // How fast will object reach a maximum speed
        private const float DecelerationX = 33f;
        private const float DecelerationY = 33f; // How fast will object reach a speed of 0

        private Animator playerAnimator;

        // Use this for initialization
        void Start()
        {

            // If the player has an animator component then get a handle to it and cache it in the playerAnimator field.
            if (gameObject.GetComponent<Animator>() != null)
            {
                playerAnimator = gameObject.GetComponent<Animator>();
            }
        }

        private void moveForward(float amount)
        {
            var moveUp = new Vector3(transform.position.x, transform.position.y + amount * Time.deltaTime, transform.position.z);
            transform.position = moveUp;
        }

        private void moveBack(float amount)
        {
            var moveBack = new Vector3(transform.position.x, transform.position.y - amount * Time.deltaTime, transform.position.z);
            transform.position = moveBack;
        }

        private void moveRight(float amount)
        {
            var moveRight = new Vector3(transform.position.x + amount * Time.deltaTime, transform.position.y, transform.position.z);
            transform.position = moveRight;
        }

        private void moveLeft(float amount)
        {
            var moveLeft = new Vector3(transform.position.x - amount * Time.deltaTime, transform.position.y, transform.position.z);
            transform.position = moveLeft;
        }

        void HandlePlayerToggles()
        {
            if (Input.GetKeyDown(KeyCode.F))
            {
                FlashLight.enabled = !FlashLight.enabled;
            }
        }

        /// <summary>
        /// Not the best player movement code, but it is not the focus of this asset, so for now this works for the demo and allowing the player to move around :)
        /// </summary>
        void HandlePlayerMovement()
        {
            // Get axis information

            var inputX = Input.GetAxis("Horizontal");
            var inputY = Input.GetAxis("Vertical");

            // Once off check to determine if player is moving and set flag accordingly.
            if (Mathf.Abs(inputX) > 0f || Mathf.Abs(inputY) > 0f)
            {
                IsMoving = true;
                if (playerAnimator != null)
                {
                    playerAnimator.SetBool("IsMoving", true);
                }
            }
            else
            {
                IsMoving = false;
                if (playerAnimator != null)
                {
                    playerAnimator.SetBool("IsMoving", false);
                }
            }

            switch (playerMovementType)
            {
                // Normal top down horizontal or vertical style player controls
                case PlayerMovementType.Normal:

                    // Horizontal movement
                    if ((inputX < 0f) && (SmoothSpeedX > -SmoothMaxSpeedX)) //left
                    {
                        SmoothSpeedX = SmoothSpeedX - AccelerationX * Time.deltaTime;
                    }
                    else if ((inputX > 0f) && (SmoothSpeedX < SmoothMaxSpeedX)) //right
                    {
                        SmoothSpeedX = SmoothSpeedX + AccelerationX * Time.deltaTime;
                    }
                    else
                    {
                        if (SmoothSpeedX > DecelerationX * Time.deltaTime)
                            SmoothSpeedX = SmoothSpeedX - DecelerationX * Time.deltaTime;
                        else if (SmoothSpeedX < -DecelerationX * Time.deltaTime)
                            SmoothSpeedX = SmoothSpeedX + DecelerationX * Time.deltaTime;
                        else
                            SmoothSpeedX = 0;
                    }

                    // Vertical movement
                    if ((inputY < 0f) && (SmoothSpeedY > -SmoothMaxSpeedY)) // down
                    {
                        SmoothSpeedY = SmoothSpeedY - AccelerationY * Time.deltaTime;
                    }
                    else if ((inputY > 0f) && (SmoothSpeedY < SmoothMaxSpeedY)) // up
                    {
                        SmoothSpeedY = SmoothSpeedY + AccelerationY * Time.deltaTime;
                    }
                    else
                    {
                        if (SmoothSpeedY > DecelerationY * Time.deltaTime)
                            SmoothSpeedY = SmoothSpeedY - DecelerationY * Time.deltaTime;
                        else if (SmoothSpeedY < -DecelerationY * Time.deltaTime)
                            SmoothSpeedY = SmoothSpeedY + DecelerationY * Time.deltaTime;
                        else
                            SmoothSpeedY = 0;
                    }

                    var newPosition = new Vector2(transform.position.x + SmoothSpeedX * Time.deltaTime, transform.position.y + SmoothSpeedY * Time.deltaTime);
                    transform.position = newPosition;

                    break;

                // top down free aim style player controls
                case PlayerMovementType.FreeAim:

                    if (inputY > 0)
                    {
                        moveForward(freeAimMovementSpeed);
                    }
                    else if (inputY < 0)
                    {
                        moveBack(freeAimMovementSpeed);
                    }

                    if (inputX > 0)
                    {
                        moveRight(freeAimMovementSpeed);
                    }
                    else if (inputX < 0)
                    {
                        moveLeft(freeAimMovementSpeed);
                    }

                    break;
            }

            // Clamp the player to the screen
            var pos = Camera.main.WorldToViewportPoint(transform.position);
            pos.x = Mathf.Clamp(pos.x, 0.05f, 0.95f);
            pos.y = Mathf.Clamp(pos.y, 0.05f, 0.95f);
            transform.position = Camera.main.ViewportToWorldPoint(pos);

        }

        // Update is called once per frame
        void Update()
        {
            HandlePlayerMovement();
            HandlePlayerToggles();
        }
    }

}