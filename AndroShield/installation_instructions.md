# Installation Process

Download or Clone the project and extract the folders under C:\

Note:
 - Make sure you can access "pip" and "sh" from command line.
 - If you are using sql server (not the local of visual studio), you have to change the "connectionString" of "SqlConnection" in "databaseLayer.cs" file.
 - Give project files read, write and execute permissions or run visual studio as administrator.

1. Droidbot installation instructions:
   - Perform the following CMD instructions:
      -	pip install -e C:\droidbot-master      
      -	pip uninstall androguard
      -	pip install androguard==3.0.1

2. AndroShieldApp web application database installation
    - Run this [SQL script](AndroShieldApp/AndroShieldDB.publish.sql) to create the database.

3. AndroidEmulator installation instructions:
    - Download Android x86 API 26 Emulator from Android Studio
    - Copy your Android Emulator files into the following folders (create those folders):
      - C:\AndroidEmulator\\.android\avd	    # Found in C:\Users\<USER>\\.android\avd
      - C:\AndroidEmulator\emulator		       # Found in C:\Users\<USER>\AppData\Local\Android\Sdk\emulator
      - C:\AndroidEmulator\platforms	       # Found in C:\Users\<USER>\AppData\Local\Android\Sdk\platforms
      - C:\AndroidEmulator\platform-tools	    # Found in C:\Users\<USER>\AppData\Local\Android\Sdk\platform-tools
      - C:\AndroidEmulator\system-images	    # Found in C:\Users\<USER>\AppData\Local\Android\Sdk\system-images
      
    - Add user/system variable ANDROID_AVD_HOME -> C:\AndroidEmulator\.android\avd;
    - Add/Append user/system variable Path-> C:\AndroidEmulator\platform-tools;
    - Make sure you restart the working CMD window to reflect the changes
    - To run the emulator (replace "Nexus_4_API_26_NoSkin" with yours):  
         - C:\AndroidEmulator\emulator\emulator.exe -avd Nexus_4_API_26_NoSkin
    - To kill the emulator (After Finishing):
         - adb emu kill

4. Build and Run AndroidShieldApp
   - Make sure C:\production\androShieldCPP.dll dependency exists
