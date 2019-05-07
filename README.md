# usePromiseMachine

## Install
```basch
npm i use-promise-machine -D
```

## Use
```typescript jsx
function _HomePage( props: {})
{
	const myFunctionThatReturnsAPromise = useCallback(() => fetch("/waffles"), []),
	      dataPromise                    = usePromise(myFunctionThatReturnsAPromise)
	
	return (
		<div>
			{(() => {
				switch ( dataPromise.state ) {
					case usePromise.STATES.PENDING:
						return <p>Loading...</p>
					
					case usePromise.STATES.REJECTED:
						return <p>💩 Something went wrong</p>
	
					// You can merge switch cases if you don't care about data or empty state				
					case usePromise.STATES.FULFILLED_DATA:
					case usePromise.STATES.FULFILLED_EMPTY:
						return <GrouppedIssuesList
							state={state}
							issues={state.issues}
						/>
					default:
						// will never be reached
				}
			})()}
		</div>)
}
```

## Fun facts
- You can access every state the promise can be in by using the `usePromise.STATES` variable.
- The `usePromise.STATES.FULFILLED_EMPTY` means your promise returns either an empty `array` or an empty `object`

## Learn more
Check the tests folder in `src/usePromise.spec.ts` or [tweet me 😉](https://twitter.com/isthatcentered)  