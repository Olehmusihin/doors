<script>
$(function () {

    var borderColor = 'rgb(255, 133, 98)';
    var github_url = 'https://olehmusihin.github.io/doors/'; // путь к папке где хранятся все изображения;
    var invalid_door_image = 'model-is-invalid.jpg';
    
    var $glass = $(); // jQuery объект с селекторами стёкол
    var $doorColor = $(); // jQuery объект с селекторами цвета
    var $molding = $(); // jQuery объект с селекторами молдингов
    var $baguette = $(); // jQuery объект с селекторами багетов
    var $edge = $(); // jQuery объект с селекторами кромок

    var door = getDoorName();// название папки с дверью, берётся с картинки со страницы с #door=название, должно совпадать с названием папки где хранятся фотографии двери.
    var doorImg = getDoorSelector(); // селектор изображения двери.
    
    var color = '1'; // какой цвет двери будем искать;
    var glass = '1';  // какое стекло будем фильтровать;
    var molding = '';  // какой молдинг будем фильтровать; по дефолту - 
    var baguette = '';  // какой багет будем фильтровать; по дефолту - в цвет
    var edge = '';  // какую кромку будем фильтровать; 

    var glassPrice = 0;  // цена стекла;
    var doorPrice = 0;  // цена цвета двери;
    var startPrice = $('#rec'+ tcalcRec_id+" .t-calc__hiddeninput").eq(0).val(); // начальная цена двери; *
    var startPriceComplect = $('#rec'+ tcalcRec_id + '.t-calc__hiddeninput').val(); // цена комплекта; *

    //определение размеров картинки двери
    var doorWidth = 0;
    var doorHeight = 0;
    setTimeout(getImageParams, 500);
    setTimeout(getGlassParams, 750);
    setTimeout(getColorParams, 1000);

    // добавление текста к надписям и в скрытые поля формы.
    var glassText = ''; // название цвета (текст);
    var moldingText = ''; // название молдинга (текст);
    var baguetteText = ''; // название багеты (текст);
    var doorText = ''; // название двери (текст);
    var glassText_element = $('a[href="#glassText"]');
    var moldingText_element = $('a[href="#moldingText"]');
    var baguetteText_element = $('a[href="#baguetteText"]');
    var doorText_element = $('a[href="#doorText"]');

    /*formula calculate;*/
    var tcalcRec_id = '174482869';  // #recid блока где калькулятор. *
    var inputLidId = '1583230269256'; // data-input-lid; *
    var inputLidIdComplect = '1584778604016'; // data-input-lid id complect; *

    // Add event listeners to a elements;
    $('a').not('[href="#doorText"]').not('[href="#glassText"]').filter(function (i, d) {
        if (d.href.indexOf('#glass') != -1) {
            $glass = $glass.add(d);
            return true;
        }
        if (d.href.indexOf('#doorColor') != -1) {
            $doorColor = $doorColor.add(d);
            return true;
        }
        if (d.href.indexOf('#molding') != -1) {
            $molding = $molding.add(d);
            return true;
        }
        if (d.href.indexOf('#baguette') != -1) {
            $baguette = $baguette.add(d);
            return true;
        }
        if (d.href.indexOf('#edge') != -1) {
            $edge = $edge.add(d);
            return true;
        }
    })
        .on('click', function (e) {
            removeBorders(e);
            addBorder(e);
            findImageNumber(e); //
            addDoorImage(door, color, glass, baguette, molding, edge); // add image
            addDoorText(doorText); // add door text
            addGlassText(glassText); // add glass text
            addMoldingText(moldingText); // add glass text
            addBaguetteText(baguetteText); // add glass text
            reCalculate(doorPrice,glassPrice); // reCalculate
        });

    function addBorder(e) {
        $(e.target).addClass('borderActive')
    }

    function removeBorders(e) {
        if (e.target.href.indexOf('#glass') != -1) {
            $glass.removeClass('borderActive');
        }
        if (e.target.href.indexOf('#doorColor') != -1) {
            $doorColor.removeClass('borderActive');
        }
        if (e.target.href.indexOf('#molding') != -1) {
            $molding.removeClass('borderActive');
        }
        if (e.target.href.indexOf('#baguette') != -1) {
            $baguette.removeClass('borderActive');
        }
        if (e.target.href.indexOf('#edge') != -1) {
            $edge.removeClass('borderActive');
        }
    }

    function findImageNumber(e) {
        var element_href = e.target.href;
        if (element_href.indexOf('#glass') != -1) {
            var params = element_href.replace('?','').split('&');
            glass = findRegularNumber(params[0]);
        }
        if (element_href.indexOf('#doorColor') != -1) {
            var params = element_href.replace('?','').split('&');
            color = findRegularNumber(params[0]);
        }
        if (element_href.indexOf('#molding') != -1) {
            var params = element_href.replace('?','').split('&');
            var moldingCode = findRegularNumber(params[0]) || '';
            molding = (moldingCode != 1) ? moldingCode : '';
        }
        if (element_href.indexOf('#baguette') != -1) {
            var params = element_href.replace('?','').split('&');
            var baguetteCode = findRegularNumber(params[0]) || '';
            baguette = (baguetteCode != 1)  ? baguetteCode : '';
        }
        if (element_href.indexOf('#edge') != -1) {
            var params = element_href.replace('?','').split('&');
            var edgeCode = findRegularNumber(params[0]) || '';
            edge = (edgeCode != 1) ? edgeCode : '';
        }

        if (element_href.indexOf('doorPrice') != -1) {
            doorPrice = getUrlVars(element_href).doorPrice;
        }
        if (element_href.indexOf('glassPrice') != -1) {
            glassPrice = getUrlVars(element_href).glassPrice;
        }
        if (element_href.indexOf('&doorText') != -1) {
            doorText = getUrlVars(element_href).doorText;
        }
        if (element_href.indexOf('&glassText') != -1) {
            glassText = getUrlVars(element_href).glassText;
        }
        if (element_href.indexOf('&moldingText') != -1) {
            moldingText = getUrlVars(element_href).moldingText;
        }
        if (element_href.indexOf('&baguetteText') != -1) {
            baguetteText = getUrlVars(element_href).baguetteText;
        }
    }

    function getUrlVars(href) {
        var vars = [], hash;
        var hashes = href.slice(href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function findRegularNumber(linkHref) {
        const regex = /[^=]\d*$/gm;
        const str = linkHref;
        let m;
        var result;

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                // console.log(match)
                result = match;
                return match;
            });
        }
        return result;
    }

    function addDoorImage(door, color, glass, baguette, molding, edge) {
        $.get(github_url + door + '/' + color + glass + baguette + molding + edge + '.jpeg')
            .done(function () {
                console.log(doorImg);
                doorImg.attr('src', github_url + String(door) + '/' + String(color) + String(glass) + String(baguette) + String(molding) + String(edge) + '.jpeg'); // это переписать
            }).fail(function () {
                doorImg.attr('src', github_url + invalid_door_image);
                throw new Error('Такой фотографии нет! :/');
            });
        console.log(door, color, glass, baguette, molding, edge);
    }

    function getDoorSelector() {
        var doorImg = $('a').filter(function (i, d) {
            // console.log(d);
            if (d.href.indexOf('#door=') != -1) {
                return true;
            }
        }).find('img')
        return doorImg;
    }

    function getImageParams() {
        $('a').each(function (i, d) {
            if (d.href.indexOf('#door=') != -1) {
                doorWidth = $(d).width();
                doorHeight = $(d).height();
                return true;
            }
        })
    }
    
    function getGlassParams() {
        let glasses = [];
        $('a').each(function (i, d) {
            if (d.href.indexOf('#glass') != -1) {
                var params = d.href.replace('?','').split('&');
                let currentParam = +findRegularNumber(params[0]);
                if ($.isNumeric(currentParam)) {
                    glasses.push(currentParam);
                }
            }
        })
        if (glasses.length > 0) {
            glass = Math.min.apply(Math,glasses);
        }
    }

    function getColorParams() {
        let colors = [];
        $('a').each(function (i, d) {
            if (d.href.indexOf('#doorColor') != -1) {
                let colorParams = d.href.replace('?','').split('&');
                let currentColorParam = +findRegularNumber(colorParams[0]);
                if ($.isNumeric(currentColorParam)) {
                    colors.push(currentColorParam);
                }
            }
        })
        if (colors.length > 0) {
            color = Math.min.apply(Math,colors);
        }
    }
    
    function getDoorName() {
        let result = $('a').filter(function (i, d) {
            // console.log(d);
            if (d.href.indexOf('#door=') != -1) {
                return true;
            }
        }).attr('href').replace('#door=', '');
        return result;
    }


    var setPrice = setInterval(function () {
        startPrice = $("#rec" + tcalcRec_id + " .t-calc__hiddeninput").eq(0).val();
        startPriceComplect = $("#rec" + tcalcRec_id + " .t-calc__hiddeninput").eq(1).val();
        if (startPrice == 0 || startPriceComplect == 0) {
            startPrice = $("#rec" + tcalcRec_id + " .t-calc__hiddeninput").eq(0).val();
            startPriceComplect = $("#rec" + tcalcRec_id + " .t-calc__hiddeninput").eq(1).val();
        } else {
            clearInterval(setPrice);
        }
    },500);

    function reCalculate(doorPrice,glassPrice) {
            $("#rec" + tcalcRec_id + " .t-calc").eq(0).attr('data-calc-expr', Number(startPrice) + Number(doorPrice) + Number(glassPrice) + '+ sisists'); // установка цены в атрибут data-calc-expr
            $("#rec" + tcalcRec_id + " .t-calc").eq(1).attr('data-calc-expr', Number(startPriceComplect) + Number(doorPrice) + Number(glassPrice) + '+ sisists'); // установка цены в атрибут data-calc-expr
            tcalc__init(tcalcRec_id,inputLidId); // инициализация(переинициализация калькулятора).
            tcalc__init(tcalcRec_id,inputLidIdComplect); // инициализация(переинициализация калькулятора).
            let price = $("#rec" + tcalcRec_id + " .t-calc__hiddeninput").eq(0).val(); // Цена тут меняется ;
            let priceComplect = $("#rec" + tcalcRec_id + " .t-calc__hiddeninput").eq(1).val(); // цена за комплект.
            $('input[name="door_price"]').val(price); // установка цены в спрятанное поле.
            $('input[name="door_price-complect"]').val(priceComplect); // установка цены в спрятанное поле.
    }

    function addDoorText(data) {
        if (doorText != '') {
            doorText_element.text(decodeURI(data));
            $('input[name="doorText"]').val(decodeURI(data))
        }
    }
    function addGlassText(data) {
        if (glassText != '') {
            glassText_element.text(decodeURI(data));
            $('input[name="glassText"]').val(decodeURI(data));
        }
    }
    function addMoldingText(data) {
        if (moldingText != '') {
           moldingText_element.text(decodeURI(data));
            $('input[name="moldingText"]').val(decodeURI(data));
        }
    }
    function addBaguetteText(data) {
        if (baguetteText != '') {
            baguetteText_element.text(decodeURI(data));
            $('input[name="baguetteText"]').val(decodeURI(data));
        }
    }

    $('body').append('<style>.borderActive { border: 2px solid ' + borderColor + ' !important}</style>');
})
</script>
