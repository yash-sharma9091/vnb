module.exports = (connectedRouter, x) => {
	switch(x.type){
		case 'get':
		case 'put':
		case 'post':
		case 'delete':
			if(x.hasOwnProperty('mwear')){
				connectedRouter[x.type](x.url, x.mwear, x.method);	
			} else {
				connectedRouter[x.type](x.url, x.method);
			}
		break;

		default:
		throw new Error('Invalid method type');
	}
}