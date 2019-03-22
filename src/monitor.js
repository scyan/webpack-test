const BaseMonitor = require('./base')

class FeMonitor extends BaseMonitor {
  constructor() {
    super()
    this.eventStack = []// 上报事件堆栈
    this.field = ['line', 'project', 'page', 'eventId', 'success', 'eventType', 'apiName', 'code', 'duration', 'message', 'attr', 'time']
    this.baseConfig = {
      reportUrl: 'https://easy-mock.com/mock/5c5918545b9f6b29545faf8d/project/aaa',
      minReportCount: 5, // 最小上报数量
      minReportDelay: 5000, // 最小上报间隔
    }

    this.config = {
      line: '', // 业务线
      project: '', // 项目
      auto: true, // 开启自动上报
    }
    this.definePublicReport()
  }

  setConfig=(config = {}) => {
    try {
      Object.assign(this.config, config)

      // 方便测试修改minReportCount和minReportDelay
      Object.assign(this.baseConfig, config)
    } catch (e) {
      console.log('FeMonitor:', e)
    }
  }

  /**
   * 定义对外开放的上报方法
   * @return {[type]} [description]
   */
  definePublicReport=() => {
    if (this.getEnv() === 'wx') {
      wx._feMonitor = {
        reportApi: this.reportApi,
        reportJsError: this.reportJsError,
        reportEvent: this.reportEvent,
        setPage: this.setPage
      }
    } else if (this.getEnv() === 'web') {
      window._feMonitor = {
        reportApi: this.reportApi,
        reportJsError: this.reportJsError,
        reportEvent: this.reportEvent,
        setPage: this.setPage
      }
    } else if (this.getEnv() === 'weex') {
      weex._feMonitor = {
        reportApi: this.reportApi,
        reportJsError: this.reportJsError,
        reportEvent: this.reportEvent,
        setPage: this.setPage
      }
    }
  }

  /**
   * api自动上报
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  onFetch=(options) => {
    if (this.config.auto) {
      const {
        url, success, duration, code, message,
      } = options
      this.reportApi({
        apiName: url, success, duration, code, message,
      })
    }
  }

  /**
   * js错误自动上报
   * @param  {[type]} message [description]
   * @return {[type]}         [description]
   */
  onJsError=(message) => {
    if (this.config.auto) {
      this.reportJsError({ message })
    }
  }

  /**
   * 页面退出时执行一次上传
   * @return {[type]} [description]
   */
  onPageUnload=() => {
    clearTimeout(this.heart)
    this.upload(this.getReportList(), true)
  }

  /**
   * 是否达到上报条件
   * @return {[type]} [description]
   */
  canReport=() => {
    const { minReportCount, minReportDelay } = this.baseConfig
    const now = +new Date()
    if (this.eventStack.length >= minReportCount || !this.lastReportTime || (now - this.lastReportTime) >= minReportDelay) {
      return true
    }
    return false
  }

  /**
   * 获取上报队列
   * @return {[type]} [description]
   */
  getReportList=() => {
    const reportList = [].concat(this.eventStack)
    this.eventStack = []
    this.lastReportTime = +new Date()
    return reportList
  }

  /**
   * 上报api事件
   * @param  {[type]} api      [description]
   * @param  {[type]} success  [description]
   * @param  {[type]} duration [description]
   * @param  {[type]} code     [description]
   * @param  {String} message  [description]
   * @param  {Object} attr     [description]
   * @return {[type]}          [description]
   */
  reportApi=({
    apiName, success, duration, code, message = '', attr = {},
  }) => {
    if (!apiName || typeof success !== 'boolean') {
      console.error('feMonitor: reportApi方法的apiName和success为必填项')
      return
    }
    this.report({
      eventId: 'apiEvent',
      apiName,
      success,
      duration,
      code,
      message,
      attr,
    })
  }

  /**
   * 上报js错误
   * @param  {[type]} message [description]
   * @param  {Object} attr    [description]
   * @return {[type]}         [description]
   */
  reportJsError=({ message, attr = {} }) => {
    if (!message) {
      console.error('feMonitor: reportJsError 方法的message为必填项')
    }
    this.report({
      eventId: 'jsError',
      success: false,
      message,
      attr,
    })
  }

  /**
   * 自定义上报事件
   * @param  {[type]} options [description]
   * @return {[type]}         [description]
   */
  reportEvent=(options) => {
    if (!options.eventId) {
      console.error('feMonitor: 自定义事件的 eventId不能为空')
      // throw new Error('feMonitor: eventId不能为空')
      return
    }
    this.report(options)
  }

  /**
   * 上报入栈
   * @return {[type]} [description]
   */
  report=(options = {}) => {
    try {
      if (!this.filter(options)) {
        return
      }
      const { line, project } = this.config
      if (!line || !project) {
        console.error('feMonitor: 缺少line或project,请使用setConfig方法设置')
        return
      }
      this.getDefaultAttr().then((defaultAttr) => {
        try {
          const ev = Object.assign({
            line,
            project,
            page: this.getPage(),
            time: Math.floor((+new Date()) / 1000),
            defaultAttr: JSON.stringify(defaultAttr), // 默认参数，设备信息等
          }, options)

          if (ev.attr && typeof ev.attr == 'object') {
            ev.attr = JSON.stringify(ev.attr)
          }

          this.eventStack.push(ev)

          this.checkReport()
        } catch (e) {
          console.error('feMonitor:', e)
        }
      })
    } catch (e) {
      console.error('feMonitor:', e)
    }
  }

  /**
   * 过滤上报字段
   * @return {[type]} [description]
   */
  filter=(options) => {
    for (const key in options) {
      if (this.field.indexOf(key) < 0) {
        console.error(`feMonitor: 非法参数${key}。可使用的参数有：eventId,success,eventType,apiName,code,duration,message,attr`)
        // throw new Error('feMonitor: 非法参数'+key)
        return false
      }
    }
    return true
  }

  /**
   * 自定义页面参数
   * @return {[type]} [description]
   */
  setPage=(page) => {
    this.config.page = page
  }

  /**
   * 获取当前页面
   * @return {[type]} [description]
   */
  getPage=() => {
    if (this.config.page) {
      return this.config.page
    }
    if (this.getEnv() === 'web') {
      return location.href
    } if (this.getEnv() === 'wx') {
      const pages = getCurrentPages()
      if (pages && pages.length) {
        return pages[pages.length - 1].route
      }
    } else if (this.getEnv() === 'weex') {
      return weex.config.bundleUrl
    }


    return ''
  }


  /**
   * 获取设备网络信息等
   * @return {[type]} [description]
   */
  getDefaultAttr=() => new Promise((resolve, reject) => {
    if (this.getEnv() === 'web') {
      const nv = navigator || {}
      resolve({
        ua: nv.userAgent,
        appName: nv.appName,
        appVersion: nv.appVersion,
        minReportDelay: this.baseConfig.minReportDelay,
        minReportCount: this.baseConfig.minReportCount,
        sendBeacon: !!window.navigator.sendBeacon,
      })
    } else if (this.getEnv() === 'wx') {
      wx.getNetworkType({
        complete: (res) => {
          resolve({
            ...wx.getSystemInfoSync(),
            networkType: res && res.networkType || '',
            minReportDelay: this.baseConfig.minReportDelay,
            minReportCount: this.baseConfig.minReportCount,
          })
        },
      })
    } else if (this.getEnv() === 'weex') {
      resolve(weex.config.env)
    }
  })

  checkReport=() => {
    clearTimeout(this.heart);
    if (this.canReport()) {
      this.upload(this.getReportList())
    }
    this.heart = setTimeout(()=>{
      this.checkReport();
    },this.baseConfig.minReportDelay)
  }

  upload=(reportList, unLoad) => {
    if (reportList.length) {
      const { reportUrl } = this.baseConfig
      if (this.getEnv() === 'web') {
        this.syncRequest(reportUrl,JSON.stringify(reportList))
        // if (window.navigator && window.navigator.sendBeacon) {
        //   window.navigator.sendBeacon(reportUrl, JSON.stringify(reportList))
        // } else if (unLoad) {
        //   this.syncRequest(reportUrl,JSON.stringify(reportList))
        // } else {
        //   this.originFetch && this.originFetch.call(window, reportUrl, {
        //     mode: 'cors',
        //     method: 'post',
        //     headers:{'Content-Type': 'application/json; charset=utf-8'},
        //     body: JSON.stringify(reportList),
        //   })
        // }
      } else if (this.getEnv() === 'wx') {
        this.originRequest && this.originRequest({
          url: reportUrl,
          method: 'post',
          data: JSON.stringify(reportList),
        })
      } else if (this.getEnv() === 'weex') {
        const stream = weex.requireModule('stream')
        stream.fetch({
          url: reportUrl,
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          method: 'post',
          body: JSON.stringify(reportList),
        })
      }
    }
  }

  autoJsError=() => !!wx.onError
}
module.exports = new FeMonitor()
