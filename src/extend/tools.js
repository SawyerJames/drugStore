/* eslint-disable camelcase */
let tools = {
  /**
   * 从服务器获取数据
   * @param param_object
   * @param param_url
   * @param param_success
   * @param param_error
   * @constructor
   */
  GetDataFromServer: function (param_object, param_url, param_success, param_error) {
    param_object.$http.get(param_url)
      .then(function (response) {
        param_success(response)
      })
      .catch(function (error) {
        param_error(error)
      })
  },
  /**
   * Post数据到服务器
   * @param param_object
   * @param param_url
   * @param param_data
   * @param param_success
   * @param param_error
   * @constructor
   */
  PostDataToServer: function (param_object, param_url, param_data, param_success, param_error) {
    param_object.$http.post(param_url, param_data)
      .then(function (response) {
        param_success(response)
      })
      .catch(function (error) {
        param_error(error)
      })
  },
  /**
   * 设置Cookie
   * @param paramcname
   * @param paramcvalue
   * @param paramhour
   * @constructor
   */
  SetCookie: function (paramcname, paramcvalue, paramhour) {
    let d = new Date()
    d.setTime(d.getTime() + (paramhour * 60 * 60 * 1000))
    let expires = 'expires=' + d.toUTCString()
    document.cookie = paramcname + '=' + paramcvalue + ';' + expires
  },
  /**
   * 获取Cookie
   * @param paramcname
   * @returns {*}
   * @constructor
   */
  GetCookie: function (paramcname) {
    let name = paramcname + '='
    let ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1)
      if (c.indexOf(name) !== -1) return c.substring(name.length, c.length)
    }
    return ''
  },
  /**
   * 清除Cookie
   * @param paramcookie
   * @constructor
   */
  ClearCookie: function (paramcookie) {
    this.SetCookie(paramcookie, '', -1)
  },
  /**
   * 检查Cookie
   * @param paramcookie
   * @returns {boolean}
   * @constructor
   */
  CheckCookie: function (paramcookie) {
    let cookie = this.GetCookie(paramcookie)
    if (cookie !== '') {
      return true
    } else {
      return false
    }
  },
  /**
   * 验证Token
   * @param paramobject
   * @constructor
   */
  CheckToken: function (paramobject) {
    if (this.CheckCookie('UserId') && this.CheckCookie('UserToken')) {
      paramobject.$router.go(0)
    } else {
      paramobject.$router.push('/Login')
    }
  },
  S4: function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  },
  GetGuid: function () {
    return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4())
  },
  // 对Date的扩展，将 Date 转化为指定格式的String
  // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
  // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
  // 例子：
  // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
  // (new Date()).Format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
  FormatDate: function (date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    }
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + ''
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str))
      }
    }
    return fmt
  },
  padLeftZero: function (str) {
    return ('00' + str).substr(str.length)
  }
}
export default tools
