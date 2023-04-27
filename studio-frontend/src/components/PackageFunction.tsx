import { useEffect, useState } from 'react';
// import { ConnectButton, useWallet, WalletKitProvider } from "@mysten/wallet-kit";
import { ConnectButton, useWallet, useSuiProvider } from '@suiet/wallet-kit';
import { extractMutableReference, extractReference, extractStructTag } from '@mysten/sui.js';
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
  const [functionTypeArguments, setFunctionTypeArguments] = useState<string[]>([]);
  const [functionParameterList, setFunctionParameterList] = useState<JSX.Element[]>([]);

  const wallet = useWallet();

  const functionName = (props.functionDetails as any).name


  useEffect(() => {
    console.log('function details', props.functionDetails)
    getFunctionParameterList();

  }, [props.functionDetails])

  const getFunctionParameterList = () => {
    const params = (props.functionDetails as any).parameters;
    const typeParams = (props.functionDetails as any).type_parameters;
    console.log('params', params)
    console.log('type params', typeParams)

    const functionTypeParams = [];
    const functionParams = [];


    for (let i = 0; i < typeParams.length; i++) {
      console.log('type param', typeParams[i])
      functionTypeParams.push(
        <FunctionTypeParameter
          // parameterName={typeParams[i].abilities}
          parameterType={typeParams[i].abilities as string[]}
          parameterIndex={i}
          handleParameterChange={handleTypeParameterChange}
        />
      )
    } 

    let count = 0;

    for (let i = 0; i < params.length; i++) {
      console.log('param', params[i])
      console.log('param type', typeof params[i])

      if (typeof params[i] == 'object') {
        console.log('e')
        const object = extractMutableReference(params[i])
        if (object === undefined) {
          const reference = extractReference(params[i]) as any
          console.log('reference', reference)

          if (reference == undefined) {
            const struct = extractStructTag(params[i]) as any

            console.log('extractedStruct', struct)

            if (struct != undefined && struct.Struct != undefined) {
              console.log('struct', params[i].Struct)
              functionParams.push(
                <FunctionParameter
                  parameterName={`${shortenAddress(struct.Struct.address, 1)}::${struct.Struct.module}::${struct.Struct.name}`}
                  // parameterType={types[i]}
                  parameterIndex={i}
                  handleParameterChange={handleParameterChange}
                />
              );
              continue;
            }

            if (params[i].TypeParameter != undefined) {
              console.log('type param', params[i].TypeParameter)
              functionParams.push(
                <FunctionParameter
                  // parameterName={typeParams[i].abilities}
                  parameterName={`Type${params[i].TypeParameter}`}
                  parameterIndex={i}
                  handleParameterChange={handleParameterChange}
                />
              )
              continue;
            }

            if (params[i].Vector != undefined) {
              console.log('vector', params[i].Vector)
              functionParams.push(
                <FunctionParameter
                  parameterName={`vector<${params[i].Vector}>`}
                  // parameterType={types[i]}
                  parameterIndex={i}
                  handleParameterChange={handleParameterChange}
                />
              );
            }

            continue;
          }
          
          if (reference.Struct != undefined) {
            console.log('struct', params[i].Struct)
            functionParams.push(
              <FunctionParameter
                parameterName={`${shortenAddress(reference.Struct.address, 1)}::${reference.Struct.module}::${reference.Struct.name}`}
                // parameterType={types[i]}
                parameterIndex={i}
                handleParameterChange={handleParameterChange}
              />
            );
          } else if (params[i].Vector != undefined) {
            console.log('vector', params[i].Vector)
            functionParams.push(
              <FunctionParameter
                parameterName={`vector<${params[i].Vector}>`}
                // parameterType={types[i]}
                parameterIndex={i}
                handleParameterChange={handleParameterChange}
              />
            );
          }

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

    setFunctionParameterList(functionTypeParams.concat(functionParams));

    while(functionArguments.length > 0) {
      functionArguments.pop();
    }

    while(functionTypeArguments.length > 0) {
      functionTypeArguments.pop();
    }

    functionTypeParams.forEach(() => {
      functionTypeArguments.push('');
    });

    functionParams.forEach(() => {
      functionArguments.push('');
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

  const handleTypeParameterChange = (index: number, parameter: any) => {
    console.log(index, parameter)
    console.log('function type arguments', functionTypeArguments)
    
    if (functionTypeArguments == undefined) {
      return;
    } 

    console.log('function arguments before', functionTypeArguments)


    functionTypeArguments[index] = parameter;

    console.log('function arguments after', functionTypeArguments)

    // setfunctionArguments(functionArguments);
  }

  console.log('function arugments outside', functionArguments)

  const handleExecuteMoveCall = async () => {
    console.log('execute move call')
    console.log('function parameters', functionArguments.filter((param) => param != ''))
    console.log('function name', functionName)
    console.log('package address', props.packageAddress)
    console.log('type parameters', functionTypeArguments.filter((param) => param != ''))

    if (functionArguments == undefined) {
      return;
    }

    if (functionTypeArguments == undefined) {
      return;
    }

    props.setPendingTxn();

    let moveCallTxn;

    // try {
    //   moveCallTxn = await wallet.signAndExecuteTransaction({
    //     transaction: {
    //       kind: 'moveCall',
    //       data: {
    //         packageObjectId: props.packageAddress,
    //         module: props.moduleName,
    //         function: functionName,
    //         typeArguments: functionTypeArguments,
    //         arguments: functionArguments,
    //         gasBudget: 300000
    //       }
    //     }
    //   });
    // } catch (e) {
    //   console.log('error', e)
    //   console.log('error.message', (e as any).message.includes('wallet not connected'))
    //   if ((e as any).message.includes('wallet not connected')) {
    //     console.log('here')
    //     props.setFailTxn("Wallet not connected");
    //   } else {
    //     props.setFailTxn("");
    //   }
    //   return;
    // }

    // console.log('move call txn', moveCallTxn);

    // if (moveCallTxn.effects.status?.status == 'success' || (moveCallTxn.effects as any).effects.status.status == 'success') {
    //   props.setSuccessTxn(moveCallTxn.certificate.transactionDigest);
    // } else {
    //   props.setFailTxn(moveCallTxn.certificate.transactionDigest);
    // }

    // props.refreshHandler();
  }


  return (
    <div 
      className="card h-min bg-neutral-focus  shadow-xl card-bordered card-compact" 
      style={{margin: '10px 0px'}}
    >
      <div className="card-body">
        
        <h1 className="card-title text-neutral-content font-mono">{functionName}</h1>
        <div className="card-actions">
          {
            (props.functionDetails as any).is_entry &&
            <div className="badge badge-outline badge-secondary">Entry</div>
          }
          <div className="badge badge-outline badge-secondary">{(props.functionDetails as any).visibility}</div>
        </div>
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
    const input = document.getElementById(`input${props.parameterIndex}`) as HTMLInputElement;
    // console.log('input', input)
    input.value = '';
  })

  const handleParameterChange = (event: any) => {
    props.handleParameterChange(
      props.parameterIndex,
      event.target.value,
    );
  }

  return (
    <label className="input-group input-group-xs w-full" style={{margin: "2px"}}>
      <span className='font-medium'>Arg{props.parameterIndex}</span>
      <div className="tooltip tooltip-primary w-full font-mono" data-tip={props.parameterName}>
        <input type="text" id={`input${props.parameterIndex}`} placeholder={props.parameterName} className="input input-bordered input-xs italic font-mono w-full" onChange={handleParameterChange} />
      </div>
    </label>
  )
}

function FunctionTypeParameter(
  props: {
    // parameterName: string,
    parameterType: string[],
    parameterIndex: number,
    handleParameterChange: (index: number, parameter: string) => void
  }
) {

  useEffect(() => {
    const input = document.getElementById(`type-input${props.parameterIndex}`) as HTMLInputElement;
    input.value = '';
  })

  const handleParameterChange = (event: any) => {
    props.handleParameterChange(
      props.parameterIndex,
      event.target.value,
    );
  }

  return (
    <label className="input-group input-group-xs w-full" style={{margin: "2px"}}>
      <span className='font-medium'>Type{props.parameterIndex}</span>
      <input type="text" id={`type-input${props.parameterIndex}`} placeholder={JSON.stringify(props.parameterType)} className="input input-bordered input-xs italic w-full" onChange={handleParameterChange} />
    </label>
  )
}

export default PackageFunction;

