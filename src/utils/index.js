export  function formatTime(){
	return new Promise((resolve,reject)=>{
		setTimeout(()=>{

			resolve(123)
		},1000)
	})
}

export async function test (){
	console.log('???')
	return await formatTime()
}