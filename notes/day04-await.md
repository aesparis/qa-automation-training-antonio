What await does?
- It will wait until the promise is completed
- It can be used only in an async function
- It only pause the async function where the await is used not the whole javascript code
- A missing await will make the output unreliable
- A missing await could possibly crash the application since it will continue to execute each line of code even without the promise is settled