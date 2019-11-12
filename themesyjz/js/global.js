/* global twentyseventeenScreenReaderText */
(function( $ ) {

    // Variables and DOM Caching.
    var $body = $( 'body' ),
        $customHeader = $body.find( '.custom-header' ),
        $branding = $customHeader.find( '.site-branding' ),
        $navigation = $body.find( '.navigation-top' ),
        $navWrap = $navigation.find( '.wrap' ),
        $navMenuItem = $navigation.find( '.menu-item' ),
        $menuToggle = $navigation.find( '.menu-toggle' ),
        $menuScrollDown = $body.find( '.menu-scroll-down' ),
        $sidebar = $body.find( '#secondary' ),
        $entryContent = $body.find( '.entry-content' ),
        $formatQuote = $body.find( '.format-quote blockquote' ),
        isFrontPage = $body.hasClass( 'twentyseventeen-front-page' ) || $body.hasClass( 'home blog' ),
        navigationFixedClass = 'site-navigation-fixed',
        navigationHeight,
        navigationOuterHeight,
        navPadding,
        navMenuItemHeight,
        idealNavHeight,
        navIsNotTooTall,
        headerOffset,
        menuTop = 0,
        resizeTimer;

    // Ensure the sticky navigation doesn't cover current focused links.
    $( 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]', '.site-content-contain' ).filter( ':visible' ).focus( function() {
        if ( $navigation.hasClass( 'site-navigation-fixed' ) ) {
            var windowScrollTop = $( window ).scrollTop(),
                fixedNavHeight = $navigation.height(),
                itemScrollTop = $( this ).offset().top,
                offsetDiff = itemScrollTop - windowScrollTop;

            // Account for Admin bar.
            if ( $( '#wpadminbar' ).length ) {
                offsetDiff -= $( '#wpadminbar' ).height();
            }

            if ( offsetDiff < fixedNavHeight ) {
                $( window ).scrollTo( itemScrollTop - ( fixedNavHeight + 50 ), 0 );
            }
        }
    });

    // Set properties of navigation.
    function setNavProps() {
        navigationHeight      = $navigation.height();
        navigationOuterHeight = $navigation.outerHeight();
        navPadding            = parseFloat( $navWrap.css( 'padding-top' ) ) * 2;
        navMenuItemHeight     = $navMenuItem.outerHeight() * 2;
        idealNavHeight        = navPadding + navMenuItemHeight;
        navIsNotTooTall       = navigationHeight <= idealNavHeight;
    }

    // Make navigation 'stick'.
    function adjustScrollClass() {

        // Make sure we're not on a mobile screen.
        if ( 'none' === $menuToggle.css( 'display' ) ) {

            // Make sure the nav isn't taller than two rows.
            if ( navIsNotTooTall ) {

                // When there's a custom header image or video, the header offset includes the height of the navigation.
                if ( isFrontPage && ( $body.hasClass( 'has-header-image' ) || $body.hasClass( 'has-header-video' ) ) ) {
                    headerOffset = $customHeader.innerHeight() - navigationOuterHeight;
                } else {
                    headerOffset = $customHeader.innerHeight();
                }

                // If the scroll is more than the custom header, set the fixed class.
                if ( $( window ).scrollTop() >= headerOffset ) {
                    $navigation.addClass( navigationFixedClass );
                } else {
                    $navigation.removeClass( navigationFixedClass );
                }

            } else {

                // Remove 'fixed' class if nav is taller than two rows.
                $navigation.removeClass( navigationFixedClass );
            }
        }
    }

    // Set margins of branding in header.
    function adjustHeaderHeight() {
        if ( 'none' === $menuToggle.css( 'display' ) ) {

            // The margin should be applied to different elements on front-page or home vs interior pages.
            if ( isFrontPage ) {
                $branding.css( 'margin-bottom', navigationOuterHeight );
            } else {
                $customHeader.css( 'margin-bottom', navigationOuterHeight );
            }

        } else {
            $customHeader.css( 'margin-bottom', '0' );
            $branding.css( 'margin-bottom', '0' );
        }
    }

    // Set icon for quotes.
    function setQuotesIcon() {
        $( twentyseventeenScreenReaderText.quote ).prependTo( $formatQuote );
    }

    // Add 'below-entry-meta' class to elements.
    function belowEntryMetaClass( param ) {
        var sidebarPos, sidebarPosBottom;

        if ( ! $body.hasClass( 'has-sidebar' ) || (
                $body.hasClass( 'search' ) ||
                $body.hasClass( 'single-attachment' ) ||
                $body.hasClass( 'error404' ) ||
                $body.hasClass( 'twentyseventeen-front-page' )
            ) ) {
            return;
        }

        // sidebarPos       = $sidebar.offset();
        // sidebarPosBottom = sidebarPos.top + ( $sidebar.height() + 28 );
        //
        // $entryContent.find( param ).each( function() {
        // 	var $element = $( this ),
        // 		elementPos = $element.offset(),
        // 		elementPosTop = elementPos.top;
        //
        // 	// Add 'below-entry-meta' to elements below the entry meta.
        // 	if ( elementPosTop > sidebarPosBottom ) {
        // 		$element.addClass( 'below-entry-meta' );
        // 	} else {
        // 		$element.removeClass( 'below-entry-meta' );
        // 	}
        // });
    }

    /*
     * Test if inline SVGs are supported.
     * @link https://github.com/Modernizr/Modernizr/
     */
    function supportsInlineSVG() {
        var div = document.createElement( 'div' );
        div.innerHTML = '<svg/>';
        return 'http://www.w3.org/2000/svg' === ( 'undefined' !== typeof SVGRect && div.firstChild && div.firstChild.namespaceURI );
    }

    /**
     * Test if an iOS device.
     */
    function checkiOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && ! window.MSStream;
    }

    /*
     * Test if background-attachment: fixed is supported.
     * @link http://stackoverflow.com/questions/14115080/detect-support-for-background-attachment-fixed
     */
    function supportsFixedBackground() {
        var el = document.createElement('div'),
            isSupported;

        try {
            if ( ! ( 'backgroundAttachment' in el.style ) || checkiOS() ) {
                return false;
            }
            el.style.backgroundAttachment = 'fixed';
            isSupported = ( 'fixed' === el.style.backgroundAttachment );
            return isSupported;
        }
        catch (e) {
            return false;
        }
    }

    // Fire on document ready.
    $( document ).ready( function() {

        // If navigation menu is present on page, setNavProps and adjustScrollClass.
        if ( $navigation.length ) {
            setNavProps();
            adjustScrollClass();
        }

        // If 'Scroll Down' arrow in present on page, calculate scroll offset and bind an event handler to the click event.
        if ( $menuScrollDown.length ) {

            if ( $( 'body' ).hasClass( 'admin-bar' ) ) {
                menuTop -= 32;
            }
            if ( $( 'body' ).hasClass( 'blog' ) ) {
                menuTop -= 30; // The div for latest posts has no space above content, add some to account for this.
            }
            if ( ! $navigation.length ) {
                navigationOuterHeight = 0;
            }

            $menuScrollDown.click( function( e ) {
                e.preventDefault();
                $( window ).scrollTo( '#primary', {
                    duration: 600,
                    offset: { top: menuTop - navigationOuterHeight }
                });
            });
        }

        adjustHeaderHeight();
        setQuotesIcon();
        belowEntryMetaClass( 'blockquote.alignleft, blockquote.alignright' );
        if ( true === supportsInlineSVG() ) {
            document.documentElement.className = document.documentElement.className.replace( /(\s*)no-svg(\s*)/, '$1svg$2' );
        }

        if ( true === supportsFixedBackground() ) {
            document.documentElement.className += ' background-fixed';
        }
    });

    // If navigation menu is present on page, adjust it on scroll and screen resize.
    if ( $navigation.length ) {

        // On scroll, we want to stick/unstick the navigation.
        $( window ).on( 'scroll', function() {
            adjustScrollClass();
            adjustHeaderHeight();
        });

        // Also want to make sure the navigation is where it should be on resize.
        $( window ).resize( function() {
            setNavProps();
            setTimeout( adjustScrollClass, 500 );
        });
    }

    $( window ).resize( function() {
        clearTimeout( resizeTimer );
        resizeTimer = setTimeout( function() {
            belowEntryMetaClass( 'blockquote.alignleft, blockquote.alignright' );
        }, 300 );
        setTimeout( adjustHeaderHeight, 1000 );
    });

    // Add header video class after the video is loaded.
    $( document ).on( 'wp-custom-header-video-loaded', function() {
        $body.addClass( 'has-header-video' );
    });

    /*购买数量初始化组件---------------------------------------------------------------------------*/
    var cart_clicking=0;
    var quantity = function quantity() {
        var _selector ='.variations_form.cart,.woocommerce-cart-form,.cart,.yjz_cart_layer';

        var j_quick_view = jQuery(_selector),
            _qty = j_quick_view.find('.quantity');

        if (!_qty.length || jQuery(_qty).hasClass('hidden')) return;
        //_qty.prepend('').append('');

        var _qty_btn = j_quick_view.find('.modify-qty');

        jQuery(_qty_btn).off('click').on('click', function () {
            cart_clicking++;
            var check_click_value = cart_clicking;
            console.log('正在输入');
            var t = jQuery(this),
                _input = t.parent().find('input'),
                currVal = parseInt(_input.val(), 10),
                max = parseInt(_input.prop('max'));


            if ('minus' === t.attr('data-click') && currVal > 1) {
                _input.val(currVal - 1);
            }

            if ('plus' === t.attr('data-click')) {
                if (currVal >= max) return;
                _input.val(currVal + 1);
            }

            //价钱或减钱
            if(t.parent().hasClass('yjz-cart-item-input'))
            {
                var cart_item_price = parseInt(t.parent().attr('data-cart-price'));
                var amount = $('#yjz_cart_subtotal .woocommerce-Price-amount').html();
                amount = amount.split('</span>');
                amount[1] = parseFloat(amount[1].replace(/,/g,""));
                var new_price;
                var new_counter = parseInt($('.yjzan-button-icon').attr('data-counter'));
                if('plus' === t.attr('data-click'))
                {
                    new_price  =  amount[1] + cart_item_price;
                    new_counter = new_counter+1;
                }
                else
                {
                    if('minus' === t.attr('data-click') && currVal ==1 )
                    {
                        t.parent().parent().parent().hide();
                    }

                    new_price  =  amount[1] - cart_item_price;
                    new_counter = new_counter-1>0?(new_counter-1):0;

                }
                new_price = new_price.toFixed(2);

                $('#yjz_cart_subtotal .woocommerce-Price-amount').html(amount[0]+'</span>'+new_price);
                $('.yjzan-button-icon').attr('data-counter',new_counter);

            }

            setTimeout(function(){
                if(check_click_value==cart_clicking)
                    cart_clicking = 0;
            },300);

            setTimeout(function() {
                if (cart_clicking == 0 && t.parent().hasClass('yjz-cart-item-input'))
                {
                    var number = 'minus' === t.attr('data-click') && currVal ==1 ? 0:_input.val();
                    setCartItemQuantity(t.parent(),parseInt(number, 10));
                    cart_clicking=0
                }
            },500);


            jQuery('[name=\'update_cart\']').prop('disabled', false);

        });
    };



    function setCartItemQuantity(obj,item_num) {
        var item_key = $(obj).attr('data-cart-key');
        var variation_id= $(obj).attr('data-variation-id');
        var product_id= $(obj).attr('data-product-id');
        var iteem_price = $(obj).attr('data-cart-price');

        $.post(site_url+ "/wp-admin/admin-ajax.php",
            "action=set_cart_quantity&product_id="+product_id+"&quantity="+item_num+"&variation_id="+variation_id+"&cart_item_key="+item_key
        ).done(function( data ) {
            if (data.status==1) {
                if(item_num==0)
                    $(obj).parent().parent().remove();
                //修改金额总数
                var amount = $('#yjz_cart_subtotal .woocommerce-Price-amount').html();
                amount = amount.split('</span>');
                $('#yjz_cart_subtotal .woocommerce-Price-amount').html(amount[0]+'</span>'+data.subtotal);
                //修改购物车数量

                $('.yjzan-button-icon').attr('data-counter',data.item_quantity);

                if(data.item_quantity==0){

                    $('#yjz_cart_subtotal').hide();
                    $(".woocommerce-mini-cart__empty-message").show();
                }
                //quantity();
            }
            jQuery.data(document.body, "processing", 0);
        });

    }


    setTimeout(function(){
        quantity();
    },200);


    $('.yjz-yd-header-licon').on('click', function (){
        javascript:history.go(-1);
    });

    $(".yjz_cart_mask_layer,.yjz_cart_close_btn").on("click",function(){
        hide_cart_layer();
    });


    //加入购物车--------------------------------------------------------------------------------------------------------------------
    $(".single_add_to_cart_button, .add_to_cart_button , .yjz_cart_add_btn").on("click", function () {
        return product_add_to_cart(this);
    });

    if( $("#yjzp_current_page").length>0)
        $("#yjzp_current_page").val(1);

    // if($(".yjz-product-swp-container").length>0)
    // {
    //     $(".yjz-product-swp-container").css
    // }


    //产品加入购物车
    function product_add_to_cart(obj)
    {
        var add_to_cart_id = $(obj).val();
        var cart_addition = '';
        if(parseInt(add_to_cart_id) > 0) {
            cart_addition = "add-to-cart="+add_to_cart_id;
        }
        if($(obj).hasClass('product_type_variable'))
        {
            if(LoadProductAtrrInfo($(obj)))
                show_cart_layer();

            return false;
        }

        if(parseInt(jQuery.data(document.body, "processing")) == 1)
        {
            return false;
        }

        var product_id_Val;
        var quantity_Val;
        var variation_data = '';

        if($(obj).hasClass('yjz_cart_add_btn'))
        {
            var pobj = JSON.parse($("#product_var_info").val()) ;
            quantity_Val = $("#cart_p_qty_num").val();
            quantity_Val = typeof quantity_Val == 'undefined'? 1 : quantity_Val;

            var var_count = $("#product_var_group").val();
            var tlinp = Enumerable.from(pobj);
            for(var i=1;i<=var_count;i++)
            {
                var lb_item = $("span.cart_labelacive.cart_var_group"+i);
                if(lb_item.length!=1)
                {
                    yjzSendInfo('请选择产品规格');
                    return false ;
                }else
                {
                    variation_data += (variation_data==''?'':'&')+lb_item.attr('data-key')+'='+lb_item.attr('data-value');
                    var condition ="x=>x."+lb_item.attr('data-key')+"=='"+lb_item.attr('data-value')+"'";
                    tlinp = tlinp.where(condition);
                }
            }

            var var_target = tlinp.toArray()[0];
            product_id_Val = var_target.p_id;
            variation_data +="&variation_id="+var_target.variation_id;


        }else if($(obj).hasClass('single_add_to_cart_button'))
        {

            if ($(".variations_form").length) {
                variation_data = "variation_id="+$("input[name='variation_id']").val();
                var attrs = {};
                var variation_form = $('.variations_form');
                if($(variation_form).find('select[name^=attribute]').length) {
                    $(variation_form).find('select[name^=attribute]').each(function() {
                        var name = $(this).attr("name");
                        var value = $(this).val();
                        attrs[name] = value;
                    });
                } else {
                    $(variation_form).find('input[name^=attribute]').each(function() {
                        attrs[$(obj).attr("name")] = $(obj).val();
                    });
                }
                for(var entry in attrs) {
                    if(attrs[entry]=='')
                    {
                        yjzSendInfo('请选择产品规格');
                        jQuery.data(document.body, "processing",0);
                        return false;
                    }
                    variation_data += "&attribute["+entry+"]="+attrs[entry];
                }
            }

            product_id_Val = $(obj).val();
            quantity_Val = $("input[name='quantity']").val();
            quantity_Val = typeof quantity_Val == 'undefined'? 1 : quantity_Val;
        }
        else
        {
            product_id_Val = $(obj).attr('data-product_id');
            quantity_Val = $(obj).attr('data-quantity');
            quantity_Val = typeof quantity_Val == 'undefined'? 1 : quantity_Val;
            variation_data = '';
        }

        jQuery.data(document.body, "processing", 1);
        if($(obj).hasClass('yjz_cart_add_btn'))
            hide_cart_layer();

        $.post(site_url+ "/wp-admin/admin-ajax.php",
            "action=yjz_add_to_cart&product_id="+product_id_Val+"&quantity="+quantity_Val+"&"+variation_data
        ).done(function( data ) {
            if ( data && data.status==1 ) {

                if($("#cart_item_"+data.key).length==0)
                {
                    if(!$(".woocommerce-mini-cart__empty-message").is(":hidden"))
                    {
                        $('#yjz_cart_subtotal').show();
                        $(".woocommerce-mini-cart.woocommerce-cart-form__contents").html(data.cart_item_html);
                        $(".woocommerce-mini-cart__empty-message").hide();
                    }
                    else
                        $(".woocommerce-mini-cart.woocommerce-cart-form__contents").append(data.cart_item_html);

                }else
                {
                    $("#cart_item_"+data.key).replaceWith(data.cart_item_html);
                }

                $('.yjzan-button-icon').attr('data-counter',data.quantity);

                if($('#yjz_cart_subtotal .woocommerce-Price-amount').length!=0)
                {
                    var amount = $('#yjz_cart_subtotal .woocommerce-Price-amount').html();
                    amount = amount.split('</span>');
                    $('#yjz_cart_subtotal .woocommerce-Price-amount').html(amount[0]+'</span>'+data.subtotal);
                }


                quantity();
                yjzSendInfo('成功加入购物车',false,false,1);
            }
            jQuery.data(document.body, "processing", 0);
        });

        return false;
    }

    //topLeft,topRight,middleLeft,middleCenter,middleRight,bottomCenter,bottomRight


    function yjzSendInfo(msg,p,action,type)
    {

        if($(".noticejs").length>0)
            return

        msg=msg? msg:'弹出消息';
        p = p? p:0;
        action=action? action:0;
        type=type? type:0;

        var position_array = ["topCenter", "middleCenter", "bottomCenter","topRight","middleRight","bottomRight"];
        var opan_array = ["animated bounceInRight", "animated zoomIn", "animated fadeIn"];
        var close_array = ["animated bounceOutLeft", "animated zoomOut", "animated fadeOut"];
        var type_array = ["error", "success", "warning", "info"];

        new NoticeJs({
            text: msg,
            position: position_array[p],
            type: type_array[type],
            progressBar:true,
            modal: false,
            timeout: 20,
            animation: {
                open: opan_array[action],
                close: close_array[action]
            }
        }).show();

    }


//加载商品属性信息
    function LoadProductAtrrInfo(obj)
    {
        var p_id = $(obj).attr('data-product_id');
        var vars_info= $(obj).attr('data-attr');
        var var_array = vars_info.split(",");

        //变量数组
        var product_var_array=new Array();//产品属性组
        var product_label_array = new Array();//产品规格标签

        for(var i=0;i<var_array.length;i++)
        {
            //加载变量ID
            var temp_vars = var_array[i].split("==");
            var var_info = new Object();
            var_info.p_id = p_id;
            var_info.variation_id =temp_vars[0];
            var_info.vars = new Array();
            var_info.sale_price = null;
            var_info.regular_price =null;
            //加载变量属性名和属性值
            var temp_attrs = temp_vars[1].split("@@");


            for(var j=0;j<temp_attrs.length;j++)
            {
                var attr_items =  temp_attrs[j].split("&&");

                if(temp_attrs[j].indexOf("attribute_") != -1)
                {
                    attr_items[0] = decodeURI(attr_items[0]);
                    // var_info.vars.push({ attr_name : attr_items[0] , attr_value : attr_items[1] }) ;
                    var_info[attr_items[0]]=attr_items[1];

                    //包含该标签： 检查标签值是否存在存在，存在跳过，不存在保存
                    var is_exsit =false;
                    for(k=0;k<product_label_array.length;k++)
                    {
                        var item =product_label_array[k];
                        if(item.key==attr_items[0])
                        {
                            if( $.inArray(attr_items[1],item.value)==-1)
                                item.value.push(attr_items[1]);

                            is_exsit = true;
                            break;
                        }
                    }

                    //不包含标签 添加标签和初始值
                    if(is_exsit==false)
                    {
                        var var_key = decodeURI(attr_items[0]);
                        var var_name = var_key.replace("attribute_","");
                        product_label_array.push({key:var_key,value:[attr_items[1]],name:var_name});
                    }


                }else if(temp_attrs[j].indexOf("_stock") != -1)
                    var_info.stock = attr_items[1]=='' || attr_items[1]==0?'有货':attr_items[1]+'件';
                else if(temp_attrs[j].indexOf("_regular_price") != -1)
                    var_info.regular_price = attr_items[1];
                else if(temp_attrs[j].indexOf("_sale_price") != -1)
                    var_info.sale_price = attr_items[1]==''?null:attr_items[1];
            }

            product_var_array.push(var_info);
        }


        var p_img = $(obj).attr('data-img');//加载头像
        $('#yjz_cart_p_img').attr('src',p_img);

        var p_title = $(obj).attr('data-title'); //加载标题
        $('#cart_p_title').html(p_title);

        var p_is_more_price = $(obj).attr('data-is-more-price'); //加载标题
        var p_currency = $(obj).attr('data-currency'); //加载金额单位
        var p_stock = $(obj).attr('data-stock'); //加载库存
        if(p_stock=='有货'||p_stock=='')
            p_stock = '库存有货';
        else
            p_stock = '库存 <span class="cart_stock_number">'+p_stock+'</span> 件'

        $('#cart_p_stock').html(p_stock);


        //加载价格
        var price=''
        if(p_is_more_price==1)
        {
            price = '<span class="p_currency">'+p_currency+'</span>';
            price += $(obj).attr('data-max-price')+' - '+$(obj).attr('data-min-price');
        }
        else{
            if($(obj).attr('data-sale-price')!=0)
            {
                price = '<span class="price">'
                price +=    '<del>' +
                    '<span class="p_currency">'+p_currency+'</span>'+
                    $(obj).attr('data-regular-price')+
                    '</del>'+
                    '<span class="p_currency">'+p_currency+'</span>'+
                    $(obj).attr('data-regular-price')+
                    '</span>';
                $(obj).attr('data-sale-price');
            }else
            {
                price = '<span class="p_currency">'+p_currency+'</span>';
                price += $(obj).attr('data-regular-price');
            }
        }

        $('#cart_p_price').html(price);
        $('#cart_p_price').attr('data-currency',p_currency);

        //初始化变量,清空选项组信息
        clear_var_group();
        var p_var_html ='<div class="p_var_group">';
        for(var g=0;g < product_label_array.length;g++)
        {
            var var_index =g+1;
            var lb_item = product_label_array[g];
            $('#product_var_group').attr('group'+var_index,lb_item.name);
            p_var_html+='<div class="p_var_name">'+lb_item.name+'</div>';
            p_var_html+='<div class="p_var_label">';

            var lb_array = lb_item.value;
            for(var g2=0;g2 < lb_array.length;g2++)
            {
                var class_group='cart_var_group'+var_index;
                p_var_html+='<span   class="yjz_cart_choose_value '+class_group+'"  data-group="'+class_group+'"  data-key="'+decodeURI(lb_item.key)+'"  data-value="'+lb_array[g2]+'" onclick="yjz_choose_cart_var(this)" >'+lb_array[g2]+'</span>';
            }
            p_var_html+='</div>'

        }

        $('#product_var_group').val(product_label_array.length);
        p_var_html +='</div">';

        $('#cart_p_item_choose').html(p_var_html);

        //初始化购物车
        //初始化购买按钮
        var product_var_info = JSON.stringify(product_var_array);
        var product_label_array_json = JSON.stringify(product_label_array);
        // console.log(product_label_array_json);
        $("#product_var_info").val(product_var_info);
        $("#cart_p_price").removeAttr('original');
        $("#cart_p_price").attr('p_currency',p_currency);
        return true
    }

    function clear_var_group()
    {
        if($('#product_var_group').val()!=''&&$('#product_var_group').val()>0)
        {
            for(var g=1;g <= $('#product_var_group').val();g++)
            {
                $('#product_var_group').removeAttr('group'+g);
            }
            $('#product_var_group').val();
        }
    }

    function show_cart_layer(){
        $('.yjz_cart_mask_layer').show();
        $('.yjz_cart_layer').removeClass("yjz_cart_layer_hide").addClass("yjz_cart_layer_show").show();
        if(!IsPC())
            $('body').css('overflow','hidden');

        $("#cart_p_qty_num").val(1);
    }

    function hide_cart_layer() {
        $('.yjz_cart_mask_layer').delay(400).hide(0);
        // $('.yjz_cart_layer').hide(0);

        $('.yjz_cart_layer').removeClass("yjz_cart_layer_show").addClass("yjz_cart_layer_hide");//yjz_cart_layer_hide
        $('.yjz_cart_layer').delay(400).hide(0);
        if(!IsPC())
            $('body').css('overflow','');
    }

    function IsPC() {
        var userAgentInfo = navigator.userAgent.toLowerCase();
        var Agents = ["android", "iphone",
            "symbianos", "windows phone",
            "ipad", "ipod","mobile","micromessenger"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    function IsWx() {
        return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
    }

    //pc端选择标签
    init_product_select_tag();
    function init_product_select_tag() {
        var dls = document.querySelectorAll('.yjz-select-tag dl:not(.select)');
        var selected=document.querySelector('.yjz-select-tag .select');

        for (var i = 0; i < dls.length; i++) {
            dls[i].mark=false;	//给每一行的dl标签添加一条属性，用于对应下面的dd标签。我们约定如果这个属性的值为true表示对应的标签没有创建。如果值为false表示对应的标签已经创建了
            select_yjz_tag(i,dls,selected);
        }
    }

    function select_yjz_tag(n,dls,selected) {
        var dds = dls[n].querySelectorAll('.yjz-select-tag dd');
        var prev=null;
        var dd=null;	//每一行都需要创建一个dd标签，放到这里是为了如果标签已经被创建了，通过这个变量能够找到这个标签

        for (var i = 0; i < dds.length; i++) {
            dds[i].onclick = function () {

                //清除所有选中的
                $('.yjz-select-tag .select :not(.choose-title)').remove();
                $('.yjz-select-tag dd').removeClass('active');
                $(this).addClass('active');

                var content = $(this).find("span").html();
                //   $(selected).append("<dd>"+this.innerHTML+"</dd>");
                dd=document.createElement('dd');
                dd.innerHTML=content;
                selected.appendChild(dd);

                var span=document.createElement('span');
                var This=this;
                span.innerHTML='X';
                span.onclick=function(){

                    $('.yjz-select-tag .select :not(.choose-title)').remove();
                    $('.yjz-select-tag dd').removeClass('active');
                    $("#yjzp_current_page").val(0);
                    product_list_current_tagid=null;
                    $('#yjz-product-ul').html('');
                    $('.yd-load-product-data-bt').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
                    get_product_data(product_list_swiper,$("#yjzp_term_ids").val());
                };
                dd.appendChild(span);

                //加载数据
                $('#yjz-product-ul').html('');
                $('.yd-load-product-data-bt').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');


                var tagid = $(this).attr("tagid")

                $("#yjzp_current_page").val(0);
                get_product_data(product_list_swiper,tagid);
                product_list_current_tagid =tagid;
                //<i class="iconfont icon-arrow_up_fill" aria-hidden="true"></i> 上拉加载更多
            };
        }
    }//end select_yjz_tag

    //加载数据

    var loadFlag = true;
    var loading_product_data=0;//正在读取
    var product_list_swiper; //滑动区域
    var product_list_current_tagid = null; //当前标签ID
    var product_list_load_all= 0; //已加载所有数据

    setTimeout(function(){
        var is_pc = $(window).width()>1024;
        if(is_pc)
        {
            $(".yjz-product-swp-container").removeClass("yjz-product-swp-container");
            return;
        }

        product_list_swiper = new Swiper('.yjz-product-swp-container',{
            direction: 'vertical',
            slidesPerView: 'auto',
            mousewheelControl: true,
            freeMode: true,
            on: {
                touchMove: function(event){
                    event.stopPropagation();
                    // var _viewHeight = document.getElementsByClassName('swiper-wrapper')[0].offsetHeight;
                    // var _contentHeight = document.getElementsByClassName('swiper-slide')[0].offsetHeight;
                    // if(product_list_swiper.translate < 50 && product_list_swiper.translate > 0) {
                    //
                    //     $(".yjz-product-head-tip").html('下拉刷新...').show(0);
                    // }else if(product_list_swiper.translate > 50 ){
                    //     $(".yjz-product-head-tip").html('释放刷新...').show(0);
                    // }
                    var start_p = product_list_swiper.translate;

                    console.log('s:'+start_p);
                    setTimeout(function() {
                        var end_p = product_list_swiper.translate;

                        //  console.log('e:'+end_p);

                        if (end_p>start_p && start_p > 0 ) {
                            $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").show();
                        }else if(end_p<start_p && start_p < -100 ){
                            $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").hide();
                        }
                    },30);

                },touchEnd: function(event){
                    //你的事件
                    event.stopPropagation();
                    var _viewHeight = jQuery('.yjz-product-swp-container .swiper-wrapper')[0].offsetHeight;
                    var _contentHeight = jQuery('.yjz-product-swp-container .swiper-slide')[0].offsetHeight;

                    //上拉加载
                    if(product_list_swiper.translate <= _viewHeight - _contentHeight +50 && product_list_swiper.translate < 0)
                    {
                        if(loadFlag){
                            $(".yd-load-product-data-bt").html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>   正在加载...');
                        }else{
                            $(".yd-load-product-data-bt").html('没有更多啦！');
                        }

                        var rs = get_product_data(product_list_swiper,product_list_current_tagid);
                        product_list_swiper.update(); // 重新计算高度;
                    }

                    if(product_list_swiper.translate < -100 ){
                        $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").hide();
                    }else if(product_list_swiper.translate > -150 )
                    {
                        $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").show();
                    }

                    return false;
                },//touchEnd
            },//on end...
        });

    },400);



    function get_product_data(product_list_swiper,tag_id)
    {
        if($("#yjzp_paginate").val()!='1' || loading_product_data==1)
            return ;

        if(product_list_load_all==1 &&tag_id==product_list_current_tagid && tag_id!=null)
        {
            $('.yd-load-product-data-bt').html('已经到底了！');
            return ;
        }
        else
            product_list_load_all = 0;

        var current_page = parseInt($("#yjzp_current_page").val()) +1;
        var end_page =  $("#yjzp_end_page").val();
        var page_size =  $("#yjzp_page_size").val();
        var term_ids =  $("#yjzp_term_ids").val();
        var thumb =  $("#yjzp_thumbnail").val();
        var img_size=  $("#yjzp_image_size").val();
        var query_str=  $("#yjzp_query_str").val();
        var is_pc = $(window).width()>1024;

        if(tag_id!=null&&tag_id!='')
        {
            term_ids = tag_id;
        }


        var params = {'action':'yjz_get_products','page':current_page,'page_size':page_size,'term_ids':term_ids,'thumb':thumb,'img_size':img_size,'query_str':query_str};

        if(current_page>end_page)
        {
            $('.yd-load-product-data-bt').html('已经到底了！');
            loading_product_data=0;
            return;
        }else
        {
            if(is_pc)
                $('.yd-load-product-data-bt').show();

            $('.yd-load-product-data-bt').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>   正在加载');
        }

        loading_product_data=1;
        //wp_ajax_yjz_get_products
        $.ajax({
            type   : 'POST',
            url    : site_url+ "/wp-admin/admin-ajax.php",
            dataType: "JSON",
            data   : params,
            success: function (req) {
                if(is_pc)
                    $('.yd-load-product-data-bt').hide();

                if(req.status==0)
                    yjzSendInfo('加载数据失败',false,false,0);
                else if(req.status==2){
                    $('.yd-load-product-data-bt').html('已经到底了！');
                    product_list_load_all=1;//已加载所有数据
                    loading_product_data=0;
                    if(typeof product_list_swiper !== "undefined")
                        product_list_swiper.update(); // 重新计算高度;
                    return;
                }

                if(req.data!='')
                {
                    $("#yjz-product-ul").append(req.data);
                    $("#yjzp_current_page").val(current_page)
                    $(".single_add_to_cart_button, .add_to_cart_button , .yjz_cart_add_btn").on("click", function () {
                        return product_add_to_cart(this);
                    });
                }

                $('.yd-load-product-data-bt').html('<i class="iconfont icon-arrow_up_fill" aria-hidden="true"></i> 上拉加载更多');

                if(current_page==end_page)
                {
                    $('.yd-load-product-data-bt').html('已经到底了！');
                    product_list_load_all=1;
                }

                loading_product_data=0;
                if(typeof product_list_swiper !== "undefined")
                    product_list_swiper.update();// 重新计算高度;
            },
            error  : function (data) {
                loading_product_data=0;
                if(is_pc)
                    $('.yd-load-product-data-bt').hide();
            },
        });
    }



    $("#yjz-product-tag-icon").on("click", function () {
        if($(this).attr('data-statu')==1)
        {
            $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").hide();
            $(this).attr('data-statu',0);
        }else
        {
            $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").show();
            $(this).attr('data-statu',1);
        }


    });



    /**this is end**/
})( jQuery );

//点击组合标签显示组合标签对应的价钱
function  yjz_choose_cart_var(obj) {
    var $ =jQuery;
    var choose_obj = $(obj);

    if(choose_obj.hasClass('cart_labelacive'))
    {
        choose_obj.removeClass('cart_labelacive');

        if(typeof $("#cart_p_price").attr('original') !=='undefined' && $("#cart_p_price").attr('original')!='')
            $("#cart_p_price").html($("#cart_p_price").attr('original'));
        return;
    }

    var data_group= '.'+choose_obj.attr('data-group');

    // jQuery(".yjz_cart_choose_value."+data_group).removeClass('cart_labelacive');
    $('.yjz_cart_choose_value'+data_group).removeClass('cart_labelacive');
    choose_obj.addClass('cart_labelacive');

    //显示对应价钱

    var pobj = JSON.parse($("#product_var_info").val()) ;
    var var_count = $("#product_var_group").val();
    var p_currency = $("#cart_p_price").attr('p_currency');
    var tlinp = Enumerable.from(pobj);
    for(var i=1;i<=var_count;i++)
    {
        var lb_item = $("span.cart_labelacive.cart_var_group"+i);
        if(lb_item.length!=1)
        {
            if(typeof $("#cart_p_price").attr('original') !=='undefined' && $("#cart_p_price").attr('original')!='')
                $("#cart_p_price").html($("#cart_p_price").attr('original'));
            return false ;
        }else
        {
            var condition ="x=>x."+lb_item.attr('data-key')+"=='"+lb_item.attr('data-value')+"'";
            tlinp = tlinp.where(condition);
        }
    }
    var var_target = tlinp.toArray()[0];
    var sale_price = var_target.sale_price;
    var regular_price = var_target.regular_price;


    if(sale_price!=null)
    {
        price = '<span class="price"><del><span class="p_currency">'+p_currency+'</span>'+regular_price+'</del>'+
            '<span class="p_currency">'+p_currency+'</span>'+ sale_price+ '</span>' ;
    }else
    {
        price = '<span class="p_currency">'+p_currency+'</span>'+regular_price;
    }


    if(typeof $("#cart_p_price").attr('original') ==='undefined')
    {
        $("#cart_p_price").attr('original',$("#cart_p_price").html());
    }

    $("#cart_p_price").html(price);
}


