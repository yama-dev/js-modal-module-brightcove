/*!
 * js-modal-module-brightcove.js JavaScript Library v1.0
 * https://github.com/yama-dev/js-modal-module-brightcove
 * Copyright yama-dev
 * Licensed under the MIT license.
 * Date: 2017-01-30
 */
(function(){
class MODAL_MODULE_BRIGHTCOVE {
  constructor(options = {}){
    if(!window.console) {window.console = { log: function(msg){} };}
    // URLでの判別に利用
    this.currentUrl = location.href;
    // オプション設定用
    this.config = {
      mode         : options.mode||'brightcove',
      elem         : options.elem||'.bmm',
      videoid      : options.videoid||'',
      account      : options.account||'',
      player       : options.player||'default_default',
      width        : options.width||'1090',
      height       : options.height||'630',
      ui_controls  : options.ui_controls == false ? '' : 'controls',
      ui_autoplay  : options.ui_autoplay == false ? '' : 'autoplay',
      positiontop  : options.positiontop||'200'
    }

    // Set Css position-top
    if(!/%/.test(this.config.height)){
      this.config.positiontop = (window.innerHeight - this.config.height) * 0.5;
      this.config.positiontop = String(this.config.positiontop + 'px');
    } else if(/%/.test(this.config.height) && this.config.height == '100%'){
      this.config.positiontop = 0;
    } else {
      this.config.positiontop = 0;
    }

    this.modalHtml = `
      <div class="modal modal--bright">
        <div class="modal__bg"></div>
        <div class="modal__inner">
        {{scriptCode}}
        </div>
        <div class="modal__btn-close"></div>
      </div>`;

    this.scriptCode = `
      <video id="myPlayer"
        data-video-id="{{ videoid }}"
        data-account="{{ account }}"
        data-player="default"
        data-embed="default"
        data-application-id
        class="video-js"
        width="{{ width }}"
        height="{{ height }}"
        {{ui_controls}}
        {{ui_autoplay}}
        ></video>
      <script src="//players.brightcove.net/{{ account }}/{{ player }}/index.min.js"></script>`;

    this.modalCss = `
    <style id="myPlayerCss">
    html,body {
      position: relative;
    }
    .modal.modal--bright {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 100;

      opacity: 0;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
      -webkit-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      transform: translate(0, 0);
      -webkit-transition: all 1s linear 0s;
      transition: all 1s linear 0s;
    }
    .modal.modal--bright.active {
      opacity: 1;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
      -webkit-transform: translate(0, 0);
      -ms-transform: translate(0, 0);
      transform: translate(0, 0);
      -webkit-transition: all 1s linear 0s;
      transition: all 1s linear 0s;
    }
    .modal .modal__bg {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0,0,0,.8);
    }
    .modal .modal__inner {
      width: 100%;
      height: 100%;
    }
    .modal .modal__inner #myPlayer {
      margin: 0 auto;
      top: {{ positiontop }};
    }
    .modal .modal__inner video {
      margin: 0 auto;
    }
    .modal .modal__btn-close {
      width: 78px;
      height: 65px;
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABBCAYAAAB//JLIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABRhJREFUeNrsW39kVVEc//Z2jYgRMSIiImKzlFKaKFEaUxppllKkidIUKU1ZSon6p5RljyxllNI0TSmlp1WMiIgYI1LEY4y+X/uc7tvr9XZ/nHPuue/tw8fm/bjv3M895/s593zumdP2/idFwH7mMPMLVRfqmceYJzMRD7CFOcCcV0WiLWe+Za5l1kUVrp1Zw+yrEtE2M19jlK1jjkcV7hezhbmBearCRTvCfMQ8x9zDnJAXvRgHlPrWhoN+ZD6sMMFqmdeZO3Ge9wvfzMQ8+CDzBIbssgoSbT7zKUZUc7FoOoQTXISAD6RoVoBoS2ACc5mrmLlSH8po+jEZ+7+Z/TCNNJvAW5Qe6Wnj//ugLuHyMIsmZk9KRTuEen2DuQPn9F94Gn/4G35QasMI825KBJMRcoW5F9OsO0G+5GluxAvmUWYv8zO6vMuQCfw9ZgOGZi7oFz0DjbmGhohZrGB+d9gEpI2TMIFvYb6cMdSog8wxXM1aB0VbDxMQsdaEFc2kcDK7bsVVveSYaB2ow2ICWzEbCA3PYAPHId5L1LpbDojWg1uoA8zbcQ7kGW5oDo2UW5dPzDcJmoDMMVczN8HEyGXhCFdWzGIAZjFmWbRFmJ/VwgS0rCFmLDX+KHrcgGWzWAkTGMNF07bwaku4SawwLMCwtYHtzOe4QY9sAkkLR5jPtWCZ5rDh3zqLmtbF7MSF0wqP7GIUtzX9+H9Y8/FlRUOWuDaglw2aOpEM2YcMnfMQb7HG49ZjaDbABAZNnkQSwglOY6ryAL0kLlSQktfpnC4KJzVnFxw2buAjJqCCFJmj/bBxAkkJJ1CBz0aayiqj4DiGvPTgv0GKDXiULD6j5w3ALILWJRWkbDdtAi72OIXHzG70nCUBPl8YpKxJQjRXhBNIZjlEMwc+YgIfyA9SRpNqsCvCEeZ3k2XMojBNb6YyQUq1CacCH1nBOFP0ngpSVJqeT7qxHrmFr7inlRqmng5QQco/afqscNMxjNWUPtSwRRQySKm2oVrstFLvVmJSm3OtgS4Kp4IUcdkRDNWaWeHKYy/5QYqE262YglxwTThXalxhmr6PmcXrYxDvOcwiOyucj5nSdAl4DpIf+IzMCucHKUTl0/Rb5D8d0EgOPB2QZI1bTX6QEiRNlynKF7If+DglXAfqVpaCBykTMAzppVerUbge1CsJqrsoXJCiAp/dNLXXoipqXGGQEidN/4j71T6YxatKFm4hatN80pMJyEOLTThmI9l/OsDKUJXbpnc0lQU0kr4g5QSmJroCH6eEM5mmq6cD6sje0wFWhFNBirE0nfzAZxtNPb6V6ho3Fz1gG9kJUsQg2skPfIbSKFw9ao6YgNang2aALHiqwCd1gbT1NL0I3ZjiWNkOqku4wiDFWppeAu3425cG4Y5geHaT5TS9BMS1ZRlKFkONbgeNU+MK0/QWSigYLgG1HfQJGdwOGrXHOZGml8EQpkHGtoNGEa54W+IouYnL6G1GtoOGFU5tS5RV2WZKOE0PgAOYJGvfDhpGOJWmX4R75cl9GNsOGsQcCoMUp9L0gFCBzzPSuB10JuEib0t0DK9wv9yLW7RRk0NVmYA4aGOKRVOQrDYLs1hgSjiVpn9KiQkERSeGbmyzKCVcB01P0/NUOVDbQZdSzO2gxTVOnOcwadiW6DBU4KO2g96OI5zaltiUchMIihF0jpsoR7kowgVN0ysNWZq+HXQ8rHA1uAKdpHmHXQrQhfMPvaz/R4ABAPiXNc/nZiscAAAAAElFTkSuQmCC);
      position: fixed;
      top: 10px;
      right: 10px;
      outline: none;
      z-index: 9999;
      cursor: pointer;

      opacity: 1;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
      -webkit-transition: opacity .3s linear 0s;
      transition: opacity .3s linear 0s;
    }
    .modal .modal__btn-close:hover {
      opacity: .6;
      -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)";
      -webkit-transition: opacity .3s linear 0s;
      transition: opacity .3s linear 0s;
    }
    </style>`;

    // Set ScriptCode
    for (let obj in this.config) {
      let _reg = new RegExp('({{.?' + obj + '.?}})','g');
      let _regIn = new RegExp('{{.?(' + obj + ').?}}','g');
      this.scriptCode.match(_regIn);
      let _regInStr = RegExp.$1;
      this.scriptCode = this.scriptCode.replace(_regIn, this.config[_regInStr]);
    }

    // Set Offset-Top
    for (let obj2 in this.config) {
      let _reg2 = new RegExp('({{.?' + obj2 + '.?}})','g');
      let _regIn2 = new RegExp('{{.?(' + obj2 + ').?}}','g');
      this.modalCss.match(_regIn2);
      let _regInStr2 = RegExp.$1;
      this.modalCss = this.modalCss.replace(_regIn2, this.config[_regInStr2]);
    }

    // DebugMode
    if(this.currentUrl.search(/localhost/) !== -1 || this.currentUrl.search(/192.168/) !== -1){
      this.DebugMode();
    } else { }

    Element.prototype.hasClass = function(className){
      var classArray = this.className.split(' ');
      return classArray.indexOf(className) >= 0;
    }
    Element.prototype.addClass = function(className){
      if(!this.hasClass(className)){
        var classArray = this.className.split(' ');
        classArray.push(className);
        this.className = classArray.join(' ');
      }
      return this;
    }
    Element.prototype.removeClass = function(className){
      var classArray = this.className.split(' ');
      var index = classArray.indexOf(className);
      if(index >= 0){
        classArray.splice(index, 1);
        this.className = classArray.join(' ');
      }
      return this;
    }
    Element.prototype.toggleClass = function(className){
      this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
    }


    // Player
    this.modalHtml = this.modalHtml.replace(/{{scriptCode}}/g,this.scriptCode);
    $('head').append(this.modalCss);
    $('body').append(this.modalHtml);

    // CacheElement
    this.CacheElement();

    // ModalOpen
    this.SetPlayer();
    this.ModalOpen();
    this.$modalCloseElem.addEventListener('click', (event) => {
      this.ModalClose();
    });
  }
  DebugMode(){
    console.log(this);
  }
  CacheElement(){
    this.$targetElem     = '';
    this.$modalElem      = document.querySelector('.modal.modal--bright');
    this.$modalCloseElem = document.querySelector('.modal .modal__btn-close');
    this.$modalBgElem    = document.querySelector('.modal .modal__bg');
    this.$modalCssElem   = document.querySelector('#myPlayerCss');
  }
  ModalOpen(){
    this.$modalElem.style.display = 'block';
    setTimeout( () => {
      this.$modalElem.addClass('active');
    }, 200);
  }
  ModalClose(){
    this.$modalElem.removeClass('active');
    setTimeout( () => {
      this.$modalElem.style.display = 'none';
      this.Destroy();
    }, 1500);
  }
  SetPlayer(){
    let _that = this;
    if(!window.videojs){
      setTimeout(function() {
        _that.SetPlayer();
        return false;
      }, 100);
    } else {
      _that.LoadedVideojs();
    }
  }
  LoadedVideojs(){
    let _that = this;
    videojs("myPlayer").on('loadedmetadata', function() {
      var myPlayer = this;
      // myPlayer.play();
    });
  }
  Destroy(){
    this.$modalElem.remove();
    this.$modalCssElem.remove();
  }
}
window.MODAL_MODULE_BRIGHTCOVE = MODAL_MODULE_BRIGHTCOVE || {};
})(window);

