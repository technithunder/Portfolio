export const removeSlot = function () {
  if (window) {
    const { googletag } = window;
    googletag?.cmd?.push(function () {
      googletag.destroySlots();
    });
  }
};

export const defineAdSlot = function (name, id, sizes = [], params = {}) {
  if (window) {
    const { googletag } = window;
    const render = () => {
      // googletag.defineSlot(`${name}`, sizes, id).addService(googletag.pubads());
      // googletag.pubads().enableSingleRequest();
      // googletag.enableServices();
      // googletag.display(id);

      googletag.cmd.push(function () {
        googletag
          .defineSlot(`${name}`, sizes, id)
          .addService(googletag.pubads());
        googletag.pubads().enableSingleRequest();
        googletag.enableServices();
        googletag.display(id);
      });
    };

    googletag?.cmd?.push(function () {
      try {
        render();
      } catch (e) {
        removeSlot();
        render();
      }
    });
  }
};

export const defineInterstitialSlot = (params = {}) => {
  if (window) {
    const { googletag } = window;
    const render = () => {
      let interstitialSlot;
      interstitialSlot = googletag.defineOutOfPageSlot(
        "/6355419/Travel/Europe/France/Paris",
        googletag.enums.OutOfPageFormat.INTERSTITIAL
      );
      interstitialSlot.setForceSafeFrame(true);

      if (interstitialSlot) {
        interstitialSlot.addService(googletag.pubads());

        // document.getElementById("status").innerText =
        //   "Interstitial is loading...";

        // Add event listener to enable navigation once the interstitial loads.
        // If this event doesn't fire, try clearing local storage and refreshing
        // the page.
        googletag.pubads().addEventListener("slotOnload", function (event) {
          if (interstitialSlot === event.slot) {
            document.getElementById("link").style.display = "block";
            document.getElementById("status").innerText =
              "Interstitial is loaded.";
          }
        });
      }
    };

    googletag?.cmd?.push(function () {
      try {
        render();
      } catch (e) {
        removeSlot();
        render();
      }
    });
  }
};
