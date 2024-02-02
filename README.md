# vue-testing-platform

## Project setup
Install with your favorite package manager. You need to install bootstrap-vue in order for this component library to work
```
pnpm install utd-utilities bootstrap-vue
npm install utd-utilities bootstrap-vue
yarn add utd-utilities bootstrap-vue
```


### Import the necessary files
In your main.js file, add the following imports. 

**IMPORTANT:** Import the bootstrap styling BEFORE importing the UTD Utilities styling

```javascript
// ... other imports

import UTDUtilities from "utd-utilities";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";

// Import Bootstrap and BootstrapVue CSS files
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

// Import UTD Utilities styles
import "utd-utilities/styles.css";
import "utd-utilities/utd-utilities.css";

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(UTDUtilities);
```

