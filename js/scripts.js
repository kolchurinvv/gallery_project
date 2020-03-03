/*jshint sub:true*/
var i=0, j=0, x=0, y=0, c=0, z=0, picLeft=0, picTop=0, maxRowWidth=0, rowWidth=0, linkLeft=0, linkWidth=0, animating=false, animated={main:false,projects:false,categories:false}, widths=[], elementsInLine=[], aspects=[];
// menu position check
function menuPositionCheck(){
	var top=$('.menu').offset().top;
	var y=$(window).scrollTop();
	if(y<=3){
		$('.menu').removeClass('fixed');
		$('#toggle').removeClass('shadow');
	}else if(top<y){
		$('.menu').addClass('fixed');
		$('#toggle').addClass('shadow');
	}
}
// end of menuPositionCheck()
$(document).ready(function(){
	maxRowWidth=$('header').width()/1.6;
// toggling groups of sub menu links
function toggleGroup(group,groupID){
	if(animating){
		return false;
	}else if(animated[group]){
		animating=true;
		$(groupID).animate({width:'0px'},400,function(){
			$(this).css({'display':'none'});
			animating=false;});
		animated[group]=false;
	}else{
		animating=true;
		$(groupID).css({'display':'block'}).animate({width:maxRowWidth},400,function(){animating=false;});
		animated[group]=true;
	}
}
// end of toggleGroup()
// sub menu links width and positioning
	function links(category,type){
		for(j;j<$(category).children().length;j++){
			if(j<3){
				$('.row'+j).width(maxRowWidth-(25*j));
			}else{
				$('.row'+j).width(maxRowWidth-50);
			}
			rowWidth=$('.row'+j).width();
			for(i;i<$('.row'+j).children(type).length;i++){
				linkWidth=rowWidth/($('.row'+j).children(type).length)-$(this).length;
				$('.row'+j).children(type).eq(i).css({'width':linkWidth,'left':linkLeft});
				linkLeft=linkLeft+linkWidth+1;
			}
			linkLeft=0;
			i=0;
			linkWidth=0;
		}
		j=0;
	}
// end of links()
// collapsing all menus
	function collapse(){
		animating=true;
		var top=$('.menu').offset().top;
		var y=$(window).scrollTop();
		if(y<=3){
			$('#toggle').removeClass('shadow');
		}else if(top<y){
			$('#toggle').addClass('shadow');
		}
		$('#toggle').animate({top:'0px'},400);
		$('.left').animate({height:'0px'},400,function(){$(this).css({'display':'none'});});
		$('#projects').animate({width:'0px'},400,function(){$(this).css({'display':'none'});});
		$('#categories').animate({width:'0px'},400,function(){$(this).css({'display':'none'});animating=false;});
		animated.categories=false;
		animated.projects=false;
		animated.main=false;
	}
// end of collapse()
//--------------------------------------------------------------------------
// sliding menu
	$('#toggle').click(function(){
		if(animating){
			return false;
		}else if(animated.main){
			collapse();
		}else{
			animating=true;
			$(this).removeClass('shadow').animate({top:'188px'},400);
			$('.left').css({'display':'block'}).animate({height:'238px'},400,function(){animating=false;});
			animated.main=true;
		}
	});
	$('#project').click(function(){
		links('#projects','.project');
		if(animated.categories){
			$('#categories').animate({width:'0px'},400,function(){$(this).css({'display':'none'});});
			animated.categories=false;
			setTimeout(function(){toggleGroup('projects','#projects');},420);
		}else{
			toggleGroup('projects','#projects');
		}
	});
	$('#category').click(function(){
		links('#categories','.category');
		if(animated.projects){
			$('#projects').animate({width:'0px'},400,function(){$(this).css({'display':'none'});});
			animated.projects=false;
			setTimeout(function(){toggleGroup('categories','#categories');},420);
		}else{
			toggleGroup('categories','#categories');
		}
	});
	//fixing menu to the top
	$(window).scroll(function(){
		menuPositionCheck();
		if(animated.main){
			collapse();
		}
	});
	//end of fixing menu to the top
//end of sliding menu
//--------------------------------------------------------------------------
//preview
	// arrange pics according to screen width
		//inital positioning
		for(i;i<$('.preview').children('.img-holder').length;i++){
			$('.preview').children('.img-holder').eq(i).find('img').first().addClass('primary');
			widths[i]=$('.preview').children('.img-holder').find('img').filter('.primary').eq(i).width();
			aspects[i]=widths[i]/$('.preview').children('.img-holder').find('img').filter('.primary').eq(i).height();
			widths[i]=300*aspects[i];
			if(i!==0){
				picLeft+=widths[i-1];
			}
			if(picLeft+widths[i]>=$('.preview').width()*1.048){
				elementsInLine.push(x);
				picTop+=300;
				picLeft=0;
				j++;
				x=0;
			}
			$('.preview').find('.img-holder').eq(i).addClass('line'+j).addClass('elem'+x).css({'left':picLeft,'top':picTop,'width':widths[i],'height':'300px'});
			x++;	
		}
		i=0;
		j=0;
		z=elementsInLine.length;
		if(elementsInLine[z]!==x){
			elementsInLine.push(x);
		}
		z=0;
		x=0;
		picLeft=0;
		picTop=0;
		//end of initial positioning
		//re-adjusting for window width
		for(i;i<elementsInLine.length;i++){
			for(j;j<elementsInLine[i];j++){
				x+=aspects[y+j];
			}
			x=$('.preview').width()/x;
			if(x>400){
				x=300.5;
				for(z;z<elementsInLine[i];z++){
					picLeft+=$('.line'+i).filter('.elem'+z).width();
				}
				picLeft=($('.preview-wrapper').width()-picLeft)/2;
			}
			z=0;
			j=0;
			for(j;j<elementsInLine[i];j++){
				if(j!==0){
					picLeft+=widths[y+j-1];
				} 
				widths[y+j]=x*aspects[y+j];
				$('.line'+i).filter('.elem'+j).css({'left':picLeft,'top':picTop,'width':widths[y+j],'height':x});
				if(j===(elementsInLine[i]-1)){
					picTop+=x;
					picLeft=0;
				}
			}
			x=0;
			j=0;
			y+=elementsInLine[i];
		}
		$('.preview-wrapper').height(picTop);
		$('.preview').height(picTop);
		j=0;
		x=0;
		i=0;
		y=0;
		picLeft=0;
		// end of re-adjustment
	// end of arranging
		for(i;i<$('.preview').children('.img-holder').length;i++){
			var $holder=$('.preview').children('.img-holder').eq(i);
			x=$holder.width()/$holder.find('img').length;
			y=$holder.height();
			for(j;j<$holder.find('img').length;j++){
//need some sort of a switch
			}
		}
	j=0;
	i=0;
	z=0;
	y=0;
	x=0;
	picLeft=0;
	// end of preview
});