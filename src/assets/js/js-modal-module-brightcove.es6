/*!
 * js-modal-module-brightcove.js JavaScript Library v1.1
 * https://github.com/yama-dev/js-modal-module-brightcove
 * Copyright yama-dev
 * Licensed under the MIT license.
 * Date: 2017-01-30
 * UpDate: 2017-12-29 v1.1
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
      width        : options.width||'100%',
      max_width    : options.max_width||'1280px',
      aspect_ratio : options.aspect_ratio||'4x3',
      ui_controls  : options.ui_controls == false ? '' : 'controls',
      ui_autoplay  : options.ui_autoplay == false ? '' : 'autoplay',
      ui_close_btn : options.ui_close_btn == false ? false : true,
      duration     : (options.duration / 1000)||0.5
    }

    this.modalHtml = `
      <div class="modal__bg"></div>
      <div class="modal__inner">
        <div class="modal__inner-video">
        {{videoCode}}
        </div>
      </div>`;

    // Set Close-Btn
    if(this.config.ui_close_btn){
      this.modalHtml += '<div class="modal__btn-close"></div>';
    }

    this.videoCode = `
      <video id="myPlayer"
        data-video-id="{{ videoid }}"
        data-account="{{ account }}"
        data-player="default"
        data-embed="default"
        data-application-id
        class="video-js"
        width="{{ width }}"
        {{ui_controls}}
        {{ui_autoplay}}
        ></video>`;

    this.modalCss = `
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
      -webkit-transform: translate(0, 0);
      transform: translate(0, 0);
      -webkit-transition: all {{ duration }}s linear 0s;
      transition: all {{ duration }}s linear 0s;
    }
    .modal.modal--bright.active {
      opacity: 1;
      -webkit-transform: translate(0, 0);
      transform: translate(0, 0);
      -webkit-transition: all {{ duration }}s linear 0s;
      transition: all {{ duration }}s linear 0s;
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
      position: absolute;
      top: 50%;
      left: 50%;

      width: {{ width }};
      max-width: {{ max_width }};

      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
    }
    .modal .modal__inner .modal__inner-video {
      position: relative;
      width: 100%;
      margin: 0 auto;
      padding-top: 62.5%;
    }
    .modal .modal__inner #myPlayer {
      position: absolute;
      top: 0;
      left: 0;

      width: 100% !important;
      height: 100% !important;
      margin: 0 auto;
    }
    .modal .modal__inner video {
      margin: 0 auto;
    }
    .modal .modal__btn-close {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 10;

      width: 60px;
      height: 60px;

      outline: none;

      cursor: pointer;
      color: #fff;

      opacity: 1;
      -webkit-transition: opacity .3s linear 0s;
      transition: opacity .3s linear 0s;
    }
    .modal .modal__btn-close::before {
      content: '×';
      position: relative;
      font-size: 100px;
      line-height: 65px;
    }
    .modal .modal__btn-close:hover {
      opacity: .6;
      -webkit-transition: opacity .3s linear 0s;
      transition: opacity .3s linear 0s;
    }
    `;

    // Set ScriptCode
    for (let obj in this.config) {
      let _reg = new RegExp('({{.?' + obj + '.?}})','g');
      let _regIn = new RegExp('{{.?(' + obj + ').?}}','g');
      this.videoCode.match(_regIn);
      let _regInStr = RegExp.$1;
      this.videoCode = this.videoCode.replace(_regIn, this.config[_regInStr]);
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
    // -> create modal element
    this.modalHtml = this.modalHtml.replace(/{{videoCode}}/g,this.videoCode);
    this.modalHtmlHtml = document.createElement('div');
    this.modalHtmlHtml.className = "modal modal--bright";
    this.modalHtmlHtml.innerHTML = this.modalHtml;
    // -> create script element
    this.modalScriptHtml = document.createElement('script');
    this.modalScriptHtml.id = "myPlayerScript";
    this.modalScriptHtml.src = "//players.brightcove.net/20318290001/default_default/index.min.js";
    // -> create style element
    this.modalCssHtml = document.createElement('style');
    this.modalCssHtml.id = "myPlayerCss";
    this.modalCssHtml.innerHTML = this.modalCss;
    // -> append elements.
    document.querySelector('head').appendChild(this.modalCssHtml);
    document.querySelector('head').appendChild(this.modalScriptHtml);
    document.querySelector('body').appendChild(this.modalHtmlHtml);

    // CacheElement
    this.CacheElement();

    // ModalOpen
    this.SetPlayer();
    this.ModalOpen();
    if(this.$modalCloseElem){
      this.$modalCloseElem.addEventListener('click', (event) => {
        this.ModalClose();
      });
    }
    if(this.$modalBgElem){
      this.$modalBgElem.addEventListener('click', (event) => {
        this.ModalClose();
      });
    }
  }
  DebugMode(){
    console.log(this);
  }
  CacheElement(){
    this.$targetElem      = '';
    this.$modalElem       = document.querySelector('.modal.modal--bright');
    this.$modalCloseElem  = document.querySelector('.modal .modal__btn-close');
    this.$modalBgElem     = document.querySelector('.modal .modal__bg');
    this.$modalCssElem    = document.querySelector('#myPlayerCss');
    this.$modalScriptElem = document.querySelector('#myPlayerScript');
  }
  ModalOpen(){
    this.$modalElem.style.display = 'block';
    setTimeout( () => {
      this.$modalElem.addClass('active');
    }, 20);
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
    this.$modalScriptElem.remove();
  }
}
window.MODAL_MODULE_BRIGHTCOVE = MODAL_MODULE_BRIGHTCOVE || {};
})(window);

