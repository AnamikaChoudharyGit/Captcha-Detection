/**
 * @module CaptchaParser
 */

/**
 * @function CaptchaParse
 * @param {ImageBitmap} imgarr
 * The main captcha parsing algorithm
 */
const CaptchaParse = imgarr => {
  let captcha = "";
  // for (let x = 1; x < 57; x++) {
  //   for (let y = 1; y < 90; y++) {
  //     const condition1 =
  //       imgarr[x][y - 1] === 255 &&
  //       imgarr[x][y] === 0 &&
  //       imgarr[x][y + 1] === 255;
  //     const condition2 =
  //       imgarr[x - 1][y] === 255 &&
  //       imgarr[x][y] === 0 &&
  //       imgarr[x + 1][y] === 255;
  //     const condition3 = imgarr[x][y] !== 255 && imgarr[x][y] !== 0;
  //     if (condition1 || condition2 || condition3) {
  //       imgarr[x][y] = 255;
  //     }
  //   }
  // }
  for (let j = 6; j <75; j += 13) { //30--181--+30
    let matches = [];
    const chars = "0123456789";
    for (let i = 0; i < chars.length; i++) {
      let match = 0;
      let black = 0;
      const ch = chars.charAt(i);
      const mask = bitmaps[ch];
      for (let x = 0; x < 45; x++) { //32
        for (let y = 0; y < 13; y++) {  //30
          let y1 = y + j ;
          let x1 = x ;
          if (imgarr[x1][y1] == mask[x][y] && mask[x][y] == 255) {
            match += 1;
          }
          if (mask[x][y] == 255) {
            black += 1;
          }
        }
      }
      const perc = match / black;
      matches.push([perc, ch]);
    }
    captcha += matches.reduce(
      function(a, b) {
        return a[0] > b[0] ? a : b;
      },
      [0, 0]
    )[1];
  }
  return captcha;
};

/**
 * @function convertURIToImageData
 * @param {String} URI
 * Converts a base64 encoded string to an image
 */
const convertURIToImageData = URI => {
  return new Promise(function(resolve, reject) {
    if (URI == null) return reject();
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    let image = new Image();
    image.addEventListener(
      "load",
      function() {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      },
      false
    );
    image.src = URI;
  });
};

/**
 * @function fillCaptcha
 * @param {String} imgb64
 * Fills the captcha text input
 */
const fillCaptcha = imgb64 => {
  const URI = imgb64;
  convertURIToImageData(URI).then(imageData => {
    let arr = [];
    let newArr = [];
    for (let i = 0; i < imageData["data"].length; i += 4) {
      let gval =
        imageData["data"][i] * 0.299 +
        imageData["data"][i + 1] * 0.587 +
        imageData["data"][i + 2] * 0.114;
      arr.push(gval);
    }
    while (arr.length) newArr.push(arr.splice(0, 180));
    const res = CaptchaParse(newArr);
    document.getElementById("capcha").value = res;
  });
};

/**
 * @function SolveCap
 * @param {DOMElement}
 * Does the middleman works and concludes
 */
const SolveCap = img => {
  const startTime = new Date().getTime();
  const im = img.src;
  fillCaptcha(im);
  const endTime = new Date().getTime();
  const time = endTime - startTime;
  console.log("Captcha parsed in " + time + " ms.");
  console.log("Made with ♥, CollegeCODE");
  // const k = document.getElementsByClassName("col-md-offset-1");
  // const credsHolder = document.createElement("center");
  // const creds = document.createTextNode(
  //   "AutoCaptcha - Made with ♥, CollegeCODE"
  // );
  // credsHolder.appendChild(creds);
  // k[0].appendChild(credsHolder);
};

window.addEventListener("load", myMain, false);

function myMain(evt) {
  const jsInitChecktimer = setInterval(checkForJS_Finish, 111);

  function checkForJS_Finish() {
  	const x= document.getElementById("login_form");
    if (x.getElementsByTagName("img")[0]) {
      clearInterval(jsInitChecktimer);
      // DO YOUR STUFF HERE.
      SolveCap(x.getElementsByTagName("img")[0]);
      let observer = new MutationObserver(function() {
        SolveCap(x.getElementsByTagName("img")[0]);
      });
     
    }
  }
}