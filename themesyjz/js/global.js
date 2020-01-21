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
    var yjz_product_cart_processing = 0;
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


    setTimeout(function(){
        quantity();
    },1000);

    setTimeout(function(){
        jQuery(".remove-cart-item").on("click", function () {
            setCartItemQuantity(this,0);
            $(this).parent().parent().remove();
        });
    },3000);


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
                $('.yjzan-button-icon').attr('data-counter',data.item_quantity);
                if(data.item_quantity==0){
                    $('#yjz_cart_subtotal').hide();
                    $(".woocommerce-mini-cart__empty-message").show();
                    $(".yjzan-menu-cart__footer-buttons").hide();
                }else
                {
                    $(".yjzan-menu-cart__footer-buttons").show();
                }

                //存在父窗口同步更新父窗口的数据
                if(window.top!=window.self)
                {
                    var target = "[data-cart-key='"+item_key+"'].yjz-cart-item-input";
                    if(item_num==0)
                    {
                        $(obj,parent.document).parent().parent().remove();
                        $(target,parent.document).parent().parent().remove();
                    }
                    else
                    {
                        $(target,parent.document).find('.input-text').val(item_num);
                    }

                    $('#yjz_cart_subtotal .woocommerce-Price-amount',parent.document).html(amount[0]+'</span>'+data.subtotal);
                    $('.yjzan-button-icon',parent.document).attr('data-counter',data.item_quantity);
                    if(data.item_quantity==0){
                        $('#yjz_cart_subtotal',parent.document).hide();
                        $(".woocommerce-mini-cart__empty-message",parent.document).show();
                        $(".yjzan-menu-cart__footer-buttons").hide();
                    }else
                    {
                        $(".yjzan-menu-cart__footer-buttons").show();
                    }

                }

            }
        });
    }




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

        if(yjz_product_cart_processing == 1)
            return false;

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
                if($('.variations_form select[name^=attribute]').length) {
                    $('.variations_form select[name^=attribute]').each(function() {
                        var name = $(this).attr("name");
                        var value = $(this).val();
                        if(value=='' && $('.variations_form  label[class*="'+name+'_"].selectedswatch').length==1)
                        {
                            value = $('.variations_form  label[class*="'+name+'_"].selectedswatch').attr('data-option');
                        }

                        attrs[name] = value;
                    });
                } else {
                    $('.variations_form').find('input[name^=attribute]').each(function() {
                        attrs[$(obj).attr("name")] = $(obj).val();
                    });
                }
                for(var entry in attrs) {
                    if(attrs[entry]=='')
                    {
                        yjzSendInfo('请选择产品规格');
                        yjz_product_cart_processing = 0;
                        return false;
                    }
                    variation_data += "&attribute["+entry+"]="+attrs[entry];
                }
            }

            product_id_Val = $(".variations_form ").find("input[name='product_id']").val();
            if(typeof product_id_Val =='undefined')
            {
                product_id_Val = $(".cart .single_add_to_cart_button").val()
            }


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

        yjz_product_cart_processing = 1;
        if($(obj).hasClass('yjz_cart_add_btn'))
            hide_cart_layer();

        $.post(site_url+ "/wp-admin/admin-ajax.php",
            "action=yjz_add_to_cart&product_id="+product_id_Val+"&quantity="+quantity_Val+"&"+variation_data
        ).done(function( data ) {
            if ( data && data.status==1 ) {
                var has_parent = window.top!=window.self;

                update_cart_content(data,null);
                if(window.top!=window.self)
                {
                    update_cart_content(data, parent.document);
                }
                yjzSendInfo('成功加入购物车',false,false,1);
                $(".yjzan-menu-cart__footer-buttons").show();
            }
            yjz_product_cart_processing = 0;
        });

        return false;
    }

    function update_cart_content(data,target)
    {
        if($("#cart_item_"+data.key,target).length==0)
        {
            if(!$(".woocommerce-mini-cart__empty-message",target).is(":hidden"))
            {
                $('#yjz_cart_subtotal',target).show();
                $(".woocommerce-mini-cart.woocommerce-cart-form__contents",target).html(data.cart_item_html);
                $(".woocommerce-mini-cart__empty-message",target).hide();
            }
            else
                $(".woocommerce-mini-cart.woocommerce-cart-form__contents",target).append(data.cart_item_html);

        }else
        {
            $("#cart_item_"+data.key,target).replaceWith(data.cart_item_html);
        }

        $('.yjzan-button-icon',target).attr('data-counter',data.quantity);

        if($('#yjz_cart_subtotal .woocommerce-Price-amount',target).length!=0)
        {
            var amount = $('#yjz_cart_subtotal .woocommerce-Price-amount',target).html();
            amount = amount.split('</span>');
            $('#yjz_cart_subtotal .woocommerce-Price-amount',target).html(amount[0]+'</span>'+data.subtotal);
        }

        quantity();

        jQuery(".remove-cart-item").on("click", function () {
            setCartItemQuantity(this,0);
            $(this).parent().parent().remove();
        });
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
                    $('.yjz-select-tag .select').append('<span class="select_tag_all">全部</span>');

                    $('.yjz-select-tag dd').removeClass('active');
                    $('#yjz-product-ul').html('');
                    $(".yjz-pagination ul.page-numbers").html('');
                    $('.yd-load-product-data-bt').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

                    $("#yjzp_current_page").val(0);
                    $(".yjz-pagination ul.page-numbers").html('');
                    get_product_data(product_list_swiper,$("#yjzp_term_ids").val());

                };
                dd.appendChild(span);
                //加载数据
                $('#yjz-product-ul').html('');
                $(".yjz-pagination ul.page-numbers").html('');
                $('.yd-load-product-data-bt').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');

                var tagid = $(this).attr("tagid")
                $("#yjzp_current_page").val(0);
                $(".yjz-pagination ul.page-numbers").html('');

                get_product_data(product_list_swiper,tagid);

                //隐藏选择栏
                var is_pc = $(window).width()>1024;
                if(!is_pc)
                {
                    $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").hide();
                    $("#yjz-product-tag-icon").attr('data-statu',0);
                    $("#yjz-product-tag-icon").css('transform','rotate(90deg)');
                }
                //$(".yjzan-widget-yjz-products .select_tag_all").hide();

            };
        }
    }//end select_yjz_tag

    //加载数据
    var loading_product_data=0;//正在读取
    var product_list_swiper; //滑动区域
    var product_list_current_tagid = null; //当前标签ID
    var product_list_load_all= 0; //已加载所有数据
    var box_moving = 0;

    setTimeout(function(){

        if($(window).width()<=1024)
        {
            $("#yjz-product-tag-icon").attr('data-statu',0);
            $("#yjz-product-tag-icon").css('transform','rotate(90deg)');
        }

        if( typeof Swiper !== "undefined") {

            product_list_swiper = new Swiper('.yjz-product-swp-container', {
                direction: 'vertical',
                slidesPerView: 'auto',
                mousewheelControl: true,
                freeMode: true,
                on: {
                    touchMove: function (event) {
                        event.stopPropagation();

                        var start_p = product_list_swiper.translate;
                        if (box_moving == 1 || $(window).width() > 1024)
                            return;

                        setTimeout(function () {
                            var end_p = product_list_swiper.translate;
                            box_moving = 1;
                            if (end_p < start_p) {
                                $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").hide();
                                $("#yjz-product-tag-icon").attr('data-statu', 0);
                                $("#yjz-product-tag-icon").css('transform', 'rotate(90deg)');
                            }
                            setTimeout(function () {
                                box_moving = 0;
                            }, 200);
                        }, 30);

                    }, touchEnd: function (event) {
                        //你的事件
                        event.stopPropagation();
                        if ($(window).width() > 1024)
                            return;

                        var _viewHeight = jQuery('.yjz-product-swp-container .swiper-wrapper')[0].offsetHeight;
                        var _contentHeight = jQuery('.yjz-product-swp-container .swiper-slide')[0].offsetHeight;

                        //上拉加载
                        if (product_list_swiper.translate <= _viewHeight - _contentHeight + 50 && product_list_swiper.translate < 0) {
                            $(".yd-load-product-data-bt").html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>   正在加载...');
                            var rs = get_product_data(product_list_swiper, product_list_current_tagid);
                            product_list_swiper.update(); // 重新计算高度;
                        }

                        return false;
                    },//touchEnd
                },//on end...
            });

            product_h_tag_swiper = new Swiper('.yjz-h-tabs-tag', {
                direction: 'horizontal',
                slidesPerView: 'auto',
                freeMode: true, //slide会根据惯性滑动可能不止一格且不会贴合。
                on: {
                    touchMove: function (event) {
                        event.stopPropagation();
                    }, touchEnd: function (event) {
                        event.stopPropagation();
                    },//touchEnd
                },//on end...
            });
        }
    },400);





    //sessionStorage.clear();
    function get_product_data(product_list_swiper,tag_id)
    {
        var is_supports = ( 'sessionStorage' in window && window['sessionStorage'] !== null );

        if(loading_product_data==1)
            return ;

        if(product_list_load_all==1 &&tag_id==product_list_current_tagid)
        {
            $('.yd-load-product-data-bt').html('已经到底了！');
            return ;
        }
        else
            product_list_load_all = 0;


        product_list_current_tagid = tag_id;

        var current_page = typeof $("#yjzp_current_page").val() == 'undefined' ? 1 : parseInt($("#yjzp_current_page").val()) +1;
        var end_page =  $("#yjzp_end_page").val();
        var page_size =  $("#yjzp_page_size").val();
        var term_ids =  $("#yjzp_term_ids").val();
        var thumb =  $("#yjzp_thumbnail").val();
        var img_size=  $("#yjzp_image_size").val();
        var query_str=  $("#yjzp_query_str").val();

        if(tag_id!=null&&tag_id!='')
        {
            term_ids = tag_id;
        }

        var data_key ='procuct_key_'+current_page+'_'+page_size+'_'+(term_ids==''?'all':term_ids)+'_'+thumb+'_'+img_size;

        if(is_supports && sessionStorage.getItem(data_key)!=null)
        {
            var rps_cache = JSON.parse(sessionStorage.getItem(data_key));
            yjz_load_product_data(rps_cache,current_page,end_page);
            loading_product_data=0;
            return;
        }

        var params = {'action':'yjz_get_products','page':current_page,'page_size':page_size,'term_ids':term_ids,'thumb':thumb,'img_size':img_size,'query_str':query_str};
        if(current_page>end_page)
        {
            $('.yd-load-product-data-bt').html('已经到底了！');
            loading_product_data=0;
            product_list_load_all==1
            return;
        }else
        {
            if($(window).width()>1024)
                $('.yd-load-product-data-bt').show();

            $('.yd-load-product-data-bt').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>   正在加载');
        }

        loading_product_data=1;
        $.ajax({
            type   : 'POST',
            url    : site_url+ "/wp-admin/admin-ajax.php",
            dataType: "JSON",
            data   : params,
            success: function (req) {
                yjz_load_product_data(req,current_page,end_page);
                loading_product_data=0;
                if(is_supports)
                    sessionStorage.setItem(data_key, JSON.stringify(req));
            },
            error  : function (data) {
                loading_product_data=0;
                if($(window).width()>1024)
                    $('.yd-load-product-data-bt').hide();
            },
        });
    }

    function yjz_load_product_data(req,current_page,end_page)
    {
        if($(window).width()>1024)
            $('.yd-load-product-data-bt').hide();

        if(req.status==0)
            yjzSendInfo('加载数据失败',false,false,0);
        else if(req.status==2){
            $('.yd-load-product-data-bt').html('已经到底了！');
            product_list_load_all==1;
            if(typeof product_list_swiper !== "undefined")
                product_list_swiper.update(); // 重新计算高度;
            return;
        }

        if(req.data!='')
        {
            if($(window).width()>1024)
            {
                $("#yjz-product-ul").html(req.data);
                //更新页码
                updatePageNumber(req.page_total,req.page);
            }
            else if(current_page<=1)
                $("#yjz-product-ul").html(req.data);
            else
                $("#yjz-product-ul").append(req.data);


            $("#yjzp_current_page").val(current_page)
            $(".single_add_to_cart_button, .add_to_cart_button , .yjz_cart_add_btn").on("click", function () {
                return product_add_to_cart(this);
            });


            $(".yjz_product_detail_link").on("click",function () {
                if($(window).width()>1024)
                    return true;
                $("#yjz_product_detail_iframe").remove();
                $(".yjz_product_detail").append('<iframe id="yjz_product_detail_iframe"  allowfullscreen="1" src="'+$(this).attr("href")+'" class="yjz_product_detail_iframe"  ></iframe>').show();
                $(".yjz_product_detail .fa.fa-spinner ").show();
                setTimeout( function () {
                    $(".yjz_product_detail .fa.fa-spinner ").hide();
                }, 2000 );

                return false
            });

        }

        $('.yd-load-product-data-bt').html('<i class="iconfont icon-arrow_up_fill" aria-hidden="true"></i> 上拉加载更多');

        if(current_page==req.page_total)
        {
            $('.yd-load-product-data-bt').html('已经到底了！');
            product_list_load_all=1;
        }

        if(typeof product_list_swiper !== "undefined")
            product_list_swiper.update();// 重新计算高度;
    }


    function updatePageNumber(endPage,c_page)
    {
        if(endPage==1)
        {
            $(".yjz-pagination ul.page-numbers").html("");
            return;
        }

        var list_size = parseInt($("#yjzp_per_page_num").val());
        var c_list_size = parseInt($("#yjzp_c_page_num").val());//当前列表
        c_page = parseInt(c_page);

        if( typeof  list_size == "undefined" )
            return;

        var c_page = c_page>endPage ? endPage:c_page; //当前页比总页数大时候等于最后一页
        var n_size = Math.floor(c_page/list_size)*list_size;
        var n_size_s = n_size==0 ? 1: n_size;
        var n_size_e = n_size + list_size;
        n_size_e = n_size_e > endPage ? endPage: n_size_e;
        var html = '';

        var prev_page = c_page-1<1 ? 1:c_page-1;
        html = '<li><a class="prev page-numbers" href="javascript:void(0);" data-id="" data-page="'+prev_page+'" title="上一页"><</a></li>';
        for(var i = n_size_s; i <= n_size_e;i++)
        {
            var is_current_page = i == c_page ? 'current':'';
            html +='<li><a class="page-numbers '+is_current_page+'" href="javascript:void(0);" data-id="" data-page="'+i+'" >'+i+'</a></li>';
        }

        var next_page = c_page+1 > endPage ? endPage:c_page+1;
        html +='<li><a class="next page-numbers" href="javascript:void(0);" data-id="" data-page="'+next_page+'" title="下一页" >></a></li>';

        $(".yjz-pagination ul.page-numbers").html(html);

        initYjzPageNumber();
    }

    function initYjzPageNumber()
    {
        $(".yjz-pagination a.page-numbers").on("click", function (even) {
            if($(this).hasClass("current"))
                return;

            event.stopPropagation();
            $(".yjz-pagination a.page-numbers").removeClass("current");

            var c_page = parseInt($(this).attr('data-page'));
            $(".yjz-pagination a.page-numbers").not(".prev, .next").each(function(){
                if($(this).attr('data-page')==c_page)
                {
                    $(this).addClass("current");
                }
            });

            if($("#yjzp_current_page").val()!=c_page)
            {
                var page = c_page-1 ;
                $("#yjzp_current_page").val(page);
                var rs = get_product_data(product_list_swiper,product_list_current_tagid);
            }

        });
    }

    initYjzPageNumber();


    $("#yjz-product-tag-icon").on("click", function () {
        if($(this).attr('data-statu')==1)
        {
            $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").hide();
            $(this).attr('data-statu',0);
            $(this).css('transform','rotate(90deg)');
        }else
        {
            $(".yjzan-widget-yjz-products .yjz-select-tag dl").not(".select").show();
            $(this).attr('data-statu',1);
            $(this).css('transform','rotate(270deg)');
        }

    });



    //产品tabs 竖型标签点击
    $(".yjz-product-left-box .p-child-tag").on("click",function(){
        $("#yjzp_current_page").val(0);
        $('#yjz-product-ul').html('');
        $(".yjz-pagination ul.page-numbers").html('');
        get_product_data(product_list_swiper,$(this).attr("tagid"));
        $(".yjz-product-left-box .p-child-tag.active").removeClass("active");
        $(this).addClass("active");

    });

    //产品tabs 水平标签点击
    $(".yjz-h-tabs-tag .swiper-slide span").on("click",function () {

        $(".yjz-h-tabs-tag .swiper-slide.active").removeClass("active");
        $(".yjz-product-left-box .p-child-tag.active").removeClass("active");
        $(this).parent().addClass("active");
        $("#yjzp_current_page").val(0);
        $('#yjz-product-ul').html('');
        $(".yjz-pagination ul.page-numbers").html('');
        if($(this).attr("tagid")=='all' || typeof  $(this).attr("tagid") == 'undefined')
        {
            $(".yjz-product-left-box .p-child-tag").show();
            //加载全数据
            get_product_data(product_list_swiper,$("#yjzp_term_ids").val());
        }else
        {
            var parent_class_id = '.tag-parent-'+ $(this).attr("tagid");
            $(".yjz-product-left-box .p-child-tag").not(parent_class_id).hide();
            $(".yjz-product-left-box .p-child-tag"+ parent_class_id).show();

            //加载分类目录数据
            get_product_data(product_list_swiper,$(this).attr("tag_child_id"));
        }
    });


    //jQuery(".yjz_product_detail[data-id='04cf420']").html()
    $(".yjz_product_detail_link").on("click",function () {
        if($(window).width()>1024)
            return true;
        $("#yjz_product_detail_iframe").remove();
        $(".yjz_product_detail").append('<iframe id="yjz_product_detail_iframe"  allowfullscreen="1" src="'+$(this).attr("href")+'" class="yjz_product_detail_iframe"  ></iframe>').show();
        $(".yjz_product_detail .fa.fa-spinner ").show();
        setTimeout( function () {
            $(".yjz_product_detail .fa.fa-spinner ").hide();
        }, 2000 );

        return false
    });


    $("#return_btn_product").on("click",function () {
        $(".yjz_product_detail").hide();
        $("#yjz_product_detail_iframe").remove();
        quantity();

    });

    //产品详情页选择标签
    $('.swatchinput label.wcvaswatchlabel ,.swatchinput label.selectedswatch').on("click",function () {
        if($(this).hasClass('selectedswatch'))
        {
            $(this).parent().parent().parent().find('select').val('');
            //取消
        }else
        {
            var value = $(this).attr('data-option');
            if($(this).parent().parent().parent().find('select').length==1){
                $(this).parent().parent().parent().find('select').val(value);
            }
        }
        $(this).parent().parent().parent().find('select').change();
    });


    //订单列表页

    if($("#yjz_post_thumbnail_url").length>0)
    {
        setTimeout( function () {
            wx_share_init();
        }, 2000 );
    }


    function wx_share_init() {
        var sharePicUrl = $("#yjz_post_thumbnail_url").val();
        var qrcodeUrl = $("#yjz_post_qrcode_url").val();
        var headImgUrl = $("#wx_head_img_url").val();

        //多品价格
        if(typeof jQuery(".variations_form.cart").data('product_variations') !=='undefined' && jQuery(".variations_form.cart").data('product_variations').length>0)
        {
            var target_index=0;
            var min_price=jQuery(".variations_form.cart").data('product_variations')[0]['display_price'];
            for(var i=1;jQuery(".variations_form.cart").data('product_variations').length>i;i++)
            {
                var item = jQuery(".variations_form.cart").data('product_variations')[i]['display_price'];
                if(min_price > item)
                {
                    target_index=i;
                    min_price = parseInt(item);
                }
            }

            var display_regular_price =  jQuery(".variations_form.cart").data('product_variations')[target_index]['display_regular_price']//原价
            var display_price =   jQuery(".variations_form.cart").data('product_variations')[target_index]['display_price']//实际价

            $(".share-pic-view #salesPriceText").text(display_price);
            $(".share-pic-view #originPriceText").text(display_regular_price);


        }//单品价格
        else if(typeof jQuery(".yjzan-widget-woocommerce-product-price .woocommerce-Price-amount") !=='undefined' )
        {
            var display_price =  jQuery(".yjzan-widget-woocommerce-product-price .woocommerce-Price-amount")[0].innerText.replace(/¥/, "");
            if(jQuery(".yjzan-widget-woocommerce-product-price .woocommerce-Price-amount").length >1)
            {
                var display_regular_price = jQuery(".yjzan-widget-woocommerce-product-price .woocommerce-Price-amount")[1].innerText.replace(/¥/, "");
            }else
            {
                display_regular_price = display_price;
                $(".share-pic-view .originPrice").remove();
            }

            $(".share-pic-view #originPriceText").text(display_price);
            $(".share-pic-view #salesPriceText").text(display_regular_price);

        }else
        {
            $(".share-pic-view #salesPriceText").remove();
            $(".share-pic-view .originPrice").remove();
        }

        var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'),
            post_img = new Image,
            head_img = new Image;

        //加载主图
        post_img.crossOrigin = 'Anonymous';
        post_img.onload = function(){
            canvas.height = post_img.height;
            canvas.width = post_img.width;
            ctx.drawImage(post_img,0,0);
            var dataURL = canvas.toDataURL('image/png');
            $("#yjz_post_thumbnail").attr('src',dataURL);
        };
        post_img.src = sharePicUrl;

        //加载头像
        head_img.crossOrigin = 'Anonymous';
        head_img.onload = function(){
            canvas.height = head_img.height;
            canvas.width = head_img.width;
            ctx.drawImage(head_img,0,0);
            var dataURL = canvas.toDataURL('image/png');
            $("#wx_head_img").attr('src',dataURL);
        };
        head_img.src = headImgUrl;


        jQuery('#share-qrcode').qrcode({
            render: "canvas",
            width: 60,
            height: 60,
            text: qrcodeUrl
        });
    }

    $(".weixinshare").click(function(){

        $("#share-pic-view-warp").css('display','flex');

        if( typeof $("#share-pic").attr("src") =='undefined' ||$("#share-pic").attr("src")=="")
        {
            html2canvas(document.querySelector("#share-pic-view")).then(canvas => {
                $("#share-pic").hide();
            $("#share-pic").attr("src",canvas.toDataURL("png"));
            $("#share-pic").load(function(){
                $(".loader-icon-wrap").hide();
                $("#share-pic-view").hide();
                $("#share-pic").show(200);
            });
        });
        }else {
            $(".loader-icon-wrap").hide();
        }
    });

    $(".share-pic").click(function(event){
        event.stopPropagation();
    });

    // $(".wx-yjz-share-cqcode").click(function(){
    //     console.log('12345');
    // });


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

