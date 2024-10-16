/**
 * Sniffs for Older Edge or IE,
 * more info here:
 * https://stackoverflow.com/q/31721250/3528132
 */
function isOlderEdgeOrIE() {
  return (
    window.navigator.userAgent.indexOf("MSIE ") > -1 ||
    !!navigator.userAgent.match(/Trident.*rv\:11\./) ||
    window.navigator.userAgent.indexOf("Edge") > -1
  );
}

function valueTotalRatio(value, min, max) {
  return ((value - min) / (max - min)).toFixed(2);
}

function getLinearGradientCSS(ratio, leftColor, rightColor) {
  return [
    "-webkit-gradient(",
    "linear, ",
    "left top, ",
    "right top, ",
    "color-stop(" + ratio + ", " + leftColor + "), ",
    "color-stop(" + ratio + ", " + rightColor + ")",
    ")",
  ].join("");
}

function updateRangeEl(rangeEl) {
  var ratio = valueTotalRatio(rangeEl.value, rangeEl.min, rangeEl.max);
  /**
   * Sniffs for Older Edge or IE,
   * more info here:
   * https://stackoverflow.com/q/31721250/3528132
   */
  function isOlderEdgeOrIE() {
    return (
      window.navigator.userAgent.indexOf("MSIE ") > -1 ||
      !!navigator.userAgent.match(/Trident.*rv\:11\./) ||
      window.navigator.userAgent.indexOf("Edge") > -1
    );
  }

  function valueTotalRatio(value, min, max) {
    return ((value - min) / (max - min)).toFixed(2);
  }

  function getLinearGradientCSS(ratio, leftColor, rightColor) {
    return [
      "-webkit-gradient(",
      "linear, ",
      "left top, ",
      "right top, ",
      "color-stop(" + ratio + ", " + leftColor + "), ",
      "color-stop(" + ratio + ", " + rightColor + ")",
      ")",
    ].join("");
  }

  function updateRangeEl(rangeEl) {
    var ratio = valueTotalRatio(rangeEl.value, rangeEl.min, rangeEl.max);
    rangeEl.style.backgroundImage = getLinearGradientCSS(
      ratio,
      "#A4FFAF",
      "#18171F"
    );
  }

  function initRangeEl() {
    var rangeEl = document.querySelector("input[type=range]");
    var textEl = document.querySelector("input[type=text]");

    /**
     * IE/Older Edge FIX
     * On IE/Older Edge the height of the <input type="range" />
     * is the whole element as oposed to Chrome/Moz
     * where the height is applied to the track.
     *
     */
    if (isOlderEdgeOrIE()) {
      rangeEl.style.height = "20px";
      // IE 11/10 fires change instead of input
      // https://stackoverflow.com/a/50887531/3528132
      rangeEl.addEventListener("change", function (e) {
        textEl.value = e.target.value;
      });
      rangeEl.addEventListener("input", function (e) {
        textEl.value = e.target.value;
      });
    } else {
      updateRangeEl(rangeEl);
      rangeEl.addEventListener("input", function (e) {
        updateRangeEl(e.target);
        textEl.value = e.target.value;
      });
    }
  }

  initRangeEl();
  rangeEl.style.backgroundImage = getLinearGradientCSS(
    ratio,
    "#A4FFAF",
    "#18171F"
  );
}

function initRangeEl() {
  var rangeEl = document.querySelector("input[type=range]");
  var textEl = document.querySelector("input[type=text]");
  /**
   * IE/Older Edge FIX
   * On IE/Older Edge the height of the <input type="range" />
   * is the whole element as oposed to Chrome/Moz
   * where the height is applied to the track.
   *
   */
  if (isOlderEdgeOrIE()) {
    rangeEl.style.height = "20px";
    // IE 11/10 fires change instead of input
    // https://stackoverflow.com/a/50887531/3528132
    rangeEl.addEventListener("change", function (e) {
      textEl.value = e.target.value;
    });
    rangeEl.addEventListener("input", function (e) {
      textEl.value = e.target.value;
    });
  } else {
    updateRangeEl(rangeEl);
    rangeEl.addEventListener("input", function (e) {
      updateRangeEl(e.target);
      textEl.value = e.target.value;
    });
  }
}

initRangeEl();
