- Ionic serve 

- Android manifiest
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

- Android folder: 
  Geolocation.java
  Comment
  /*if (!availability.isLocationAvailable()) {
    resultCallback.error("location unavailable");
    clearLocationUpdates();
  }*/

  QRScanner.java 
  import androidx.core.app.ActivityCompat;

  FileProvider.java
  SocialSharing.java
  androidx.core.content.FileProvider


- Commands
  ionic cap copy
  ionic cap sync
  ionic cap run android

  ionic serve
  ionic build
  ionic cap add android
  ionic cap copy
  ionic cap sync
  ionic cap run android