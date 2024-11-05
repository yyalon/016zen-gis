interface HTMLElementWithTimer extends HTMLElement {
  _timer?: number
  _startScrolling?: () => void
  _stopScrolling?: () => void
}

export default {
  mounted(el: HTMLElementWithTimer) {
    const tableWrapper = el.querySelector('.el-scrollbar__wrap') as HTMLElementWithTimer

    if (!tableWrapper) {
      return
    }
    // 自动滚动逻辑
    el._startScrolling = () => {
      el._timer = window.setInterval(() => {
        tableWrapper.scrollTop += 1
        if (tableWrapper.scrollTop + tableWrapper.clientHeight >= tableWrapper.scrollHeight) {
          tableWrapper.scrollTop = 0 // 到达底部时回到顶部
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
    tableWrapper.addEventListener('mouseenter', el._stopScrolling)
    tableWrapper.addEventListener('mouseleave', el._startScrolling)

    // 开始滚动
    el._startScrolling()
  },
  unmounted(el: HTMLElementWithTimer) {
    el._stopScrolling?.()
    const tableWrapper = el.querySelector('.el-table__body-wrapper')
    if (tableWrapper) {
      tableWrapper.removeEventListener('mouseenter', el._stopScrolling as EventListener)
      tableWrapper.removeEventListener('mouseleave', el._startScrolling as EventListener)
    }
  },
}
