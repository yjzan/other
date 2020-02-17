(function($){


        $('.wcvaheader').click(function(){

            $(this).nextUntil('tr.wcvaheader').slideToggle(100, function(){
          });
         });

         $('.subcollapsetr').click(function(){

           $(this).nextUntil('tr.subcollapsetr').slideToggle(100, function(){
          });
         });


        $(function() {
          $('.wcvadisplaytype').live('change',function(){
           zvalue= $(this).val();
	      if (zvalue == "colororimage") {
			  
             $(this).closest("div").find(".wcvametaupperdiv").show();
	         $(this).closest("div").find(".wcvaimageorcolordiv").show();
	 
	       } else if (zvalue == "variationimage") {
			   
			 $(this).closest("div").find(".wcvametaupperdiv").show();
	         $(this).closest("div").find(".wcvaimageorcolordiv").hide();
			 
		   } else{
			   
	         $(this).closest("div").find(".wcvametaupperdiv").hide();
	         $(this).closest("div").find(".wcvaimageorcolordiv").hide();
	       }
		   
          });
        });


	    /**
	     * hide/show shop swatches select on checkbox change
	     */
	    $(function() {

	    	$("#wcva_shop_swatches").click(function() {
                if($(this).is(":checked")) {
                   $("#wcva_shop_swatches_tr").show(300);
                   $(".wcvahoverimagediv").show(200);
                   
                 } else {
                   $("#wcva_shop_swatches_tr").hide(200);
                   $(".wcvahoverimagediv").hide(100);
                }
            });

	    });


		 $('.wcvacolororimage').on('change',function(){


		 	var parentdiv = $(this).parent().parent().parent();
		   if (this.value == "Image") {
		 
		     $(parentdiv).find(".wcvacolordiv").hide();
		     $(parentdiv).find(".wcvatextblockdiv").hide();
		     $(parentdiv).find(".wcvaimagediv").show();

               for(var i=0;i<$(parentdiv).find(".wcvaimagediv").length;i++)
			   {
                   var img = $($(parentdiv).find(".wcvaimagediv")[i]).find("img").attr('src');
                   var temp_html = '<a class="wcva-heading-image" style=""><img src="'+img+'" style=" border: solid 2px white; outline: solid 1px #9C9999;" width="22px" height="22px"></a>';
                   $($(parentdiv).find(".accordion-header")[i]).find('.previewdiv').html(temp_html);
			   }

		    } else if (this.value == "Color") {

               $(parentdiv).find(".wcvaimagediv").hide();
               $(parentdiv).find(".wcvatextblockdiv").hide();
               $(parentdiv).find(".wcvacolordiv").show();


               for(var i=0;i<$(parentdiv).find(".wcvacolordiv").length;i++)
               {
                   var color = $($(parentdiv).find(".wcvacolordiv")[i]).find(".wcvaattributecolorselect").val();
                   var temp_html = '<a class="wcva-heading-color" style=" display: inline-block; background-color: '+color+';height: 22px;width: 22px; border: solid 2px white; outline: solid 1px #9C9999;"></a>';
                   $($(parentdiv).find(".accordion-header")[i]).find('.previewdiv').html(temp_html);
               }

		  
		    } else if (this.value == "textblock") {
               $(parentdiv).find(".wcvaimagediv").hide();
               $(parentdiv).find(".wcvacolordiv").hide();
               $(parentdiv).find(".wcvatextblockdiv").show();

               for(var i=0;i<$(parentdiv).find(".wcvacolordiv").length;i++)
               {
               		var lbl_txt = $($(parentdiv).find(".wcvatextblockdiv")[0]).find(".wcvaattributetextblock").val();
                   var temp_html ='<div style="display: inline-block; border: solid 2px white; outline: solid 1px #9C9999; height: auto; width: auto; max-width: 100%; background-color: #eee;color: black; border-radius: 3px; font-size: 14px!important;font-weight: 500; padding: 3px 3px;">'+lbl_txt+'</div>';
                     $($(parentdiv).find(".accordion-header")[i]).find('.previewdiv').html(temp_html);
               }

			}

			var token = $(this).attr("data-token");
		   $("select[data-token='"+token+"']").val($(this).val());

		});


       $(".wcvacolordiv").each(function(){
		     $('.wcvaattributecolorselect').iris({
               hide: true,
               palettes: true
             });

             
             $('.iris-picker').click(function() {
             	var obj = $(this).parent().find(".wcvaattributecolorselect");
                var color = $(obj).val();

                var target_id =  $(obj).parent().parent().parent().find(".wcvacolordiv").attr('id');
                 target_id =  target_id.replace("coloredvariables-",".imagediv_");
                 target_id =  target_id.replace("-values-","_");
                 target_id =  target_id.replace("-color",".wcva-heading-color");
                 $(""+target_id).css('background-color',color);
                $(this).hide();
             });

             $('.wcvaattributecolorselect').click(function() {
                $(this).next(".iris-picker").show();
             });
		});



        
        //loads Media upload for each media upload input
        $(".image-upload-div").each(function(){
    	    var parentId = $(this).closest('div').attr('idval');
		 		 // Only show the "remove image" button when needed
		    var srcvalue    = $('.facility_thumbnail_id_' + parentId + '').val();
				
				if ( !srcvalue ){
				    jQuery('.remove_image_button_' + parentId + ' ').hide();
                }  
				// Uploading files
				var file_frame;

				jQuery(document).on( 'click', '.upload_image_button_' + parentId + ' ', function( event ){
                  
				   
					event.preventDefault();

					// If the media frame already exists, reopen it.
					if ( file_frame ) {
						file_frame.open();
						return;
					}

					// Create the media frame.
					file_frame = wp.media.frames.downloadable_file = wp.media({
						title: wcvameta.uploadimage,
						button: {
							text: wcvameta.useimage,
						},
						multiple: false
					});

					// When an image is selected, run a callback.
					file_frame.on( 'select', function() {
						attachment = file_frame.state().get('selection').first().toJSON();

						jQuery('.facility_thumbnail_id_' + parentId + '').val( attachment.id );
						jQuery('#facility_thumbnail_' + parentId + ' img').attr('src', attachment.url+'/150' );
						jQuery('.imagediv_' + parentId + ' img').attr('src', attachment.url );
						jQuery('.remove_image_button_' + parentId + '').show();
					});

					// Finally, open the modal.
					file_frame.open();
				});

				jQuery(document).on( 'click', '.remove_image_button_' + parentId + '', function( event ){
				    
					jQuery('#facility_thumbnail_' + parentId + ' img').attr('src', wcvameta.placeholder );
					jQuery('.imagediv_' + parentId + ' img').attr('src', '');
					jQuery('.facility_thumbnail_id_' + parentId + '').val('');
					jQuery('.remove_image_button_' + parentId + '').hide();
					return false;
				});
		 
	});				


     //loads Media upload for each media upload input
        $(".hover-image-upload-div").each(function(){
    	    var parentId2 = $(this).closest('div').attr('idval');
		 		 // Only show the "remove image" button when needed

		       var srcvalue2    = $('.hover_facility_thumbnail_id_' + parentId2 + '').val();
				

				if ( !srcvalue2 ){
				    jQuery('.hover_remove_image_button_' + parentId2 + '').hide();
                }  
				// Uploading files
				var file_frame;

				jQuery(document).on( 'click', '.hover_upload_image_button_' + parentId2 + ' ', function( event ){
                  
				    
					event.preventDefault();

					// If the media frame already exists, reopen it.
					if ( file_frame ) {
						file_frame.open();
						return;
					}

					// Create the media frame.
					file_frame = wp.media.frames.downloadable_file = wp.media({
						title: wcvameta.uploadimage,
						button: {
							text: wcvameta.useimage,
						},
						multiple: false
					});

					// When an image is selected, run a callback.
					file_frame.on( 'select', function() {
						attachment = file_frame.state().get('selection').first().toJSON();

						jQuery('.hover_facility_thumbnail_id_' + parentId2 + '').val( attachment.id );
						jQuery('#hover_facility_thumbnail_' + parentId2 + ' img').attr('src', attachment.url+'/150' );
						jQuery('.hover_remove_image_button_' + parentId2 + '').show();
					});

					// Finally, open the modal.
					file_frame.open();
				});

				jQuery(document).on( 'click', '.hover_remove_image_button_' + parentId2 + '', function( event ){
				    
					jQuery('#hover_facility_thumbnail_' + parentId2 + ' img').attr('src','https://res.cloudinary.com/demo/image/fetch/w_150,f_auto,q_auto:good/https%3A%2F%2Fyjzcdn.top%2Ffile%2Fyjzan-web%2F2019%2F08%2F05%2F3F4FFD8CF5AB6F5839BD69DA3ABCE84D.jpg' );
					jQuery('.hover_facility_thumbnail_id_' + parentId2 + '').val('');
					jQuery('.hover_remove_image_button_' + parentId2 + '').hide();
					return false;
				});
		 
	});				
		    
	     

})(jQuery); 


