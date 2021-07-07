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
    
    var doorsImages = [];
    var doorsFolders = []; //массив с названиями папок на git, где лежат соответствующие двери 
    getDoors(); // функция заполнения массивов с ссылками и папками хранения дверей
    setDoorsBackground();
    
    var color = '1'; // какой цвет двери будем искать;
    var glass = '1';  // какое стекло/вставку будем фильтровать;
    var molding = '';  // какой молдинг будем фильтровать; по дефолту - 
    var baguette = '';  // какой багет будем фильтровать; по дефолту - в цвет
    var edge = '';  // какую кромку будем фильтровать; 

    function getDoors() {
        $('a').each(function (i, d) {
            if (d.href.indexOf('#doorFolder=') != -1) {
                if ($(d).css('background-image').indexOf("url") != -1) {        
                    doorsImages.push(d);
                    
         	     let doorFolder = d.href.substr(d.href.indexOf("=") + 1);
                    doorsFolders.push(doorFolder);
        	};
            }
        });
    };
    
    function setDoorsBackground() {
        $(doorsImages).css("background-color", "transparent");
    };
    
    $('a').filter(function (i, d) {
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
    	}).on('click', function (e) {
            removeBorders(e);
            addBorder(e);
            findImagesNumbers(e); 
            addDoorsImages(doorsImages, doorsFolders, color, glass, baguette, molding, edge); // add image
        });


    function addBorder(e) {
        $(e.target).addClass('borderActive');
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

    function findImagesNumbers(e) {
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

	
    function addDoorsImages(doorsImages, doorsFolders, color, glass, baguette, molding, edge) {
    	let newDoorIndex = 0;
        $(doorsImages).each(function(index, doorImage) {
            const doorImageUrl = github_url + doorsFolders[index] + '/' + color + glass + baguette + molding + edge + '.jpeg'; 
            console.log('doorImageUrl: ', doorImageUrl);
            
            $.get(doorImageUrl)
                .done(function () {
                    let backgroundImage = "url(" + doorImageUrl + ")";
                    $(doorImage).css("background-image", backgroundImage);
                })
                .fail(function () {
                    let backgroundImageFail = "url(" + github_url + invalid_door_image + ")";
                    $(doorImage).css("background-image", backgroundImageFail);	
                    throw new Error('Такой фотографии нет! :/');
                })
            console.log(color, glass, baguette, molding, edge);
        });
    }

    $('body').append('<style>.borderActive { border: 2px solid ' + borderColor + ' !important}</style>');
})
</script>
