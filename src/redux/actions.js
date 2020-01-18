import { KitModel } from "../redux/models";
import { Actions, Drive } from '../util/const'
import { getGlobalStateFromDirectory, getKitAndPadsFromFile, openKitFileDialog, openDriveDirectoryDialog, saveKitToFile} from "../util/fileParser";
import { storeLastLoadedDirectory } from "../util/storage";

/** DRIVE ACTION CREATORS */
/**
 * Open a file dialog, and parse the resulting directory as a SamplePad drive
 */
export function selectAndLoadDrive() {
  return (dispatch) => {
    openDriveDirectoryDialog()
      .then(result => {
        if (result.canceled) {
          return null;
        }

        storeLastLoadedDirectory(result.filePaths[0]);
        dispatch(loadDrive(result.filePaths[0]));
      })
  }
}
/**
 * Parse kits, samples, and drive details from the given directory
 * @param {String} drivePath - root path of the SamplePad drive
 */
export function loadDrive(drivePath) {
  return (dispatch) => {
      let {drive, kits} = getGlobalStateFromDirectory(drivePath);
      dispatch({ type: Actions.LOAD_DRIVE, drive: drive });
      dispatch({ type: Actions.ADD_KITS, kits: kits });
  }
}

/** KIT ACTION CREATORS */
/**
 * Open a file dialog, and parse the resulting file as a SamplePad kit
 */
export function importKitFromFile() {
  return (dispatch) => {
    openKitFileDialog()
      .then(result => {
        if (result.canceled) {
          return null;
        }

        let {kit, pads} = getKitAndPadsFromFile(result.filePaths[0]);
        dispatch({ type: Actions.ADD_PADS, pads: pads });
        dispatch({ type: Actions.ADD_KIT, kit: kit });
        dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: kit.id });
        dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: kit.id });
      })
  }
}
/**
 * load kit details from kit file
 * @param {String} kitId
 */
export function loadKitDetails(kitId) {
  return (dispatch, getState) => {
    let state = getState();
    let kit = state.kits[kitId];

    if (!kit.isLoaded) {
      let kitFile = kit.filePath + "/" + kit.fileName;
      let result = getKitAndPadsFromFile(kitFile);

      dispatch({ type: Actions.ADD_PADS, pads: result.pads });
      dispatch(updateKitState(kitId, {
        "isLoaded": true,
        "kitName": result.kit.kitName,
        "pads": result.kit.pads
      }));
    }
  }
}
/**
 * create an empty kit and add it to the kit list
 */
export function loadNewKit() {
  return (dispatch, getState) => {
    let state = getState();
    var kit = KitModel(state.drive.kitPath, null, true, false, true);
    dispatch({ type: Actions.ADD_KIT, kit: kit });
    dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: kit.id });
    dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: kit.id });
  }
}
/**
 * save a kit to disk
 * @param {boolean} asNew=false - if true, save this kit as a new kit on disk, do not overwrite the exitings
 */
export function saveKit(kitId, asNew=false) {
  return (dispatch, getState) => {
    let state = getState();
    let kit = state.kits[kitId];

    let fileName = saveKitToFile(kit, asNew);

    dispatch(updateKitState(kitId, {
      isNew: false,
      isExisting: true,
      originalKitName: kit.kitName,
      fileName: fileName
    }));
  }
}
/**
 * Update the kit name and filename
 * @param {String} kitId
 * @param {?} value
 */
export function updateKitName(kitId, value) {
  return (dispatch, getState) => {
    dispatch(updateKitProperty(kitId, 'kitName', value));
  }
}
/**
 * Update an individual property of a kit
 * @param {String} kitId
 * @param {String} property
 * @param {?} value
 */
export function updateKitProperty(kitId, property, value) {
  return { type: Actions.UPDATE_KIT_PROPERTY, kitId: kitId, property: property, value: value }
}
/**
 * Update multiple properties of a kit
 * @param {String} kitId
 * @param {json} newState
 */
export function updateKitState(kitId, newState) {
  return { type: Actions.UPDATE_KIT_STATE, kitId: kitId, newState: newState }
}

/** PAD ACTION CREATORS */
/**
 * Update the sample property of a pad
 * @param {String} padId
 * @param {String} value
 */
export function updatePadSample(padId, value) {
  return (dispatch, getState) => {
    dispatch(updatePadProperty(padId, "fileName", value));
    dispatch(updatePadProperty(padId, "displayName", value));
  }
}
/**
 * Update an integer property of a pad, value is cast to an int
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadIntProperty(padId, property, value) {
  return updatePadProperty(padId, property, parseInt(value, 10));
}
/**
 * Update an integer property of a pad, value is cast to a string
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadStringProperty(padId, property, value) {
  return updatePadProperty(padId, property, '' + value);
}
/**
 * Update the sensitivity property of a pad
 * @param {String} padId
 * @param {String} value
 */
export function updatePadSensitivity(padId, value) {
  return updatePadProperty(padId, "sensitivity", value);
}
/**
 * Update an individual property of a pad
 * @param {String} padId
 * @param {String} property
 * @param {?} value
 */
export function updatePadProperty(padId, property, value) {
  return { type: Actions.UPDATE_PAD_PROPERTY, padId: padId, property: property, value: value }
}

/** APP ACTION CREATORS */
/**
 * set the dropdown's selected kit and set it as currently active
 * @param {String} kitId
 */
export function selectKit(kitId) {
  return (dispatch, getState) => {
    // if the kit isnt loaded, load it before activating it
    dispatch(loadKitDetails(kitId));

    // set it as the selected and active kit
    dispatch({ type: Actions.SET_SELECTED_KIT_ID, kitId: kitId });
    dispatch({ type: Actions.SET_ACTIVE_KIT_ID, kitId: kitId });
  }
}