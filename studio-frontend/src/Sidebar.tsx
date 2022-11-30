import React from 'react'
import './Sidebar.css'

function Sidebar (props: { compileCode: () => void }) {

  function addDepencies() {
    // Add dependencies to code
  }

  return (
    <div className="sidebar">
      <h1>Sidebar</h1>
      <input type="text" id="package name" placeholder="package name" />
      <table>
        <tr>
          <th>
            <p>Dependency</p>
          </th>
          <th>
            <p>Address</p>
          </th>
        </tr>
          {/* {dependencies} */}

        <tr>
          <td>
            <input type="text" id="dependency" placeholder="package" />
          </td>
          <td>
            <input type="text" id="address" placeholder="0x..." />
          </td>
        </tr>
      </table>
      <button onClick={addDepencies}>Add Dependency</button>
      <input type="button" value="Compile" onClick={props.compileCode} />
    </div>
  )
}

export default Sidebar