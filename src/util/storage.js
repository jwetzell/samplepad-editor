/* App imports */
import { Drive } from "util/const";
import { getKitFileBuffer } from "util/kitFile";

/* Electron imports */
const fs = window.require('fs');
const path = window.require('path');
const Store = window.require('electron-store');

const store = new Store();

/**
 * Store the directory for next time the app opens
 * @param {String} directory
 */
export function storeLastLoadedDirectory(directory) {
  store.set('lastLoadedDirectory', directory);
}

/**
 * @return {String} the directory used last time the application was open
 */
export function getLastLoadedDirectory() {
  return store.get('lastLoadedDirectory');
}

/**
 * Copy a source sample to the sample directory
 * @param {String} source
 * @return {String} new sample file path
 */
export function copySample(source, destinationDirectory) {
  let sourcePath = path.parse(source);
  let destination = destinationDirectory + "/" + sourcePath.base;

  if(fs.existsSync(destination)) {
    // for now, dont overwrite files
    return;
  }

  try {
    fs.copyFileSync(source, destination);
    return sourcePath.base;
  } catch (err) {
    console.error(err)
    return;
  }
}

/**
 * @param {KitModel} kit
 * @param {Boolean} asNew
 * @returns {Boolean} true if the kit would clobber another
 */
export const kitWillOverwriteExisting = (kit, asNew = false) => {
  if(!fs.existsSync(kit.filePath)) {
    return false;
  }

  let desiredFileName = kit.kitName + Drive.KIT_EXTENSION;
  let currentFileName = kit.fileName;
  let kitFile = kit.filePath + "/" + desiredFileName;

  if (currentFileName.toUpperCase() !== desiredFileName.toUpperCase()) {
    return fs.existsSync(kitFile);
  }

  return false;
}

/**
 * @param {KitModel} kit
 * @param {PadModel[]} pads
 * @param {Boolean} asNew
 * @returns {String} the file name the kit was stored as
 */
export const saveKitToFile = (kit, pads, asNew = false) => {
  if(!fs.existsSync(kit.filePath)) {
    // need to create the kits directory
    fs.mkdirSync(kit.filePath);
  }

  let desiredFileName = kit.kitName + Drive.KIT_EXTENSION;
  let currentFileName = kit.fileName;

  if (asNew) {
    // the kit is being stored as a new kit, drop the reference to the old file
    currentFileName = null;
  }

  let kitFile = kit.filePath + "/" + desiredFileName;
  try {
    // open the file
    fs.open(kitFile, "w", (err, fd) => {
      if (err) throw err;

      // write the kit file
      let buffer = getKitFileBuffer(kit, pads);
      fs.writeSync(fd, buffer, 0, buffer.length);
    });

    if (currentFileName && desiredFileName !== currentFileName && !asNew) {
      // we need to rename the file, too
      fs.renameSync(
        kit.filePath + "/" + currentFileName,
        kit.filePath + "/" + desiredFileName
      );
    }
  } catch (err) {
    console.error(err);
    return;
  }

  return desiredFileName;
}
