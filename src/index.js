import * as components from './components'

const componentsList = components?.default
const UTDUtilities =  {
  install(Vue) {
    console.log("build build build")
    Object.keys(componentsList).forEach(name => {
      console.log(name)
      Vue.component(name, componentsList[name])
    })
  }
}

export default UTDUtilities