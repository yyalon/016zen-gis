import configs from '@/config/index'

/**
 * 保存图片到本地
 * @param  {String} data     要保存到本地的图片数据（img的src）
 * @param  {String} filename 文件名
 */

export function getRandomTDTKey() {
  const _index = Math.floor(Math.random() * configs.tdtKeys.length)
  return configs.tdtKeys[_index]
}

export function saveImg(data, filename) {
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
  save_link.href = data
  save_link.download = filename

  var event = document.createEvent('MouseEvents')
  event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  save_link.dispatchEvent(event)
}

// 保存文件到本地
export function saveFile (data, name) {
  var urlObject = window.URL || window.webkitURL || window
  var export_blob = new Blob([data])
  var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
  save_link.href = urlObject.createObjectURL(export_blob)
  save_link.download = name
  fakeClick(save_link)
}

function fakeClick (obj) {
  var ev = document.createEvent('MouseEvents')
  ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  obj.dispatchEvent(ev)
}
