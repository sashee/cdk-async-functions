const runWithAsyncFunctions = async (fn) => {
	class Async extends Error {
		constructor(asyncFn) {
			super("Async");
			this.name = "Async";
			this.asyncFn = asyncFn;
		}
	}

	const runWithResolvedAsyncFunctions = (asyncResults) => async (fn) => {
		let asyncCounter = 0;
		globalThis.runAsync = (asyncFn) => {
			if (asyncResults.length > asyncCounter) {
				return asyncResults[asyncCounter++];
			}else {
				throw new Async(asyncFn);
			}
		};
		try {
			return await fn();
		}catch(e) {
			if (e instanceof Async) {
				const newAsyncResult = await e.asyncFn();
				return runWithResolvedAsyncFunctions([...asyncResults, newAsyncResult])(fn);
			}else {
				throw e;
			}
		}
	};
	return runWithResolvedAsyncFunctions([])(fn);
};

