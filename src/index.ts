import { useEffect, useState } from "react"




enum STATE
{
	PENDING         = "PENDING",
	FULFILLED_DATA  = "FULFILLED:DATA",
	FULFILLED_EMPTY = "FULFILLED:EMPTY",
	REJECTED        = "REJECTED",
}

type promiseModel<T, E> =
	| { state: STATE.PENDING }
	| { state: STATE.FULFILLED_DATA, data: T }
	| { state: STATE.FULFILLED_EMPTY, data: undefined }
	| { state: STATE.REJECTED, error: E }


export function usePromiseMachine<T, E = { message: string }>( fn: () => Promise<T> ): promiseModel<T, E>
{
	const [ state, setState ] = useState<promiseModel<T, E>>( { state: STATE.PENDING } )
	
	useEffect( () => {
		let mounted = true
		
		fn()
			.then( data => {
				if ( !mounted )
					return
				
				return isEmptyContainer( data ) ?
				       setState( { state: STATE.FULFILLED_EMPTY, data: undefined } ) :
				       setState( { state: STATE.FULFILLED_DATA, data } )
			} )
			.catch( error => mounted && setState( { state: STATE.REJECTED, error } ) )
		
		return () => {
			mounted = false
		}
	}, [ fn ] )
	
	return state
}


usePromiseMachine.STATES = STATE


function isEmptyContainer( data: any ): boolean
{
	const isEmptyArray  = Array.isArray( data ) && !data.length,
	      isEmptyObject = typeof data === "object" && data !== null && !Object.keys( data ).length
	
	return isEmptyArray || isEmptyObject
}