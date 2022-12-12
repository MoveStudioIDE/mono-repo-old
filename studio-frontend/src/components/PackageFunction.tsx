import './PackageFunction.css'

function PackageFunction(
  props: {
    functionDetails: object
  }
) {

  const functionName = (props.functionDetails as any).name;

  return (
    <div className="function-box">
      <h1>{functionName}</h1>
      <div>
        <p>Function parameters</p>
      </div>
      <button>Execute</button>
    </div>
  )
}

export default PackageFunction;