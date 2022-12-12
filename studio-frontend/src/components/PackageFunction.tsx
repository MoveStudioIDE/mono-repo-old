import { useEffect, useState } from 'react';
import './PackageFunction.css'
import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";


function PackageFunction(
  props: {
    functionDetails: object,
    packageAddress: string,
    moduleName: string
  }
) {

  const [functionParameters, setFunctionParameters] = useState<any[]>();
  const [functionParameterList, setFunctionParameterList] = useState<JSX.Element[]>([]);

  const { connected, getAccounts, signAndExecuteTransaction } = useWallet();

  const functionName = (props.functionDetails as any).name
  
  console.log('function', props.functionDetails);

  useEffect(() => {
    getFunctionParameterList();
  }, [props.functionDetails])

  const getFunctionParameterList = () => {
    const params = (props.functionDetails as any).parameters;
    const types = (props.functionDetails as any).type_parameters;

    const paramsAndTypes = [];

    for (let i = 0; i < params.length; i++) {
      console.log('param', params[i])
      console.log('type', types[i])
      paramsAndTypes.push(
        <FunctionParameter
          parameterName={params[i]}
          parameterType={types[i]}
          parameterIndex={i}
          handleParameterChange={handleParameterChange}
        />
      )
    }

    setFunctionParameterList(paramsAndTypes);

    const functionParams = [] as string[];

    setFunctionParameters(functionParams.fill('', 0, params.length))

    return paramsAndTypes;
  }

  const handleParameterChange = (index: number, parameter: any, type: string) => {
    console.log(index, parameter, type)
    if (functionParameters == undefined) {
      return;
    }
    const newParams = functionParameters;
    newParams[index] = parameter;
    setFunctionParameters(newParams);
  }

  console.log('function parameters', functionParameters)

  const handleExecuteMoveCall = async () => {
    console.log('execute move call')
    console.log('function parameters', functionParameters)
    console.log('function name', functionName)
    console.log('package address', props.packageAddress)
    console.log('type parameters', [])

    if (functionParameters == undefined) {
      return;
    }

    const moveCallTxn = await signAndExecuteTransaction({
      kind: 'moveCall',
      data: {
        packageObjectId: props.packageAddress,
        module: props.moduleName,
        function: functionName,
        typeArguments: [],
        arguments: functionParameters,
        gasBudget: 300000
      }
    });

    console.log('move call txn', moveCallTxn);
  }


  return (
    <div className="function-box">
      <div style={{textAlign: 'center'}}>
        <h1>{functionName}</h1>
      </div>
      <div className='function-parameters'>
        {functionParameterList}
      </div>
      <button onClick={handleExecuteMoveCall}>Execute</button>
    </div>
  )
}

function FunctionParameter(
  props: {
    parameterName: string,
    parameterType: string,
    parameterIndex: number,
    handleParameterChange: (index: number, parameter: string, type: string) => void
  }
) {

  const handleParameterChange = (event: any) => {
    props.handleParameterChange(
      props.parameterIndex,
      event.target.value,
      props.parameterType
    );
  }

  return (
    <div className='function-parameter'>
      <p>{`${props.parameterName} (${props.parameterType})`}</p>
      <div style={{left: '-50%'}}>
        <input 
          style={{position: 'relative', left: '50%'}} 
          type="text" placeholder='Enter parameter here'
          onChange={handleParameterChange} 
        />
      </div>
    </div>
  )
}

export default PackageFunction;

