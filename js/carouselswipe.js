var startingPoint;
var pressingCarousel = false;

function touchedCarousel( event ) {
    pressingCarousel = true;
    switch(event.type) {
        case "touchstart":
            startingPoint = event.touches[0].pageX;
            break;
        case "mousedown":
            startingPoint = event.pageX;
            break;
    }
}

function releasedCarousel() {
    pressingCarousel = false;  
}

function swipingCarousel( event ) {
    if(pressingCarousel) {  
        var endingPoint;       
        switch(event.type) {
            case "touchmove":
                endingPoint = event.touches[0].pageX;
                break;
            case "mousemove":
                endingPoint = event.pageX;
                break;
        }

        if(endingPoint) {
            var difference = endingPoint - startingPoint;
            if( Math.abs(difference) >= 20 ) { // 20 pixel difference 
                if( difference > 0 ) {
                    $(this).carousel('prev');
                    pressingCarousel = false;
                }
                else {
                    $(this).carousel('next');
                    pressingCarousel = false;
                } 
            }
        }
    }    
}

$('.carousel').mousedown(touchedCarousel);
$('.carousel').mousemove(swipingCarousel);
$('.carousel').mouseup(releasedCarousel);

$('.carousel').on('touchstart', touchedCarousel);
$('.carousel').on('touchmove', swipingCarousel);
$('.carousel').on('touchend', releasedCarousel);