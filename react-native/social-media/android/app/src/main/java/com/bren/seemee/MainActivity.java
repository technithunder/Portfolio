package com.bren.seemee;

import android.content.Intent;
import android.media.AudioManager;
import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen; // here

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */

    @Override
    protected String getMainComponentName() {
        return "seemee";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this);
        super.onCreate(savedInstanceState);
        AudioManager am = (AudioManager)this.getSystemService(this.AUDIO_SERVICE);
        am.setMode(AudioManager.MODE_IN_COMMUNICATION);
    }
}
