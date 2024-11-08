interface HTMLElementWithTimer extends HTMLElement {
  _timer?: number
  _startScrolling?: () => void
  _stopScrolling?: () => void
}

export default {
  mounted(el: HTMLElementWithTimer) {
    if (!el) {
      return
    }
    // 自动滚动逻辑
    el._startScrolling = () => {
      el._timer = window.setInterval(() => {
        el.scrollTop += 1
        if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
          el.scrollTop = 0 // 到达底部时回到顶部
        }
      }, 100)
    }

    // 停止滚动逻辑
    el._stopScrolling = () => {
      if (el._timer) {
        clearInterval(el._timer)
      }
    }

    // 绑定鼠标事件
    el.addEventListener('mouseenter', el._stopScrolling)
    el.addEventListener('mouseleave', el._startScrolling)

    // 开始滚动
    el._startScrolling()
  },
  unmounted(el: HTMLElementWithTimer) {
    el._stopScrolling?.()
    el.removeEventListener('mouseenter', el._stopScrolling as EventListener)
    el.removeEventListener('mouseleave', el._startScrolling as EventListener)
  },
}
