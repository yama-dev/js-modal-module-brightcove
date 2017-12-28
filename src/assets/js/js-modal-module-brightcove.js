"use strict";function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(e,n,i){return n&&t(e.prototype,n),i&&t(e,i),e}}();/*!
 * js-modal-module-brightcove.js JavaScript Library v1.1
 * https://github.com/yama-dev/js-modal-module-brightcove
 * Copyright yama-dev
 * Licensed under the MIT license.
 * Date: 2017-01-30
 * UpDate: 2017-12-29 v1.1
 */
!function(){var t=function(){function t(){var e=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};_classCallCheck(this,t),window.console||(window.console={log:function(t){}}),this.currentUrl=location.href,this.config={mode:n.mode||"brightcove",elem:n.elem||".bmm",videoid:n.videoid||"",account:n.account||"",player:n.player||"default_default",width:n.width||"100%",max_width:n.max_width||"1280px",aspect_ratio:n.aspect_ratio||"4x3",ui_controls:0==n.ui_controls?"":"controls",ui_autoplay:0==n.ui_autoplay?"":"autoplay",ui_close_btn:0!=n.ui_close_btn,duration:n.duration/1e3||.5},this.modalHtml='\n      <div class="modal__bg"></div>\n      <div class="modal__inner">\n        <div class="modal__inner-video">\n        {{videoCode}}\n        </div>\n      </div>',this.config.ui_close_btn&&(this.modalHtml+='<div class="modal__btn-close"></div>'),this.videoCode='\n      <video id="myPlayer"\n        data-video-id="{{ videoid }}"\n        data-account="{{ account }}"\n        data-player="default"\n        data-embed="default"\n        data-application-id\n        class="video-js"\n        width="{{ width }}"\n        {{ui_controls}}\n        {{ui_autoplay}}\n        ></video>',this.modalCss="\n    html,body {\n      position: relative;\n    }\n    .modal.modal--bright {\n      width: 100%;\n      height: 100%;\n      position: fixed;\n      top: 0;\n      left: 0;\n      z-index: 100;\n\n      opacity: 0;\n      -webkit-transform: translate(0, 0);\n      transform: translate(0, 0);\n      -webkit-transition: all {{ duration }}s linear 0s;\n      transition: all {{ duration }}s linear 0s;\n    }\n    .modal.modal--bright.active {\n      opacity: 1;\n      -webkit-transform: translate(0, 0);\n      transform: translate(0, 0);\n      -webkit-transition: all {{ duration }}s linear 0s;\n      transition: all {{ duration }}s linear 0s;\n    }\n    .modal .modal__bg {\n      width: 100%;\n      height: 100%;\n      position: fixed;\n      top: 0;\n      left: 0;\n      background: rgba(0,0,0,.8);\n    }\n    .modal .modal__inner {\n      position: absolute;\n      top: 50%;\n      left: 50%;\n\n      width: {{ width }};\n      max-width: {{ max_width }};\n\n      -webkit-transform: translate(-50%, -50%);\n      transform: translate(-50%, -50%);\n      -webkit-backface-visibility: hidden;\n      backface-visibility: hidden;\n    }\n    .modal .modal__inner .modal__inner-video {\n      position: relative;\n      width: 100%;\n      margin: 0 auto;\n      padding-top: 62.5%;\n    }\n    .modal .modal__inner #myPlayer {\n      position: absolute;\n      top: 0;\n      left: 0;\n\n      width: 100% !important;\n      height: 100% !important;\n      margin: 0 auto;\n    }\n    .modal .modal__inner video {\n      margin: 0 auto;\n    }\n    .modal .modal__btn-close {\n      position: fixed;\n      top: 10px;\n      right: 10px;\n      z-index: 10;\n\n      width: 60px;\n      height: 60px;\n\n      outline: none;\n\n      cursor: pointer;\n      color: #fff;\n\n      opacity: 1;\n      -webkit-transition: opacity .3s linear 0s;\n      transition: opacity .3s linear 0s;\n    }\n    .modal .modal__btn-close::before {\n      content: '×';\n      position: relative;\n      font-size: 100px;\n      line-height: 65px;\n    }\n    .modal .modal__btn-close:hover {\n      opacity: .6;\n      -webkit-transition: opacity .3s linear 0s;\n      transition: opacity .3s linear 0s;\n    }\n    ";for(var i in this.config){var o=(new RegExp("({{.?"+i+".?}})","g"),new RegExp("{{.?("+i+").?}}","g"));this.videoCode.match(o);var a=RegExp.$1;this.videoCode=this.videoCode.replace(o,this.config[a])}for(var l in this.config){var s=(new RegExp("({{.?"+l+".?}})","g"),new RegExp("{{.?("+l+").?}}","g"));this.modalCss.match(s);var d=RegExp.$1;this.modalCss=this.modalCss.replace(s,this.config[d])}this.currentUrl.search(/localhost/)===-1&&this.currentUrl.search(/192.168/)===-1||this.DebugMode(),Element.prototype.hasClass=function(t){var e=this.className.split(" ");return e.indexOf(t)>=0},Element.prototype.addClass=function(t){if(!this.hasClass(t)){var e=this.className.split(" ");e.push(t),this.className=e.join(" ")}return this},Element.prototype.removeClass=function(t){var e=this.className.split(" "),n=e.indexOf(t);return n>=0&&(e.splice(n,1),this.className=e.join(" ")),this},Element.prototype.toggleClass=function(t){this.hasClass(t)?this.removeClass(t):this.addClass(t)},this.modalHtml=this.modalHtml.replace(/{{videoCode}}/g,this.videoCode),this.modalHtmlHtml=document.createElement("div"),this.modalHtmlHtml.className="modal modal--bright",this.modalHtmlHtml.innerHTML=this.modalHtml,this.modalScriptHtml=document.createElement("script"),this.modalScriptHtml.id="myPlayerScript",this.modalScriptHtml.src="//players.brightcove.net/"+this.config.account+"/default_default/index.min.js",this.modalCssHtml=document.createElement("style"),this.modalCssHtml.id="myPlayerCss",this.modalCssHtml.innerHTML=this.modalCss,document.querySelector("head").appendChild(this.modalCssHtml),document.querySelector("head").appendChild(this.modalScriptHtml),document.querySelector("body").appendChild(this.modalHtmlHtml),this.CacheElement(),this.SetPlayer(),this.ModalOpen(),this.$modalCloseElem&&this.$modalCloseElem.addEventListener("click",function(t){e.ModalClose()}),this.$modalBgElem&&this.$modalBgElem.addEventListener("click",function(t){e.ModalClose()})}return _createClass(t,[{key:"DebugMode",value:function(){console.log(this)}},{key:"CacheElement",value:function(){this.$targetElem="",this.$modalElem=document.querySelector(".modal.modal--bright"),this.$modalCloseElem=document.querySelector(".modal .modal__btn-close"),this.$modalBgElem=document.querySelector(".modal .modal__bg"),this.$modalCssElem=document.querySelector("#myPlayerCss"),this.$modalScriptElem=document.querySelector("#myPlayerScript")}},{key:"ModalOpen",value:function(){var t=this;this.$modalElem.style.display="block",setTimeout(function(){t.$modalElem.addClass("active")},20)}},{key:"ModalClose",value:function(){var t=this;this.$modalElem.removeClass("active"),setTimeout(function(){t.$modalElem.style.display="none",t.Destroy()},1500)}},{key:"SetPlayer",value:function(){var t=this;window.videojs?t.LoadedVideojs():setTimeout(function(){return t.SetPlayer(),!1},100)}},{key:"LoadedVideojs",value:function(){videojs("myPlayer").on("loadedmetadata",function(){})}},{key:"Destroy",value:function(){this.$modalElem.remove(),this.$modalCssElem.remove(),this.$modalScriptElem.remove()}}]),t}();window.MODAL_MODULE_BRIGHTCOVE=t||{}}(window);