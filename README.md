Minute Inventory is a Inventory Manager built with [Electron](https://www.electronjs.org/) and [React](https://reactjs.org/) using [Electron React Boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate)

## Change log
- v1.1.1
  - Fix a bug where having newline characters in the description created malformed csv files
  - Ran into a [bug](https://github.com/electron-userland/electron-builder/issues/6606) while packaging the app to `dmg`
    - To fix follow the thread between `pan93412` and `mmaietta`:
      - `./node_modules/dmg-builder/out/dmg.js`
        - Change "/usr/bin/python" to "/usr/bin/python3"
      - `./node_modules/dmg-builder/vendor/dmgbuild/core.py`
        - Add `from importlib import reload`
        - Comment out `from __future__ import unicode_literals`
        - Comment out `sys.setdefaultencoding('UTF8')`
- v1.1.0
  - Adds created date
  - Add migration logic for files created in an older version
- v1.0.0
  - Initial release

## To develop:
- `git clone` the repo
- `npm install` the dependencies
  - See electron-react-boilerplate [debugging guide](https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/400) for issues with installing
- `npm start` to start the app in its development environment
- `npm run package` to package the app for the local platform

## Maintainer
- It's a me! [Mminute](https://github.com/mminute)

## Donations
- If you enjoy MinuteInventory and want to support its future development and maintenance you can [buy me a coffee](https://ko-fi.com/mminute)

## Notes
- See `InventoryManager.parseRow()` for details on how commas are handled within imported CSV files

## License

MIT © mminute
