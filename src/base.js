class BaseMonitor {
  constructor() {
    try {
      this.reWriteEvent()
      this.listenFetch()
      this.listenJsError()
      this.listenPageUnload()
    } catch (e) {
      console.error('FeMonitor:', e)
    }
  }

  getEnv() {
    try {
      if (this.env) {
        return this.env
      }
      if (typeof window === 'object') {
        this.env = 'web'
      } else if (typeof wx === 'object') {
        this.env = 'wx'
      } else if (typeof weex === 'object') {
        this.env = 'weex'
      }

      return this.env
    } catch (e) {
      return ''
    }
  }

  reWriteEvent() {
    if (this.getEnv() === 'web' && document.write) {
      document.write(`<script>
      const originAddEventListener = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (type, listener, options) {
        const wrappedListener = function (...args) {
          try {
            return listener.apply(this, args);
          }
          catch (err) {
            throw err;
          }
        }
        return originAddEventListener.call(this, type, wrappedListener, options);
      }</script>`)
    }
  }

  /**
   * [reWriteFetch description]
   * @return {[type]} [description]
   */
  listenFetch() {
    const _this = this
    if (this.getEnv() === 'web') {
      if(window.fetch){

        this.originFetch = window.fetch
        const originFetch = window.fetch
        window.fetch = function (url, options) {
          const startTime = +new Date()
          return originFetch.call(this, url, options).then((response) => {
            _this.onFetch({
              url, success: response.ok, duration: (+new Date()) - startTime, code: response.status, message: response.statusText,
            })
            return response
          }).catch((err) => {
            _this.onFetch({
              url, success: false, duration: (+new Date()) - startTime, code: 0, message: err && err.message || '',
            })
            throw err
          })
        }
      }
      if(window.XMLHttpRequest){
        this.XMLHttpRequest = window.XMLHttpRequest
        class newXhr extends XMLHttpRequest{
          constructor(){
            super()
          }
          open(){
            this.startTime = +new Date();
            super.open(...arguments)
            let url = arguments[1]
              this.addEventListener('readystatechange',function(){
                console.log('myreadystatechange')
               if(this.readyState==4){
                let dur = (+new Date())-this.startTime
                if(this.status==200){
                    _this.onFetch({
                      url, success: true, duration: dur, code: 200
                    })
                }else{
                  _this.onFetch({
                    url, success: false, duration: dur, code: this.status, message: this.responseText || '',
                  })
                }
              }
            })
          }
        }
        window.XMLHttpRequest = newXhr
        // let originOpen = XMLHttpRequest.prototype.open;
        // XMLHttpRequest.prototype.open=function(){
        //   this.startTime = +new Date();
        //   let url = arguments[1]
        //   originOpen.call(this,...arguments);
        //   this.addEventListener('readystatechange',function(){
        //      if(this.readyState==4){
        //     let dur = (+new Date())-this.startTime
        //     if(this.status==200){
        //         _this.onFetch({
        //           url, success: true, duration: dur, code: 200
        //         })
        //     }else{
        //       _this.onFetch({
        //         url, success: false, duration: dur, code: this.status, message: this.responseText || '',
        //       })
        //     }
        //     }
        //   })
        // }
      }
    } else if (this.getEnv() === 'wx') {
      const originRequest = wx.request
      this.originRequest = originRequest

      const newRequest = function (options) {
        const startTime = +new Date()
        const originSuccess = options.success
        const originFail = options.fail

        return originRequest.call(this, {
          ...options,
          success: (res) => {
            _this.onFetch({
              url: options.url, success: true, duration: (+new Date()) - startTime, code: res.statusCode, message: res.errMsg || '',
            })

            originSuccess && originSuccess(res)
          },
          fail: (err) => {
            _this.onFetch({
              url: options.url, success: false, duration: (+new Date()) - startTime, code: err.statusCode, message: err.errMsg || '',
            })

            originFail && originFail(err)
          },
        })
      }

      Object.defineProperty(wx, 'request', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: newRequest,
      })

      wx.request = newRequest
    }
  }

  onFetch=() => {}

  /**
   * 监听js报错
   * @return {[type]} [description]
   */
  listenJsError() {
    if (this.getEnv() === 'web' && window.addEventListener) {
      window.addEventListener('error', (evt) => {
        const info = evt.error ? evt.error.stack : evt.message
        this.onJsError(info)
        // document.querySelector('#info').textContent = info;
      })
    } else if (this.getEnv() === 'wx' && wx.onError) {
      wx.onError((msg) => {
        this.onJsError(msg)
      })
    }
  }

  onJsError=() => {}

  /**
   * 监听页面退出
   * @return {[type]} [description]
   */
  listenPageUnload() {
    if (this.getEnv() === 'web') {
      window.addEventListener('beforeunload', (e) => {
        this.onPageUnload()
      })
      window.addEventListener('unload', (e) => {
        this.onPageUnload()
      })
      window.Fusion && window.Fusion.registerEventListener({ event: 'UIApplicationDidEnterBackgroundNotification' }, (data) => {
        this.onPageUnload()
      })
    } else if (this.getEnv() === 'weex') {
      const globalEvent = weex.requireModule('globalEvent')
      globalEvent.addEventListener('WXApplicationWillResignActiveEvent', function (e) {
        this.onPageUnload()
      })
      globalEvent.addEventListener('UIApplicationDidEnterBackgroundNotification', function (e) {
        this.onPageUnload()
      })
    } else if (this.getEnv() === 'wx' && wx.onAppHide) {
      wx.onAppHide(() => {
        this.onPageUnload()
      })
    }
  }

  onPageUnload=() => {}

  syncRequest = (url, params) => {
    const http = new this.XMLHttpRequest()
    http.open('POST', url, false)
    http.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    http.send(params)
  }
}
module.exports = BaseMonitor
