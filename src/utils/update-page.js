const Time = 5 * 1000

let timer = []

const startUpdate = fn => {
  timer[timer.length] = setTimeout(() => {
    fn()
      .then(({ code }) => {
        if (code === 200) {
          updatePage(fn)
        }
      })
  }, Time)
}

export const updatePage = (fn, first) => {
  if (typeof fn === 'function') {
    if (first) {
      // 第一次进入页面发起一次请求
      fn()
        .then(() => {
          updatePage(fn)
        })
    } else {
      startUpdate(fn)
    }
  }
}

export const stopUpdatePage = () => {
  for (let i = 0, len = timer.length; i < len; i++) {
    if (timer[i]) {
      clearTimeout(timer[i])
    }
  }
  timer = []
}
