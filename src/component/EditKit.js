import React from 'react';
import PadRowComponent from './PadRow'

import "../css/EditKit.css"

const EditKitComponent = React.memo(function EditKitComponent(props) {
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
              onChange={(e) => props.updateKitProperty(props.kitId, 'kitName', e.target.value)} />
          </div>

          <div className="buttons control">
            <a className="button is-info" onClick={props.saveKit}>Save Kit</a>
            {
              props.showSaveAsNew &&
              <a className="button" onClick={props.saveNewKit}>Save as New Kit</a>
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
            Object.keys(props.kitPads).map((padId) => {
              let pad = props.kitPads[padId];
              return (
                <PadRowComponent
                  pad={pad}
                  kitId={props.kitId}
                  padId={padId}
                  getSampleFilePath={props.getSampleFilePath}
                  updatePadSample={props.updatePadSample}
                  updatePadIntProperty={props.updatePadIntProperty}
                  updatePadStringProperty={props.updatePadStringProperty}
                  updatePadSensitivity={props.updatePadSensitivity}
                  key={padId} />
              );
            })
          }
        </div>
      </div>
    </section>
  );
});

export default EditKitComponent;
