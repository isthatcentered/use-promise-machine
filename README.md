# usePromiseMachine
Because having to set `loading` and `error` and doing some `if (data)`  for promises is boring 🙃. 

## Features
- Know instantly which state your promise is in via `myPromise.state` *(-> `PENDING` || `FULFILLED_DATA` || `FULFILLED_EMPTY` || `REJECTED`)*
- Easily access the error or the data via `myPromise.error` or `myPromise.data`
- Don't bother guessing if you're getting back an empty container (`[]` or `{}`). If it's the case, `myPromise.state` will be `FULFILLED_EMPTY`
- No need to remember the existing states, they're all available via `usePromiseMachine.STATES.*`
- Simpler code, safe, 0 brain power required 🥳

## Install
```bash
npm i use-promise-machine -D
```

## Use
```typescript jsx
import { usePromiseMachine } from "use-promise-machine"


function _HomePage( props: {})
{
  // (use useCallback if you're using an inline function to avoir infinite rendering) 
  const myFunctionThatReturnsAPromise = useCallback(() => fetch("/waffles")),
        dataPromise                    = usePromiseMachine(myFunctionThatReturnsAPromise)
  
  return (
    <div>
      {(() => {
        switch ( dataPromise.state ) {
          case usePromiseMachine.STATES.PENDING:
            return <p>Loading...</p>
          
          case usePromiseMachine.STATES.REJECTED:
            return <p>💩 Something went wrong</p>
  
          // You can merge switch cases if you don't care about data or empty state        
          case usePromiseMachine.STATES.FULFILLED_DATA:
          case usePromiseMachine.STATES.FULFILLED_EMPTY:
            return <SomeComponent users={dataPromise.data} />
            
          // will never be reached
          default:
          	return null
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