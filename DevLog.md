# Development Log
- Forked [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)
- Setup via [[README]]
  - `npm install`
  - Start development- `npm start`
- Checking out this [vid](https://www.youtube.com/watch?v=j4EYgiAj_2E) to figure out what is going on!!!


## Notes
- Navigation:
  - Use `react-router-dom`
  - Add `Route`s
  - Navigate with `Link`s
  - electron-react-boilerplate uses `MemoryRouter`
    - [Different types of routers in react router](https://learnwithparam.com/blog/different-types-of-router-in-react-router/)
- [Browser Window API](https://www.electronjs.org/docs/v14-x-y/api/browser-window)
- [How to use preload script in electron](https://awsm.page/electron/how-to-use-preload-script-in-electron/)
- [The Ultimate Guide to Electron with React](https://medium.com/folkdevelopers/the-ultimate-guide-to-electron-with-react-8df8d73f4c97)
- Spent a bunch of time trying to figure out how to change the application name in the menu bar but it looks like you have to build the package to be able to see updates to that part [github](https://stackoverflow.com/questions/41551110/unable-to-override-app-name-on-mac-os-electron-menu)
- Updated package.json for productName and ran `npm run package` to produce the .dmg file in order to see if the dmg updates with the correct name. It does!
  - App name in top bar is updated.  Copyright info is wrong in the about menu.
  - updated `release/app/package.json` for author, version, description in order to update the app bar `about` info -> works! but it is not reflected in the dev version :(
- Installed `electron-store` to use for local configuration but ran into errors when running app
  - see [stackoverflow](https://stackoverflow.com/questions/64557638/how-to-polyfill-node-core-modules-in-webpack-5)
  - Added this to webpack.config.base.ts (Also have to npm install these packages):
```
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [webpackPaths.srcPath, 'node_modules'],
    fallback: {
      "path": require.resolve("path-browserify"),
      "util": require.resolve("util/"),
      "crypto": require.resolve("crypto-browserify"),
      "os": require.resolve("os-browserify/browser")
    }
  },
```