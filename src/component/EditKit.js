import React from 'react';
import { connect } from 'react-redux'
import PadRowComponent from './PadRow'
import { saveKit, updateKitName } from '../redux/actions'
import "../css/EditKit.css"

const EditKit = (props) => {
  return (
    <section>
      <div className="Kit">
        <label className="label is-size-3">Kit: {props.originalKitName}</label>
        <div className="field is-grouped">
          <div className="control">
            <input
              type="text"
              className="input kitName"
              value={props.kitName}
              onChange={(e) => props.updateKitName(e.target.value)} />
          </div>

          <div className="buttons control">
            <button className="button is-info" onClick={props.saveKit}>Save Kit</button>
            {
              props.showSaveAsNew &&
              <button className="button" onClick={props.saveNewKit}>Save as New Kit</button>
            }
          </div>
        </div>

        <div className="pad-table">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" className="col-note">Note</th>
                <th scope="col" className="col-file">File</th>
                <th scope="col" className="col-velocity">Velocity</th>
                <th scope="col" className="col-tune">Tune</th>
                <th scope="col" className="col-sensitivity">Sensitivity</th>
                <th scope="col" className="col-pan">Pan</th>
                <th scope="col" className="col-reverb">Reverb</th>
                <th scope="col" className="col-level">Level</th>
                <th scope="col" className="col-mode">Mode</th>
                <th scope="col" className="col-mute-group">Mute Group</th>
              </tr>
            </thead>
          </table>

          {
            props.pads.map((padId) => {
              return (
                <PadRowComponent padId={padId} key={padId} />
              );
            })
          }
        </div>
      </div>
    </section>
  );
}

const mapStateToProps = (state, ownProps) => {
  let kit = state.kits[ownProps.kitId];

  return {
    showSaveAsNew: kit.isExisting,
    kitName: kit.kitName,
    originalKitName: kit.originalKitName,
    pads: kit.pads
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    saveKit: () => {
      dispatch(saveKit(ownProps.kitId));
    },
    saveNewKit: () => {
      dispatch(saveKit(ownProps.kitId, true));
    },
    updateKitName: (value) => {
      dispatch(updateKitName(ownProps.kitId,  value));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditKit)