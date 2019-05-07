import "jest-then"
import { renderHook } from "react-hooks-testing-library"
import { usePromiseMachine } from "./usePromiseMachine"




Scenario( `Instantiation`, () => {
	test( `Starts in "PENDING" state`, () => {
		const { result } = usePromiseTestSetup( () => Promise.resolve() )
		
		expect( result.current.state ).toBe( usePromiseMachine.STATES.PENDING )
	} )
} )

Scenario( `Fulfilled`, () => {
	Case( `Default`, () => {
		describe( `Sets state to "FULFILLED:DATA" for any value/non empty container (objects or arrays)`, () => {
			[
				{ type: "null", value: null },
				{ type: "undefined", value: undefined },
				{ type: "falsy number", value: 0 },
				{ type: "empty string", value: "" },
				{ type: "object", value: { some: "data" } },
			].forEach( resolve =>
				test( `${resolve.type}`, async () => {
					const { result } = usePromiseTestSetup( () => Promise.resolve( resolve.value ) )
					
					await tick()
					
					expect( result.current.state ).toBe( usePromiseMachine.STATES.FULFILLED_DATA )
				} ) )
		} )
		
		test( `Returns result as "result.data"`, async () => {
			const resolve    = "RESOLVED_DATA",
			      { result } = usePromiseTestSetup( () => Promise.resolve( resolve ) )
			
			await tick()
			
			if ( result.current.state === usePromiseMachine.STATES.FULFILLED_DATA ) // I don't want to bypass the typescript error "data does not exist"
				expect( result.current.data ).toBe( resolve )
			
			expect.hasAssertions()
		} )
	} )
	
	Case( `Empty container object returned ({} || [])`, () => {
		[
			{ value: [], type: "Array" },
			{ value: {}, type: "object" },
		]
			.forEach( resolve =>
				test( `Sets state to "FULFILLED:EMPTY" for ${resolve.type}`, async () => {
					const { result } = usePromiseTestSetup( () => Promise.resolve( resolve.value ) )
					
					await tick()
					
					expect( result.current.state ).toBe( usePromiseMachine.STATES.FULFILLED_EMPTY )
				} ) )
	} )
} )

Scenario( `Rejected`, () => {
	test( `Sets state to "REJECTED"`, async () => {
		const { result } = usePromiseTestSetup( () => Promise.reject() )
		
		await tick()
		
		expect( result.current.state ).toBe( usePromiseMachine.STATES.REJECTED )
	} )
	
	test( `Returns error as "result.error"`, async () => {
		const error      = "RESOLVED_DATA",
		      { result } = usePromiseTestSetup( () => Promise.reject( error ) )
		
		await tick()
		
		if ( result.current.state === usePromiseMachine.STATES.REJECTED ) // I don't want to bypass the typescript error "data does not exist"
			expect( result.current.error ).toBe( error )
		
		expect.hasAssertions()
	} )
} )

Scenario( `Unmount before resolve`, () => {
	test( `Doesn't throw`, async () => {
		const spy = jest.spyOn( console, "error" )
		
		const { unmount } = usePromiseTestSetup( () => Promise.reject() )
		
		unmount()
		
		await tick()
		
		spy.mock.calls.forEach( call => expect( call[ 0 ] ).not.toMatch( /unmounted component/ ) )
		
		spy.mockRestore()
	} )
} )


function usePromiseTestSetup( promise: () => Promise<any> )
{
	return renderHook( () => usePromiseMachine( promise ) )
}


export function tick(): Promise<undefined>
{
	return new Promise( resolve =>
		process.nextTick( () => resolve() ) )
}
