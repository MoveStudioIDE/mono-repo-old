import { useEffect, useState } from 'react';
import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";
import { extractMutableReference } from '@mysten/sui.js';
import { shortenAddress } from '../utils/address-shortener';


function PackageFunction(
  props: {
    functionDetails: object,
    packageAddress: string,
    moduleName: string,
    refreshHandler: () => void,
    setPendingTxn: () => void,
    setSuccessTxn: (digest: string) => void,
    setFailTxn: (digest: string) => void,
  }
) {

  // const functionArguments = [] as string[];
  const [functionArguments, setfunctionArguments] = useState<string[]>([]);
  const [functionParameterList, setFunctionParameterList] = useState<JSX.Element[]>([]);

  const { connected, getAccounts, signAndExecuteTransaction } = useWallet();

  const functionName = (props.functionDetails as any).name


  useEffect(() => {
    console.log('function details', props.functionDetails)
    getFunctionParameterList();

  }, [props.functionDetails])

  const getFunctionParameterList = () => {
    const params = (props.functionDetails as any).parameters;
    console.log('params', params)

    const functionParams = [];

    for (let i = 0; i < params.length; i++) {
      console.log('param', params[i])
      console.log('param type', typeof params[i])

      if (typeof params[i] == 'object') {
        console.log('e')
        const object = extractMutableReference(params[i])
        if (object === undefined) {
          continue;
        }
        console.log("object", object)
        const struct = (object as any).Struct as {address: string, module: string, name: string};
        if (struct.address == "0x2" && struct.name == "TxContext") {
          continue; // Make sure this works. the TxContext might need to also be at the end of the list
        } else {
          functionParams.push(
            <FunctionParameter
              parameterName={`${shortenAddress(struct.address, 1)}::${struct.module}::${struct.name}`}
              // parameterType={types[i]}
              parameterIndex={i}
              handleParameterChange={handleParameterChange}
            />
          )
        }
      } else {
        console.log('f')
        functionParams.push(
          <FunctionParameter
            parameterName={params[i]}
            // parameterType={types[i]}
            parameterIndex={i}
            handleParameterChange={handleParameterChange}
          />
        )
      }
    }

    setFunctionParameterList(functionParams);

    while(functionArguments.length > 0) {
      functionArguments.pop();
    }

    functionParams.forEach(() => {
      functionArguments.push('')
    });

    console.log('function arguments', functionArguments)

    // setfunctionArguments(functionArguments)

    return functionParams;
  }

  const handleParameterChange = (index: number, parameter: any) => {
    console.log(index, parameter)
    console.log('function arguments', functionArguments)
    
    if (functionArguments == undefined) {
      return;
    } 

    console.log('function arguments before', functionArguments)


    functionArguments[index] = parameter;

    console.log('function arguments after', functionArguments)

    // setfunctionArguments(functionArguments);
  }

  console.log('function arugments outside', functionArguments)

  const handleExecuteMoveCall = async () => {
    console.log('execute move call')
    console.log('function parameters', functionArguments)
    console.log('function name', functionName)
    console.log('package address', props.packageAddress)
    console.log('type parameters', [])

    if (functionArguments == undefined) {
      return;
    }

    props.setPendingTxn();

    const moveCallTxn = await signAndExecuteTransaction({
      kind: 'moveCall',
      data: {
        packageObjectId: props.packageAddress,
        module: props.moduleName,
        function: functionName,
        typeArguments: [],
        arguments: functionArguments,
        gasBudget: 300000
      }
    });

    console.log('move call txn', moveCallTxn);

    if (moveCallTxn.effects.status.status == 'success') {
      props.setSuccessTxn(moveCallTxn.certificate.transactionDigest);
    } else {
      props.setFailTxn(moveCallTxn.certificate.transactionDigest);
    }

    props.refreshHandler();
  }


  return (
    <div 
      className="card h-min bg-neutral-focus  shadow-xl card-bordered card-compact" 
      style={{margin: '10px 0px'}}
    >
      <div className="card-body">
        <div className="card-actions">
          {
            (props.functionDetails as any).is_entry &&
            <div className="badge badge-outline badge-secondary">Entry</div>
          }
          <div className="badge badge-outline badge-secondary">{(props.functionDetails as any).visibility}</div>
        </div>
        <h1 className="card-title text-neutral-content">{functionName}</h1>
        <div className="form-control">
          {functionParameterList}
        </div>
        {
          (props.functionDetails as any).is_entry &&
          <button 
            className="btn btn-xs glass" 
            style={{margin:"2px 5px"}}
            onClick={handleExecuteMoveCall}
          >
            Execute
          </button>
        }
      </div>
    </div>
  )
}

function FunctionParameter(
  props: {
    parameterName: string,
    parameterIndex: number,
    handleParameterChange: (index: number, parameter: string) => void
  }
) {

  useEffect(() => {
    const input = document.getElementById('input') as HTMLInputElement;
    input.value = '';
  })

  const handleParameterChange = (event: any) => {
    props.handleParameterChange(
      props.parameterIndex,
      event.target.value,
    );
  }

  return (
    <label className="input-group input-group-xs" style={{margin: "2px"}}>
      <span>Arg{props.parameterIndex}</span>
      <input type="text" id="input" placeholder={props.parameterName} className="input input-bordered input-xs" onChange={handleParameterChange} />
    </label>
  )
}

export default PackageFunction;

