import $ from 'jquery-slim';

const util = {
	convertToPercent(number){
      	return number * 100;
  	},
  	focalPoints(targets){
    	/* set user defined focal points from SQS editor*/
    	targets.forEach((item, i) => {
		    let x = 0;
		    let y = 0;
		    let focalPoint = $(item).data('image-focal-point');
		    if(focalPoint !== undefined){
		        let split = focalPoint.split(',');
		        x = Math.floor(this.convertToPercent(split[0])) + '%';
		        y = Math.floor(this.convertToPercent(split[1])) + '%';
		        let position = String(x + ' , ' + y);
		        let imageSource = $(item).data('image');
		        $(item).css({
		           'backkground-image' : 'url(' + imageSource + ')',
		           'background-position-x' : x,
		           'background-position-y' : y
		        });            
		    }   
    	});       
  	}	
}

export default util;