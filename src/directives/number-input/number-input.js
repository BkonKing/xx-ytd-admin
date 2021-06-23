function onInput (el, ele, binding, vnode) {
  function handle () {
    let val = ele.value
    // modifiers为修饰符对象，传入了int，则其int属性为true
    if (binding.modifiers.int) {
      val = ele.value.replace(/[^\d]/g, '')
    } else if (binding.modifiers.EnNum) {
      val = ele.value.replace(/[^A-Za-z0-9]/g, '')
    } else {
      // 清除"数字"和"."以外的字符
      val = val.replace(/[^\d.]/g, '')
      // 只保留第一个, 清除多余的
      val = val.replace(/\.{2,}/g, '.')
      // 第一个字符如果是.号，则补充前缀0
      val = val.replace(/^\./g, '0.')
    }
    ele.value = val
  }

  return handle
}

export default {
  bind (el, binding, vnode) {
    const ele = el.tagName === 'INPUT' ? el : el.querySelector('input')
    ele.addEventListener('input', onInput(el, ele, binding, vnode), false)
  }
}
