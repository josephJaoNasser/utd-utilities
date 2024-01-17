import * as components from './components'

const componentsList = components?.default
const UTDPickers =  {
  install(Vue) {
    console.log("build build build")
    Object.keys(componentsList).forEach(name => {
      console.log(name)
      Vue.component(name, componentsList[name])
    })
  }
}

export default UTDPickers