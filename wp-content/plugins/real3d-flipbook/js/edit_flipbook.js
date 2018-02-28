var pluginDir = (function(scripts) {
    var scripts = document.getElementsByTagName('script'),
        script = scripts[scripts.length - 1];
    if (script.getAttribute.length !== undefined) {
        return script.src.split('js/edit_flipbook')[0]
    }
    return script.getAttribute('src', -1).split('js/edit_flipbook')[0]
})();

function getParameterByName(name, url) {
    if (!url)
        url = window.location.href;
    url = url.toLowerCase();
    // This is just to avoid case sensitiveness  
    name = name.replace(/[\[\]]/g, "\\$&").toLowerCase();
    // This is just to avoid case sensitiveness for query parameter name
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results)
        return null;
    if (!results[2])
        return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

(function($) {

    $(document).ready(function() {

        $('#real3dflipbook-admin').show()

        var action = getParameterByName('action')
        /*if(action == 'save_settings' || action == 'edit'){
                $('.unsaved').hide()
            }else{
                $('.unsaved').show()
            }*/



        $('.creating-page').hide()

        var books = $.parseJSON(flipbooks);
        //console.log(books)

        var bookId = getParameterByName('bookId')
        if (!bookId) {
            bookId = '0'
            for (var key in books) {
                if (parseInt(key) > parseInt(bookId))
                    bookId = key
            }
        }

        options = books[bookId]

        function convertStrings(obj) {

            $.each(obj, function(key, value) {
                // console.log(key + ": " + options[key]);
                if (typeof(value) == 'object' || typeof(value) == 'array') {
                    convertStrings(value)
                } else if (!isNaN(value)) {
                    if (obj[key] == "")
                        delete obj[key]
                    else
                        obj[key] = Number(value)
                } else if (value == "true") {
                    obj[key] = true
                } else if (value == "false") {
                    obj[key] = false
                }
            });

        }
        convertStrings(options)


        if (getParameterByName("preview") == 'true') {
            var o = options

            o.assets = {
                preloader: pluginDir + "images/preloader.jpg",
                left: pluginDir + "images/left.png",
                overlay: pluginDir + "images/overlay.jpg",
                flipMp3: pluginDir + "mp3/turnPage.mp3",
                shadowPng: pluginDir + "images/shadow.png"
            };

            /* if (options.type == 'pdf') options.pages = []*/
            for (var i = 0; i < o.pages.length; i++) {
                o.pages[i].htmlContent = unescape(o.pages[i].htmlContent)
            }

            if (o.pages.length < 2 && !o.pdfUrl) {
                alert('Flipbook has no pages!')
                e.preventDefault()
                return false
            }

            $('#flipbook-preview-container-inner').empty()
            $('#flipbook-preview-container-inner').flipBook(o)

            var a = $('#r3d-preview').click()
        }


        // console.log(options)

        $('input[type=radio][name=type]').change(function() {
            // console.log(this.value)
            onFlipbooTypeSelected(this.value)
        });

        function onFlipbooTypeSelected(type) { // switch (type) {
            //     case 'pdf':
            //         $('#add-images').hide()
            //         $('#add-pdf').show()
            //         break;
            //     case 'jpg':
            //         $('#add-images').show()
            //         $('#add-pdf').hide()
            //         break;
            // }
        }

        function setFlipbookType(type) {
            $('#flipbook-type-' + type).prop('checked', 'checked')
            onFlipbooTypeSelected(type)
        }

        if (typeof options.type != 'undefined')
            setFlipbookType(options.type)
        else if (options.pdfUrl && options.pages.length == 0)
            setFlipbookType('pdf')
        else
            setFlipbookType('jpg')

        var title
        if (options.name) {
            title = 'Edit Flipbook "' + options.name + '"'
        } else {
            title = 'Add New Flipbook'
        }

        $("#edit-flipbook-text").text(title)

        addOption("general", "name", "text", "Name", "");
        addOption("general", "mode", "dropdown", "Mode", "normal", ["normal", "lightbox", "fullscreen"]);
        addOption("general", "viewMode", "dropdown", "View mode", "webgl", ["webgl", "3d", "2d", "swipe"]);
        addOption("general", "pageTextureSize", "text", "Texture size", 2048);
        addOption("general", "zoomSize", "text", "Maximum zoom size", '');
        addOption("general", "zoomMin", "text", "Initial zoom", 0.85);
        addOption("general", "zoomDisabled", "checkbox", "Disable mouse wheel zoom", false);
        addOption("general", "singlePageMode", "checkbox", "Single page view (CSS only)", false);
        addOption("general", "pageFlipDuration", "text", "Flip duration", 1);
        addOption("general", "sound", "checkbox", "Sounds", true);
        addOption("general", "startPage", "text", "Start page", 1);
        addOption("general", "deeplinking[enabled]", "checkbox", "Deep linking", false);
        addOption("general", "deeplinking[prefix]", "text", "Deep linking prefix", "");
        addOption("general", "responsiveView", "checkbox", "Responsive view", true);
        addOption("general", "responsiveViewTreshold", "text", "Responsive view treshold", 768);
        addOption("general", "pdfPageScale", "text", "PDF page scale", "");
        addOption("general", "height", "text", "Container height", 400);
        addOption("general", "fitToWindow", "checkbox", "Container fit to window", false);
        addOption("general", "fitToParent", "checkbox", "Container fit to parent div", false);
        addOption("general", "fitToHeight", "checkbox", "Container fit to height", false);
        addOption("general", "offsetTop", "text", "Container offset top (fullscreen)", 0);
        addOption("general", "responsiveHeight", "checkbox", "Container responsive height", true);
        addOption("general", "aspectRatio", "text", "Container aspect ratio", 2);
        addOption("general", "thumbnailsOnStart", "checkbox", "Show thumbnails on start", false);
        addOption("general", "contentOnStart", "checkbox", "Show table of content on start", false);
        addOption("general", "tableOfContentCloseOnClick", "checkbox", "Close table of content when page is clicked", true);
        addOption("general", "autoplayOnStart", "checkbox", "Autoplay on start", false);
        addOption("general", "autoplayInterval", "text", "Autoplay interval (ms)", 3000);
        addOption("general", "autoplayStartPage", "text", "Autoplay start page", 1);
        addOption("general", "rightToLeft", "checkbox", "Right to left mode", false);
        addOption("general", "loadAllPages", "checkbox", "Load all pages on start", false);
        addOption("general", "pageWidth", "text", "Page width (if not set then default page width will be used)", "");
        addOption("general", "pageHeight", "text", "Page height (if not set then default page width will be used)", "");
        addOption("general", "thumbnailWidth", "text", "Thumbnail width", 100);
        addOption("general", "thumbnailHeight", "text", "Thumbnail height", 141);
        addOption("general", "logoImg", "selectImage", "Logo image", "");
        addOption("general", "logoUrl", "text", "Logo link", "");
        addOption("general", "logoCSS", "textarea", "Logo CSS", "position:absolute;");
        addOption("general", "menuSelector", "text", "Menu css selector, for example '#menu' or '.navbar'", "");
        addOption("general", "zIndex", "text", "Container z-index", "auto");
        addOption("general", "allowPageScroll", "dropdown", "Allow page scroll when swiping the flipbook", "vertical", ["vertical", "auto", "none"]);
        addOption('general', 'preloaderText', 'text', 'Preloader text', '')

        addOption("mobile", "viewModeMobile", "dropdown", "Flipbook view mode", "", ["", "webgl", "3d", "2d", "swipe"]);
        addOption("mobile", "pageTextureSizeMobile", "text", "Page texture size", '');
        addOption("mobile", "singlePageModeIfMobile", "checkbox", "Single page view", false);
        addOption("mobile", "pdfBrowserViewerIfMobile", "checkbox", "Use default device pdf viewer instead of flipbook", false);
        addOption("mobile", "pdfBrowserViewerFullscreen", "checkbox", "Default device pdf viewer fullscreen", true);
        addOption("mobile", "pdfBrowserViewerFullscreenTarget", "dropdown", "Default device pdf viewer target", "_blank", ["_self", "_blank"]);
        addOption("mobile", "btnTocIfMobile", "checkbox", "Button table of content", true);
        addOption("mobile", "btnThumbsIfMobile", "checkbox", "Button thumbnails", true);
        addOption("mobile", "btnShareIfMobile", "checkbox", "Button share", false);
        addOption("mobile", "btnDownloadPagesIfMobile", "checkbox", "Button download pages", true);
        addOption("mobile", "btnDownloadPdfIfMobile", "checkbox", "Button view pdf", true);
        addOption("mobile", "btnSoundIfMobile", "checkbox", "Button sound", false);
        addOption("mobile", "btnExpandIfMobile", "checkbox", "Button fullscreen", true);
        addOption("mobile", "btnPrintIfMobile", "checkbox", "Button print", false);
        addOption("mobile", "logoHideOnMobile", "checkbox", "Hide logo", false);
        
        addOption("lightbox", "lightboxBackground", "text", "Lightbox background color", "rgb(81, 85, 88)");
        addOption("lightbox", "lightboxCssClass", "text", "CSS class that triggers the lightbox", "");
        addOption("lightbox", "lightboxContainerCSS", "textarea", "Container CSS", "display:inline-block;padding:10px;");
        addOption("lightbox", "lightboxThumbnailUrl", "selectImage", "Thumbnail", "");
        addOption("lightbox", "lightboxThumbnailHeight", "text", "Thumbnail height", "150");
        addOption("lightbox", "lightboxThumbnailUrlCSS", "textarea", "Thumbnail CSS", "display:block;");
        addOption("lightbox", "lightboxText", "text", "Text link", "");
        addOption("lightbox", "lightboxTextCSS", "textarea", "Text link CSS", "display:block;");
        addOption("lightbox", "lightboxTextPosition", "dropdown", "Text link position", "top", ["top", "bottom"]);
        addOption("lightbox", "lightBoxOpened", "checkbox", "Opened on start", false);
        addOption("lightbox", "lightBoxFullscreen", "checkbox", "Openes in fullscreen", false);
        addOption("lightbox", "lightboxCloseOnClick", "checkbox", "Closes when clicked outside the book", false);
        addOption("lightbox", "lightboxMarginV", "text", "Vertical margin", '0');
        addOption("lightbox", "lightboxMarginH", "text", "Horizontal margin", '0');

        addOption("currentPage", "currentPage[enabled]", "checkbox", "Enabled", true);
        addOption("currentPage", "currentPage[title]", "text", "Title", "Current page");

        addOption("btnAutoplay", "btnAutoplay[enabled]", "checkbox", "Enabled", true);
        addOption("btnAutoplay", "btnAutoplay[icon]", "text", "Icon CSS class", "fa-play");
        addOption("btnAutoplay", "btnAutoplay[title]", "text", "Title", "Autoplay");

        addOption("btnNext", "btnNext[enabled]", "checkbox", "Enabled", true);
        addOption("btnNext", "btnNext[icon]", "text", "Icon CSS class", "fa-chevron-right");
        addOption("btnNext", "btnNext[title]", "text", "Title", "Next Page");

        addOption("btnFirst", "btnFirst[enabled]", "checkbox", "Enabled", false);
        addOption("btnFirst", "btnFirst[icon]", "text", "Button font awesome CSS class", "fa-step-backward");
        addOption("btnFirst", "btnFirst[title]", "text", "Title", "First Page");

        addOption("btnLast", "btnLast[enabled]", "checkbox", "Enabled", false);
        addOption("btnLast", "btnLast[icon]", "text", "Icon CSS class", "fa-step-forward");
        addOption("btnLast", "btnLast[title]", "text", "Title", "Last Page");

        addOption("btnPrev", "btnPrev[enabled]", "checkbox", "Enabled", true);
        addOption("btnPrev", "btnPrev[icon]", "text", "Icon CSS class", "fa-chevron-left");
        addOption("btnPrev", "btnPrev[title]", "text", "Title", "Next Page");

        addOption("btnZoomIn", "btnZoomIn[enabled]", "checkbox", "Enabled", true);
        addOption("btnZoomIn", "btnZoomIn[icon]", "text", "Icon CSS class", "fa-plus");
        addOption("btnZoomIn", "btnZoomIn[title]", "text", "Title", "Zoom in");

        addOption("btnZoomOut", "btnZoomOut[enabled]", "checkbox", "Enabled", true);
        addOption("btnZoomOut", "btnZoomOut[icon]", "text", "Icon CSS class", "fa-minus");
        addOption("btnZoomOut", "btnZoomOut[title]", "text", "Title", "Zoom out");

        addOption("btnToc", "btnToc[enabled]", "checkbox", "Enabled", true);
        addOption("btnToc", "btnToc[icon]", "text", "Icon CSS class", "fa-list-ol");
        addOption("btnToc", "btnToc[title]", "text", "Title", "Table of content");

        addOption("btnThumbs", "btnThumbs[enabled]", "checkbox", "Enabled", true);
        addOption("btnThumbs", "btnThumbs[icon]", "text", "Icon CSS class", "fa-th-large");
        addOption("btnThumbs", "btnThumbs[title]", "text", "Title", "Pages");

        addOption("btnShare", "btnShare[enabled]", "checkbox", "Enabled", true);
        addOption("btnShare", "btnShare[icon]", "text", "Icon CSS class", "fa-share-alt");
        addOption("btnShare", "btnShare[title]", "text", "Title", "Share");

        addOption("btnSound", "btnSound[enabled]", "checkbox", "Enabled", true);
        addOption("btnSound", "btnSound[icon]", "text", "Icon CSS class", "fa-volume-up");
        addOption("btnSound", "btnSound[title]", "text", "Title", "Sound");

        addOption("btnDownloadPages", "btnDownloadPages[enabled]", "checkbox", "Enabled", false);
        addOption("btnDownloadPages", "btnDownloadPages[url]", "selectFile", "Url of zip file containing all pages", "");
        addOption("btnDownloadPages", "btnDownloadPages[icon]", "text", "Icon CSS class", "fa-download");
        addOption("btnDownloadPages", "btnDownloadPages[title]", "text", "Title", "Download pages");

        addOption("btnDownloadPdf", "btnDownloadPdf[enabled]", "checkbox", "Enabled", false);
        addOption("btnDownloadPdf", "btnDownloadPdf[url]", "selectFile", "PDF file url", "");
        addOption("btnDownloadPdf", "btnDownloadPdf[icon]", "text", "Icon CSS class", "fa-file");
        addOption("btnDownloadPdf", "btnDownloadPdf[title]", "text", "Title", "Download PDF");
        addOption("btnDownloadPdf", "btnDownloadPdf[forceDownload]", "checkbox", "Force download", true);
        addOption("btnDownloadPdf", "btnDownloadPdf[openInNewWindow]", "checkbox", "Open PDF in new browser window", true);

        addOption("btnPrint", "btnPrint[enabled]", "checkbox", "Enabled", true);
        addOption("btnPrint", "printPdfUrl", "selectFile", "PDF file for printing", "");
        addOption("btnPrint", "btnPrint[icon]", "text", "Icon CSS class", "fa-print");
        addOption("btnPrint", "btnPrint[title]", "text", "Button title", "Print");

        addOption("btnExpand", "btnExpand[enabled]", "checkbox", "Enabled", true);
        addOption("btnExpand", "btnExpand[icon]", "text", "Icon CSS class", "fa-expand");
        addOption("btnExpand", "btnExpand[iconAlt]", "text", "Icon CSS class alt", "fa-compress");
        addOption("btnExpand", "btnExpand[title]", "text", "Title", "Toggle fullscreen");

        addOption("btnExpandLightbox", "btnExpandLightbox[enabled]", "checkbox", "Enabled", true);
        addOption("btnExpandLightbox", "btnExpandLightbox[icon]", "text", "Icon CSS class", "fa-expand");
        addOption("btnExpandLightbox", "btnExpandLightbox[iconAlt]", "text", "Icon CSS class alt", "fa-compress");
        addOption("btnExpandLightbox", "btnExpandLightbox[title]", "text", "Title", "Toggle fullscreen");

        addOption("google_plus", "google_plus[enabled]", "checkbox", "Enabled", true);
        addOption("google_plus", "google_plus[url]", "text", "URL", "");

        addOption("twitter", "twitter[enabled]", "checkbox", "Enabled", true);
        addOption("twitter", "twitter[url]", "text", "URL", "");
        addOption("twitter", "twitter[description]", "text", "Description", "");

        addOption("facebook", "facebook[enabled]", "checkbox", "Enabled", true);
        addOption("facebook", "facebook[url]", "text", "URL", "");
        addOption("facebook", "facebook[description]", "text", "Description", "");
        addOption("facebook", "facebook[title]", "text", "Title", "");
        addOption("facebook", "facebook[image]", "text", "Image", "");
        addOption("facebook", "facebook[caption]", "text", "Caption", "");

        addOption("pinterest", "pinterest[enabled]", "checkbox", "Enabled", true);
        addOption("pinterest", "pinterest[url]", "text", "URL", "");
        addOption("pinterest", "pinterest[image]", "text", "Image", "");
        addOption("pinterest", "pinterest[description]", "text", "Description", "");

        addOption("email", "email[enabled]", "checkbox", "Enabled", true);
        addOption("email", "email[url]", "text", "URL", "");
        addOption("email", "email[description]", "text", "Description", "");

        addOption("webgl", "lights", "checkbox", "Lights", true);
        addOption("webgl", "lightColor", "text", "Light color", "0xFFFFFF");
        addOption("webgl", "lightPositionX", "text", "Light pposition x", 0);
        addOption("webgl", "lightPositionY", "text", "Light position y", 150);
        addOption("webgl", "lightPositionZ", "text", "Light position z", 1400);
        addOption("webgl", "lightIntensity", "text", "Light intensity", 0.6);

        addOption("webgl", "shadows", "checkbox", "Shadows", true);
        addOption("webgl", "shadowMapSize", "text", "Shadow Map Size", 2048);
        addOption("webgl", "shadowOpacity", "text", "Shadow opacity", 0.2);
        addOption("webgl", "shadowDistance", "text", "Shadow plane distance", 15);

        addOption("webgl", "pageHardness", "text", "Page hardness", 2);
        addOption("webgl", "coverHardness", "text", "Cover hardness", 2);
        addOption("webgl", "pageRoughness", "text", "Page material roughness (between 0 and 1)", 1);
        addOption("webgl", "pageMetalness", "text", "Page material metalness (between 0 and 1)", 0);
        addOption("webgl", "pageSegmentsW", "text", "Page segments W", 6);
        addOption("webgl", "pageSegmentsH", "text", "Page segments H", 1);
        addOption("webgl", "pageMiddleShadowSize", "text", "Middle shadow size", 2);
        addOption("webgl", "pageMiddleShadowColorL", "text", "Left middle shadow color", "#999999");
        addOption("webgl", "pageMiddleShadowColorR", "text", "Right middle shadow color", "#777777");
        addOption("webgl", "antialias", "checkbox", "Antialiasing", false);
        addOption("webgl", "pan", "text", "Camera pan", 0);
        addOption("webgl", "tilt", "text", "Camera tilt", 0);
        addOption("webgl", "rotateCameraOnMouseDrag", "checkbox", "Rotate camera on mouse drag", true);
        addOption("webgl", "panMax", "text", "Camera pan max", 20);
        addOption("webgl", "panMin", "text", "Camera pan min", -20);
        addOption("webgl", "tiltMax", "text", "Camera tilt max", 0);
        addOption("webgl", "tiltMin", "text", "Camera tilt min", -60);
        addOption("webgl", "rotateCameraOnMouseMove", "checkbox", "Rotate camera on mouse move", false);
        addOption("webgl", "panMax2", "text", "Camera pan max", 2);
        addOption("webgl", "panMin2", "text", "Camera pan min", -2);
        addOption("webgl", "tiltMax2", "text", "Camera tilt max", 0);
        addOption("webgl", "tiltMin2", "text", "Camera tilt min", -5);
        addOption("webgl", "minPixelRatio", "dropdown", "Minimum Pixel Ratio", "1", ["1", "1.5", "2"]);

        //UI
        addOption("menu-bar", "menuBackground", "text", "Background color", '');
        addOption("menu-bar", "menuShadow", "text", "Shadow", '0 0 6px rgba(0,0,0,0.16), 0 0 6px rgba(0,0,0,0.23)');
        addOption("menu-bar", "menuMargin", "text", "Margin", '0');
        addOption("menu-bar", "menuPadding", "text", "Padding", '0');
        addOption("menu-bar", "menuOverBook", "checkbox", "Menu over book", false);
        addOption("menu-bar", "hideMenu", "checkbox", "Hide menu", false);

        addOption("menu-buttons", "menuAlignHorizontal", "dropdown", "Horizontal position", 'center', ['right', 'left', 'center']);
        addOption("menu-buttons", "btnColor", "text", "Color", '');
        addOption("menu-buttons", "btnBackground", "text", "Background color", 'none');
        addOption("menu-buttons", "btnRadius", "text", "Radius", '0');
        addOption("menu-buttons", "btnMargin", "text", "Margin", '0');
        addOption("menu-buttons", "btnSize", "text", "Size", '12');
        addOption("menu-buttons", "btnPaddingV", "text", "Padding vertical", '10');
        addOption("menu-buttons", "btnPaddingH", "text", "Padding horizontal", '10');
        addOption("menu-buttons", "btnShadow", "text", "Box shadow", '');
        addOption("menu-buttons", "btnTextShadow", "text", "Text shadow", '');
        addOption("menu-buttons", "btnBorder", "text", "Border", '');

        addOption("side-buttons", "sideBtnColor", "text", "Color", '#fff');
        addOption("side-buttons", "sideBtnBackground", "text", "Background color", 'rgba(0,0,0,.3)');
        addOption("side-buttons", "sideBtnRadius", "text", "Radius", '0');
        addOption("side-buttons", "sideBtnMargin", "text", "Margin", '0');
        addOption("side-buttons", "sideBtnSize", "text", "Size", '30');
        addOption("side-buttons", "sideBtnPaddingV", "text", "Padding vertical", '5');
        addOption("side-buttons", "sideBtnPaddingH", "text", "Padding horizontal", '5');
        addOption("side-buttons", "sideBtnShadow", "text", "Box shadow", '');
        addOption("side-buttons", "sideBtnTextShadow", "text", "Text shadow", '');
        addOption("side-buttons", "sideBtnBorder", "text", "Border", '');

        addOption("current-page", "currentPagePositionV", "dropdown", "Vertical position", "top", ["top", "bottom"]);
        addOption("current-page", "currentPagePositionH", "dropdown", "Horizontal position", "left", ["left", "right"]);
        addOption("current-page", "currentPageMarginV", "text", "Vertical margin", "5");
        addOption("current-page", "currentPageMarginH", "text", "Horizontal margin", "5");

        addOption("close-button", "closeBtnColor", "text", "Color", '#FFF');
        addOption("close-button", "closeBtnBackground", "text", "Background color", 'rgba(0,0,0,.4)');
        addOption("close-button", "closeBtnRadius", "text", "Radius", '0');
        addOption("close-button", "closeBtnMargin", "text", "Margin", '0');
        addOption("close-button", "closeBtnSize", "text", "Size", '20');
        addOption("close-button", "closeBtnPadding", "text", "Padding", '5');
        addOption("close-button", "closeBtnTextShadow", "text", "Text shadow", '');
        addOption("close-button", "closeBtnBorder", "text", "Border", '');

        addOption("ui", "skin", "dropdown", "Skin", "light", ["light", "dark", 'lightgrey', 'darkgrey']);
        addOption("ui", "sideNavigationButtons", "checkbox", "Side navigation buttons", true);

        addOption("bg", "backgroundColor", "text", "Background color", "rgb(81, 85, 88)");
        addOption("bg", "backgroundPattern", "selectImage", "Background image pattern url", "");
        addOption("bg", "backgroundTransparent", "checkbox", "Background transparent", false);
        

        var ui_themes = {"default":{"skin":"light","sideNavigationButtons":true,"menuMargin":0,"menuPadding":0,"menuAlignHorizontal":"center","menuShadow":"0 0 6px rgba(0,0,0,0.16), 0 0 6px rgba(0,0,0,0.23)","menuBackground":"","menuOverBook":false,"btnSize":12,"btnRadius":4,"btnMargin":4,"btnPaddingV":10,"btnPaddingH":10,"btnShadow":"","btnTextShadow":"","btnBorder":"","btnColor":"","btnBackground":"none","sideBtnSize":30,"sideBtnRadius":0,"sideBtnMargin":0,"sideBtnPaddingV":5,"sideBtnPaddingH":5,"sideBtnShadow":"","sideBtnTextShadow":"","sideBtnBorder":"","sideBtnColor":"#FFF","sideBtnBackground":"rgba(0,0,0,.3)","currentPagePositionV":"top","currentPagePositionH":"left","currentPageMarginV":5,"currentPageMarginH":5,"closeBtnSize":20,"closeBtnRadius":0,"closeBtnMargin":0,"closeBtnPadding":10,"closeBtnTextShadow":"","closeBtnColor":"#fff","closeBtnBackground":"rgba(0,0,0,.3)","closeBtnBorder":""},"demo1":{"skin":"light","sideNavigationButtons":"true","menuMargin":"0","menuPadding":"0","menuAlignHorizontal":"center","menuShadow":"0 0 6px rgba(0,0,0,0.16), 0 0 6px rgba(0,0,0,0.23)","menuBackground":"","menuOverBook":"false","btnSize":"16","btnRadius":"0","btnMargin":"0","btnPaddingV":"10","btnPaddingH":"10","btnShadow":"","btnTextShadow":"","btnBorder":"","btnColor":"","btnBackground":"none","sideBtnSize":"40","sideBtnRadius":"0","sideBtnMargin":"5","sideBtnPaddingV":"10","sideBtnPaddingH":"10","sideBtnShadow":"","sideBtnTextShadow":"","sideBtnBorder":"none","sideBtnColor":"#dd4040","sideBtnBackground":"none","currentPagePositionV":"top","currentPagePositionH":"left","currentPageMarginV":"5","currentPageMarginH":"5"},"demo2":{"skin":"light","sideNavigationButtons":"true","menuMargin":"0","menuPadding":"0","menuAlignHorizontal":"center","menuShadow":"none","menuBackground":"none","menuOverBook":"true","btnSize":"14","btnRadius":"4","btnMargin":"4","btnPaddingV":"10","btnPaddingH":"10","btnShadow":"","btnTextShadow":"","btnBorder":"","btnColor":"#ffffff","btnBackground":"rgba(0,0,0,.2)","sideBtnSize":"30","sideBtnRadius":"0","sideBtnMargin":"0","sideBtnPaddingV":"5","sideBtnPaddingH":"5","sideBtnShadow":"","sideBtnTextShadow":"","sideBtnBorder":"","sideBtnColor":"#898585","sideBtnBackground":"none","currentPagePositionV":"top","currentPagePositionH":"left","currentPageMarginV":"5","currentPageMarginH":"5"},"demo3":{"skin":"light","sideNavigationButtons":"false","menuMargin":"0","menuPadding":"5px","menuAlignHorizontal":"right","menuShadow":"none","menuBackground":"none","menuOverBook":"true","btnSize":"12","btnRadius":"0","btnMargin":"0","btnPaddingV":"12","btnPaddingH":"12","btnShadow":"","btnTextShadow":"0 0 2px rgba(0,0,0,.5)","btnBorder":"","btnColor":"#ffffff","btnBackground":"rgba(0,0,0,.3)","sideBtnSize":"60","sideBtnRadius":"50","sideBtnMargin":"0","sideBtnPaddingV":"5","sideBtnPaddingH":"5","sideBtnShadow":"","sideBtnTextShadow":"","sideBtnBorder":"","sideBtnColor":"#adadad","sideBtnBackground":"none","currentPagePositionV":"top","currentPagePositionH":"left","currentPageMarginV":"5","currentPageMarginH":"5"},"demo4":{"skin":"light","sideNavigationButtons":"true","menuMargin":"0","menuPadding":"0","menuAlignHorizontal":"center","menuShadow":"0 0 6px rgba(0,0,0,0.16), 0 0 6px rgba(0,0,0,0.23)","menuBackground":"","menuOverBook":"false","btnSize":"12","btnRadius":"0","btnMargin":"0","btnPaddingV":"10","btnPaddingH":"10","btnShadow":"","btnTextShadow":"","btnBorder":"","btnColor":"","btnBackground":"none","sideBtnSize":"40","sideBtnRadius":"0","sideBtnMargin":"0","sideBtnPaddingV":"","sideBtnPaddingH":"","sideBtnShadow":"","sideBtnTextShadow":"","sideBtnBorder":"","sideBtnColor":"#000","sideBtnBackground":"rgba(255,255,255,.2)","currentPagePositionV":"top","currentPagePositionH":"left","currentPageMarginV":"5","currentPageMarginH":"5"},"demo5":{"skin":"dark","sideNavigationButtons":"true","menuMargin":"0","menuPadding":"10","menuAlignHorizontal":"center","menuShadow":"none","menuBackground":"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%)","menuOverBook":"true","btnSize":"14","btnRadius":"40","btnMargin":"5","btnPaddingV":"10","btnPaddingH":"10","btnShadow":"","btnTextShadow":"","btnBorder":"2px solid #f4be0e","btnColor":"#f4be0e","btnBackground":"none","sideBtnSize":"30","sideBtnRadius":"80","sideBtnMargin":"5","sideBtnPaddingV":"10","sideBtnPaddingH":"10","sideBtnShadow":"0 0 2px #000","sideBtnTextShadow":"0 0 2px #000","sideBtnBorder":"2px solid #f4be0e","sideBtnColor":"#f4be0e","sideBtnBackground":"none","currentPagePositionV":"top","currentPagePositionH":"left","currentPageMarginV":"5","currentPageMarginH":"5"},"demo6":{"skin":"dark","sideNavigationButtons":"true","menuMargin":"0","menuPadding":"10","menuAlignHorizontal":"center","menuShadow":"none","menuBackground":"linear-gradient(to top,rgba(0,0,0,0.65) 0%,transparent 100%)","menuOverBook":"false","btnSize":"16","btnRadius":"40","btnMargin":"5","btnPaddingV":"12","btnPaddingH":"12","btnShadow":"","btnTextShadow":"","btnBorder":"2px solid #f4be0e","btnColor":"#f4be0e","btnBackground":"none","sideBtnSize":"50","sideBtnRadius":"80","sideBtnMargin":"5","sideBtnPaddingV":"","sideBtnPaddingH":"","sideBtnShadow":"0 0 2px #000","sideBtnTextShadow":"0 0 2px #000","sideBtnBorder":"2px solid #f4be0e","sideBtnColor":"#f4be0e","sideBtnBackground":"none"},"demo7":{"skin":"light","sideNavigationButtons":"true","menuMargin":"0","menuPadding":"15","menuAlignHorizontal":"center","menuShadow":"none","menuBackground":"none","menuOverBook":"true","btnSize":"16","btnRadius":"4","btnMargin":"2","btnPaddingV":"10","btnPaddingH":"10","btnShadow":"","btnTextShadow":"","btnBorder":"","btnColor":"#212121","btnBackground":"rgba(255,255,255,0.7)","sideBtnSize":"40","sideBtnRadius":"0","sideBtnMargin":"0","sideBtnPaddingV":"5","sideBtnPaddingH":"5","sideBtnShadow":"","sideBtnTextShadow":"","sideBtnBorder":"","sideBtnColor":"#898585","sideBtnBackground":"none","currentPagePositionV":"top","currentPagePositionH":"left","currentPageMarginV":"5","currentPageMarginH":"5"},"demo8":{"skin":"light","sideNavigationButtons":"true","menuMargin":"5","menuPadding":"0","menuAlignHorizontal":"right","menuShadow":"none","menuBackground":"none","menuOverBook":"true","btnSize":"12","btnRadius":"4","btnMargin":"2","btnPaddingV":"10","btnPaddingH":"10","btnShadow":"","btnTextShadow":"","btnBorder":"","btnColor":"#ffffff","btnBackground":"rgba(0,0,0,.3)","sideBtnSize":"30","sideBtnRadius":"4","sideBtnMargin":"0","sideBtnPaddingV":"","sideBtnPaddingH":"","sideBtnShadow":"","sideBtnTextShadow":"","sideBtnBorder":"","sideBtnColor":"#ffffff","sideBtnBackground":"rgba(0,0,0,.3)","currentPagePositionV":"bottom","currentPagePositionH":"left","currentPageMarginV":"5","currentPageMarginH":"5"}}

        $("#flipbook-theme").change(function(e) {

            var name = $("#flipbook-theme").find(":selected").text();
            var obj = ui_themes[name]
            for (var key in obj) {
                setOptionValue(key, obj[key])
            }
        })

        if (options.pdfUrl && options.type == 'pdf') {
            PDFJS.workerSrc = pluginDir + 'js/pdf.worker.min.js'
            PDFJS.getDocument(options.pdfUrl, null, false).then(function(pdf) {
                creatingPage = 1
                loadPageFromPdf(pdf)
            });

            setOptionValue('pdfUrl', options.pdfUrl)
        }

        function updateSaveBar() {

            if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 50)) {

                $("#r3d-save").removeClass("r3d-save-sticky")
                $("#r3d-save-holder").hide()

            } else {

                $("#r3d-save").addClass("r3d-save-sticky")
                $("#r3d-save-holder").show()

            }

        }

        $('#real3dflipbook-admin .nav-tab').click(function(e) {
            e.preventDefault()
            $('#real3dflipbook-admin .tab-active').hide()
            $('.nav-tab-active').removeClass('nav-tab-active')
            var a = jQuery(this).addClass('nav-tab-active')
            var id = "#" + a.attr('data-tab')
            jQuery(id).addClass('tab-active').fadeIn()

            updateSaveBar()

        })

        $('#real3dflipbook-admin .nav-tab').focus(function(e) {

            this.blur()
        })

        $($('#real3dflipbook-admin .nav-tab')[0]).trigger('click')



        $('.flipbook-preview').click(function(e) {


            var $form = $('#real3dflipbook-options-form')

            $form.find('.spinner').css('visibility', 'visible')

            $form.find('.save-button').prop('disabled', 'disabled').css('pointer-events', 'none')

            $('#flipbook-preview-container-inner').empty()

            var data = $form.serialize() + '&action=r3d_save&bookId=' + getParameterByName('bookId')

            $.ajax({
                type: "POST",
                url: $form.attr('action'), //.replace('admin-ajax','admin'),
                data: data,
                success: function(response, textStatus, jqXHR) {


                    // var books = $.parseJSON(flipbooks);

                    $form.find('.spinner').css('visibility', 'hidden')
                    $form.find('.save-button').prop('disabled', '').css('pointer-events', 'auto')



                    var o = $.parseJSON(response)
                    convertStrings(o)

                    o.assets = {
                        preloader: pluginDir + "images/preloader.jpg",
                        left: pluginDir + "images/left.png",
                        overlay: pluginDir + "images/overlay.jpg",
                        flipMp3: pluginDir + "mp3/turnPage.mp3",
                        shadowPng: pluginDir + "images/shadow.png"
                    };

                    for (var i = 0; i < o.pages.length; i++) {
                        o.pages[i].htmlContent = unescape(o.pages[i].htmlContent)
                    }

                    if (o.pages.length < 2 && !o.pdfUrl) {
                        alert('Flipbook has no pages!')
                        e.preventDefault()
                        return false
                    }


                    $('#flipbook-preview-container-inner').flipBook(o)



                }
            })

        });

        $('#real3dflipbook-options-form').submit(function(e) {


            e.preventDefault();

            var $form = $(this)

            $form.find('.spinner').css('visibility', 'visible')

            $form.find('.save-button').prop('disabled', 'disabled').css('pointer-events', 'none')

            var data = $form.serialize() + '&action=r3d_save&bookId=' + getParameterByName('bookId')

            $.ajax({
                type: "POST",
                url: $form.attr('action'), //.replace('admin-ajax','admin'),
                data: data,
                success: function(data, textStatus, jqXHR) {


                    // var books = $.parseJSON(flipbooks);

                    $form.find('.spinner').css('visibility', 'hidden')
                    $form.find('.save-button').prop('disabled', '').css('pointer-events', 'auto')

                }
            })

        })

        $(window).scroll(function() {
            updateSaveBar()
        })

        $(window).resize(function() {
            updateSaveBar()
        })

        updateSaveBar()

        function unsaved() { // $('.unsaved').show()
        }

        function addOption(section, name, type, desc, defaultValue, values) {

            var table = $("#flipbook-" + section + "-options");
            var tableBody = table.find('tbody');
            var row = $('<tr valign="top"  class="field-row"></tr>').appendTo(tableBody);
            var th = $('<th scope="row">' + desc + '</th>').appendTo(row);
            var td = $('<td></td>').appendTo(row);

            // var list = $("#flipbook-options-list");
            // var li = $('<li />').appendTo(list);
            // var label = $('<label />').appendTo(li);
            // label.text(desc);

            switch (type) {
                case "text":
                    var input = $('<input type="text" name="' + name + '"/>').appendTo(td);
                    if (options[name] && typeof(options[name]) != 'undefined') {
                        input.attr("value", options[name]);
                    } else if (options[name.split("[")[0]] && name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                        input.attr("value", options[name.split("[")[0]][name.split("[")[1].split("]")[0]]);
                    } else {
                        input.attr('value', defaultValue);
                    }
                    // input.change(unsaved)
                    break;
                case "color":
                    var input = $('<input type="text" name="' + name + '"/>').appendTo(td);
                    if (options[name] && typeof(options[name]) != 'undefined') {
                        input.attr("value", options[name]);
                    } else if (options[name.split("[")[0]] && name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                        input.attr("value", options[name.split("[")[0]][name.split("[")[1].split("]")[0]]);
                    } else {
                        input.attr('value', defaultValue);
                    }
                    input.wpColorPicker();
                    // input.change(unsaved)
                    break;
                case "textarea":
                    var elem = $('<textarea name="' + name + '"/>').appendTo(td);
                    if (options[name] && typeof(options[name]) != 'undefined') {
                        elem.attr("value", options[name]);
                    } else if (options[name.split("[")[0]] && name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                        elem.attr("value", options[name.split("[")[0]][name.split("[")[1].split("]")[0]]);
                    } else {
                        elem.attr('value', defaultValue);
                    }
                    // elem.change(unsaved)
                    break;
                case "checkbox":
                    var inputHidden = $('<input type="hidden" name="' + name + '" value="false"/>').appendTo(td);
                    var input = $('<input type="checkbox" name="' + name + '" value="true"/>').appendTo(td);
                    if (typeof(options[name]) != 'undefined') {
                        input.attr("checked", options[name]);
                    } else if (options[name.split("[")[0]] && name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                        var val = options[name.split("[")[0]][name.split("[")[1].split("]")[0]]
                        input.attr("checked", val && val != 'false');

                    } else {
                        input.attr('checked', defaultValue);
                    }
                    // input.change(unsaved)
                    break;
                case "selectImage":
                    var input = $('<input type="hidden" name="' + name + '"/><img name="' + name + '"><a class="select-image-button button-secondary button80" href="#">Select image</a><a class="remove-image-button button-secondary button80" href="#">Remove image</a>').appendTo(td);
                    if (typeof(options[name]) != 'undefined') {
                        $(input[0]).attr("value", options[name]);
                        $(input[1]).attr("src", options[name]);
                    } else if (name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                        $(input[0]).attr("value", options[name.split("[")[0]][name.split("[")[1].split("]")[0]]);
                        $(input[1]).attr("src", options[name.split("[")[0]][name.split("[")[1].split("]")[0]]);
                    } else {
                        $(input[0]).attr('value', defaultValue);
                    }
                    // input.change(unsaved)
                    break;
                case "selectFile":
                    var input = $('<input type="text" name="' + name + '"/><a class="select-image-button button-secondary button80" href="#">Select file</a>').appendTo(td);
                    if (typeof(options[name]) != 'undefined') {
                        input.attr("value", options[name]);
                    } else if (name.indexOf("[") != -1 && typeof(options[name.split("[")[0]]) != 'undefined') {
                        input.attr("value", options[name.split("[")[0]][name.split("[")[1].split("]")[0]]);
                    } else {
                        input.attr('value', defaultValue);
                    }
                    // input.change(unsaved)
                    break;

                case "dropdown":
                    var select = $('<select name="' + name + '">').appendTo(td);
                    for (var i = 0; i < values.length; i++) {
                        var option = $('<option name="' + name + '" value="' + values[i] + '">' + values[i] + '</option>').appendTo(select);
                        if (typeof(options[name]) != 'undefined') {
                            if (options[name] == values[i]) {
                                option.attr('selected', 'true');
                            }
                        } else if (defaultValue == values[i]) {
                            option.attr('selected', 'true');
                        }
                    }
                    // select.change(unsaved)
                    break;

            }

        }
        // flipbook-options

        //for all pages in  options.pages create page 
        if (getOptionValue('pdfUrl') == '') {

            for (var i = 0; i < options.pages.length; i++) {
                var page = options.pages[i];
                var pagesContainer = $("#pages-container");
                var pageItem = createPageHtml("pages[" + i + "]", i + 1, page.title, page.src, page.thumb, page.htmlContent);
                pageItem.appendTo(pagesContainer);
            }

            $('.page').click(function(e) {
                expandPage($(this).attr("id"))
            })

            generateLightboxThumbnail()
        }

        if (options.socialShare == null)
            options.socialShare = [];

        for (var i = 0; i < options.socialShare.length; i++) {
            var share = options.socialShare[i];
            var shareContainer = $("#share-container");
            var shareItem = createShareHtml("socialShare[" + i + "]", i, share.name, share.icon, share.url, share.target);
            shareItem.appendTo(shareContainer);

        }

        if (options.tableOfContent == null)
            options.tableOfContent = [];

        for (var i = 0; i < options.tableOfContent.length; i++) {

            var toc = options.tableOfContent[i];
            var tocContainer = $("#toc-container");
            var tocItem = createTocHtml("tableOfContent[" + i + "]", i, toc.title, toc.page);
            tocItem.appendTo(tocContainer);

        }

        // $(".tabs").tabs();
        $(".ui-sortable").sortable();
        addListeners();

        $('.attachment-details').hide()

        $('#add-share-button').click(function(e) {

            e.preventDefault()

            var shareContainer = $("#share-container");
            var shareCount = shareContainer.find(".share").length;
            var shareItem = createShareHtml("socialShare[" + shareCount + "]", "", "", "", "", "_blank");
            shareItem.appendTo(shareContainer);

            addListeners();
            // $(".tabs").tabs();
        });

        function selectJpgImages() {

            if (getOptionValue('pdfUrl') != '') {

                clearPages()
                options.pages = []

            }

            setOptionValue('type', 'jpg')

            setOptionValue('pdfUrl', '')

            $('.attachment-details').hide()

            var pdf_uploader = wp.media({
                title: 'Select images',
                button: {
                    text: 'Select'
                },
                multiple: true // Set this to true to allow multiple files to be selected
            }).on('select', function() {

                var arr = pdf_uploader.state().get('selection');
                var pages = new Array();

                for (var i = 0; i < arr.models.length; i++) {
                    var url = arr.models[i].attributes.sizes.full.url;
                    var thumb = (typeof(arr.models[i].attributes.sizes.medium) != "undefined") ? arr.models[i].attributes.sizes.medium.url : url;
                    var title = arr.models[i].attributes.title;
                    pages.push({
                        title: title,
                        url: url,
                        thumb: thumb
                    });
                }

                var pagesContainer = $("#pages-container");

                for (var i = 0; i < pages.length; i++) {

                    var pagesCount = pagesContainer.find(".page").length;
                    var pageItem = createPageHtml("pages[" + pagesCount + "]", pagesCount + 1, pages[i].title, pages[i].url, pages[i].thumb, "");
                    pageItem.appendTo(pagesContainer);
                    pageItem.hide().fadeIn();

                }

                addListeners();

                clearLightboxThumbnail()

                generateLightboxThumbnail()

                //document.getElementById("real3dflipbook-options-form").submit();

            }).open();

        }

        function clearPages() {
            $('.page').remove();
        }

        function clearLightboxThumbnail() {
            $("input[name='lightboxThumbnailUrl']").attr('value', '')
            $("img[name='lightboxThumbnailUrl']").attr('src', '')
        }

        function removePage(index) {
            $('#pages-container').find('#' + index).remove();

            $('.attachment-details').hide()
        }

        function addListeners() {
            $('.submitdelete').click(function() {
                $(this).parent().parent().animate({
                    'opacity': 0
                }, 100).slideUp(100, function() {
                    $(this).remove();
                });
                // $('.unsaved').show()
            });

            /*$('.html-content').each(function() {
                $(this).parent().find('.html-content-hidden').val(escape($(this).val()))
            })
            $('.html-content').change(function() {
                $(this).parent().find('.html-content-hidden').val(escape($(this).val()))
            })*/

            /*$('.select-image-button').click(function(e) {
                        e.preventDefault();
                        var imageURLInput = $(this).parent().find("input");
                        tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true');
                        $("#TB_window,#TB_overlay,#TB_HideSelect").one("unload", function(e) {
                            e.stopPropagation();
                            e.stopImmediatePropagation();
                            return false;
                        });
             window.send_to_editor = function (html) {
             var imgurl = jQuery('img',html).attr('src');
             imageURLInput.val(imgurl);
             tb_remove();
             };
             }); */

            $('.add-pdf-pages-button').click(function(e) {
                e.preventDefault();

                if ($('.page').length == 0 || confirm('All current pages will be lost. Are you sure?')) {

                    selectPdfFile()

                }
            })

            $('.delete-pages-button').click(function(e) {
                e.preventDefault();

                if (confirm('Delete all pages. Are you sure?')) {

                    clearPages()

                    options.pages = []

                }
            })

            $('.select-image-button').click(function(e) {
                e.preventDefault();

                var $input = $(this).parent().find("input")
                var $img = $(this).parent().find("img")

                var pdf_uploader = wp.media({
                    title: 'Select file',
                    button: {
                        text: 'Select'
                    },
                    multiple: false // Set this to true to allow multiple files to be selected
                }).on('select', function() {

                    // $('.unsaved').show()
                    var arr = pdf_uploader.state().get('selection');
                    var selected = arr.models[0].attributes.url

                    $input.val(selected)
                    $img.attr('src', selected)
                }).open();
            })

            $('.remove-image-button').click(function(e) {
                e.preventDefault();

                var $input = $(this).parent().find("input")
                var $img = $(this).parent().find("img")

                $input.val('')
                $img.attr('src', '')
            })

            $('.delete-all-pages-button').click(function(e) {

                e.preventDefault();

                clearPages()

            });

            $('.delete-page').click(function(e) {

                e.preventDefault();

                var index = jQuery('.attachment-details').attr('data-id')

                if (confirm('Delete page ' + index + '. Are you sure?')) {

                    removePage(index)
                }

            });

            $('.add-jpg-pages-button').click(function(e) {
                //open editor to select one or multiple images and create pages from them
                e.preventDefault();

                if (getOptionValue('pdfUrl') != '') {
                    if (confirm('All current pages will be lost. Are you sure?')) {

                        selectJpgImages()

                    }
                } else
                    selectJpgImages()

            });

            $('.page').click(function(e) {
                expandPage($(this).attr('id'))
            })

            $('.replace-page').click(function(event) {
                replacePage()
            });

        }

        function replacePage() {
            var pdf_uploader = wp.media({
                title: 'Select image',
                button: {
                    text: 'Select'
                },
                multiple: false // Set this to true to allow multiple files to be selected
            }).on('select', function() {

                var index = getEditingPageIndex()

                var selected = pdf_uploader.state().get('selection').models[0];

                var url = selected.attributes.sizes.full.url;
                var thumb = (typeof(selected.attributes.sizes.medium) != "undefined") ? selected.attributes.sizes.medium.url : null;

                setSrc(index, url)
                setThumb(index, thumb)
                setEditingPageThumb(thumb)

            }).open();
        }

        function selectPdfFile() {

            var pdf_uploader = wp.media({
                title: 'Select PDF',
                button: {
                    text: 'Select'
                },
                multiple: false // Set this to true to allow multiple files to be selected
            }).on('select', function() {

                setOptionValue('type', 'pdf')

                $('.attachment-details').hide()

                clearPages()

                clearLightboxThumbnail()

                options.pages = []

                $('#pages-container').removeClass('ui-sortable')

                // $('.unsaved').show()
                var arr = pdf_uploader.state().get('selection');
                var pdfUrl = arr.models[0].attributes.url
                $("input[name='pdfUrl']").attr('value', pdfUrl);
                //we have the pdf url, now use pdf.js to open pdf 
                function getDocumentProgress(progressData) {
                    // console.log(progressData.loaded / progressData.total);
                    $('.creating-page').html('Loading PDF ' + parseInt(100 * progressData.loaded / progressData.total) + '% ')
                    $('.creating-page').show()
                }
                PDFJS.workerSrc = pluginDir + 'js/pdf.worker.min.js'
                PDFJS.getDocument(pdfUrl, null, false, getDocumentProgress).then(function(pdf) {
                    creatingPage = 1
                    loadPageFromPdf(pdf)
                });

            }).open();
        }

        function createPageHtml(prefix, id, title, src, thumb, htmlContent) {
            htmlContent = unescape(htmlContent);
            if (htmlContent == 'undefined' || typeof(htmlContent) == 'undefined')
                htmlContent = ''
            if (title == 'undefined' || typeof(title) == 'undefined')
                title = ''

            var res = $('<li id="' + id + '"class="page">' + '<div class="page-img"><img src="' + thumb + '"></div>' + '<p class="page-title">' + id + '</p>' + '<div style="display:block;">' + '<input id="page-title" name="' + prefix + '[title]" type="hidden" placeholder="title" value="' + title + '" readonly/>' + '<input id="page-src" name="' + prefix + '[src]" type="hidden" placeholder="src" value="' + src + '" readonly/>' + '<input id="page-thumb" name="' + prefix + '[thumb]" type="hidden" placeholder="thumb" value="' + thumb + '" readonly/>' + '<input type="hidden" placeholder="htmlContent" class="html-content-hidden" name="' + prefix + '[htmlContent]" value="' + escape(htmlContent) + '"readonly/>' + '</div>' + '</li>');

            res.find('img').bind('load', function() {
                var h = $(this).height()
                var w = $(this).width()
                var ch = res.find('.page-img').height()
                res.find('.page-img').css('width', ch * w / h + 'px')
            })

            return res
        }

        function createShareHtml(prefix, id, name, icon, url, target) {

            if (typeof(target) == 'undefined' || target != "_self")
                target = "_blank";

            var markup = $('<div id="' + id + '"class="share">' + '<h4>Share button ' + id + '</h4>' + '<div class="tabs settings-area">' + '<ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">' + '<li><a href="#tabs-1">Icon name</a></li>' + '<li><a href="#tabs-2">Icon css class</a></li>' + '<li><a href="#tabs-3">Link</a></li>' + '<li><a href="#tabs-4">Target</a></li>' + '</ul>' + '<div id="tabs-1" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' + '<input id="page-title" name="' + prefix + '[name]" type="text" placeholder="Enter icon name" value="' + name + '" />' + '</div>' + '</div>' + '<div id="tabs-2" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' + '<input id="image-path" name="' + prefix + '[icon]" type="text" placeholder="Enter icon CSS class" value="' + icon + '" />' + '</div>' + '</div>' + '<div id="tabs-3" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' + '<input id="image-path" name="' + prefix + '[url]" type="text" placeholder="Enter link" value="' + url + '" />' + '</div>' + '</div>' + '<div id="tabs-4" class="ui-tabs-panel ui-widget-content ui-corner-bottom">' + '<div class="field-row">' // + '<input id="image-path" name="'+prefix+'[target]" type="text" placeholder="Enter link" value="'+target+'" />'

                +
                '<select id="social-share" name="' + prefix + '[target]">' // + '<option name="'+prefix+'[target]" value="_self">_self</option>'
                // + '<option name="'+prefix+'[target]" value="_blank">_blank</option>'
                +
                '</select>' + '</div>' + '</div>' + '<div class="submitbox deletediv"><span class="submitdelete deletion">x</span></div>' + '</div>' + '</div>' + '</div>');

            var values = ["_self", "_blank"];
            var select = markup.find('select');

            for (var i = 0; i < values.length; i++) {
                var option = $('<option name="' + prefix + '[target]" value="' + values[i] + '">' + values[i] + '</option>').appendTo(select);
                if (typeof(options["socialShare"][id]) != 'undefined') {
                    if (options["socialShare"][id]["target"] == values[i]) {
                        option.attr('selected', 'true');
                    }
                }
            }

            return markup;
        }

        function getOptionValue(optionName, type) {
            var type = type || 'input'
            var opiton = $(type + "[name='" + optionName + "']")
            return opiton.attr('value');
        }

        function getOption(optionName, type) {
            var type = type || 'input'
            var opiton = $(type + "[name='" + optionName + "']")
            return opiton;
        }

        console.log(getOptionValue('mode', 'select'))

        function onModeChange() {
            if (getOptionValue('mode', 'select') == 'lightbox')
                $('[href="#tab-lightbox"]').closest('li').show();
            else
                $('[href="#tab-lightbox"]').closest('li').hide();
        }

        getOption('mode', 'select').change(onModeChange)
        onModeChange()

        function onViewModeChange() {
            if (getOptionValue('viewMode', 'select') == 'webgl')
                $('[href="#tab-webgl"]').closest('li').show();
            else
                $('[href="#tab-webgl"]').closest('li').hide();
        }

        getOption('viewMode', 'select').change(onViewModeChange)
        onViewModeChange()

        function setOptionValue(optionName, value, type) {
            var type = type || 'input'
            var $elem = $(type + "[name='" + optionName + "']").attr('value', value).prop('checked', value);

            $("select[name='" + optionName + "']").val(value);
            // $("option[value='"+value+"']").attr("selected", true);

            return $elem
        }

        function setColorOptionValue(optionName, value) {
            var $elem = $("input[name='" + optionName + "']").attr('value', value);
            $elem.wpColorPicker()
            return $elem
        }

        function renderPdfPage(pdfPage, onComplete, height) {
            var context, scale, viewport, canvas, context, renderContext;

            viewport = pdfPage.getViewport(1);
            scale = (height || 80) / viewport.height
            viewport = pdfPage.getViewport(scale);
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            canvas.width = viewport.width
            canvas.height = viewport.height

            renderContext = {
                canvasContext: context,
                viewport: viewport,
                intent: 'display' // intent:'print'
            };

            pdfPage.render(renderContext).then(function() {

                onComplete(canvas)
            })
        }

        function generateLightboxThumbnail(pdfPage) {
            var thumb = $("input[name='pages[0][thumb]']").attr('value')
            var lightboxThumbnailUrl = $("input[name='lightboxThumbnailUrl']").attr('value')
            if (lightboxThumbnailUrl == "") {
            	console.log("generate lightbox thumbnail")
                if (!pdfPage) {
                    $("input[name='lightboxThumbnailUrl']").attr('value', thumb)
                    $("img[name='lightboxThumbnailUrl']").attr('src', thumb)
                } else {
                    var height = getOptionValue('lightboxThumbnailHeight');
                    var viewport = pdfPage.getViewport(1);
                    var scale = height / viewport.height
                    var viewport = pdfPage.getViewport(scale);
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    canvas.width = viewport.width
                    canvas.height = viewport.height

                    renderContext = {
                        canvasContext: context,
                        viewport: viewport,
                        intent: 'display' // intent:'print'
                    };

                    pdfPage.render(renderContext).then(function(a, b, c, d) {

                        var thumb = canvas.toDataURL()

                        $("input[name='lightboxThumbnailUrl']").attr('value', thumb)
                        $("img[name='lightboxThumbnailUrl']").attr('src', thumb)
                    })

                }
            }

        }

        function expandPage(index) {

            $('.page').removeClass('page-selected')
            getPage(index).addClass('page-selected')

            $('.attachment-details').show().attr('data-id', index)
            $('.attachment-details h2').text('Edit page ' + index)

            var thumb = getThumb(index)
            if (thumb) {
                $('.delete-page').show()
                $('.replace-page').show()
                $('#edit-page-img').show()
                setEditingPageThumb(thumb)
            } else {
                $('.delete-page').hide()
                $('.replace-page').hide()
                $('#edit-page-img').hide()
            }

            setEditingPageTitle(getTitle(index))
            setEditingPageHtmlContent(unescape(getHtmlContent(index)))

        }

        function setEditingPageIndex(index) {
            $('.attachment-details').attr('data-id', index)
        }

        function getEditingPageIndex() {
            return $('.attachment-details').attr('data-id')
        }

        function setEditingPageTitle(title) {
            $('#edit-page-title').val(title)
        }

        function getEditingPageTitle() {
            return $('#edit-page-title').val()
        }

        function setEditingPageSrc(val) {
            $('#edit-page-src').val(val)
        }

        function getEditingPageSrc() {
            return $('#edit-page-src').val()
        }

        function setEditingPageThumb(val) {
            $('#edit-page-thumb').val(val)
            $('#edit-page-img').attr('src', val)
        }

        function getEditingPageThumb() {
            return $('#edit-page-thumb').val()
        }

        function setEditingPageHtmlContent(htmlContent) {
            $('#edit-page-html-content').val(htmlContent)
        }

        function getEditingPageHtmlContent() {
            return $('#edit-page-html-content').val()
        }

        function getPage(index) {
            return $('#pages-container li[id="' + index + '"]')
        }

        function getTitle(index) {
            return getPage(index).find('#page-title').val()
        }

        function setTitle(index, val) {
            getPage(index).find('#page-title').val(val)
        }

        function getSrc(index) {
            return getPage(index).find('#page-src').val()
        }

        function setSrc(index, val) {
            getPage(index).find('#page-src').val(val)
        }

        function getThumb(index) {
            return getPage(index).find('#page-thumb').val()
        }

        function setThumb(index, val) {
            getPage(index).find('#page-thumb').val(val)
            // getPage(index).find('.page-img').find('img').attr('src', val)
            getPage(index).find('.page-img').css('background', 'url("' + val + '")')
        }

        function getHtmlContent(index) {
            return getPage(index).find('.html-content-hidden').val()
        }

        function setHtmlContent(index, val) {
            getPage(index).find('.html-content-hidden').val(val)
        }

        $('#edit-page-title').bind('change keyup paste', function() {

            var dataId = $(this).parent().parent().attr('data-id')
            setTitle(dataId, $(this).val())

        })

        $('#edit-page-html-content').bind('change keyup paste', function() {

            var dataId = $(this).parent().parent().attr('data-id')
            setHtmlContent(dataId, escape($(this).val()))

        })

        function loadPageFromPdf(pdf, pageIndex) {

            if (!pdf.pageScale) {
                pdf.getPage(1).then(function(page) {
                    var v = page.getViewport(1)

                    //pdf.pageScale = v.width > v.height ? 2048/v.width : 2048/v.height 
                    pdf.pageScale = v.height / 150
                    pdf.thumbScale = v.height / 150

                    createEmptyPages(pdf)

                    var lightboxThumbnailUrl = $("input[name='lightboxThumbnailUrl']").attr('value')
                    if (lightboxThumbnailUrl == "") {
                        generateLightboxThumbnail(page)
                    }

                    loadPageFromPdf(pdf, pageIndex)

                })
                return
            }

            pdf.getPage(creatingPage).then(function getPage(page) {

                var pagesContainer = $("#pages-container");

                renderPdfPage(page, function(canvas) {

                    // var pagesCount = pagesContainer.find(".page").length;
                    // var currentPage = pagesCount + 1;
                    // var title = options.pages && options.pages[currentPage - 1] ? options.pages[currentPage - 1].title : ''
                    // var htmlContent = options.pages && options.pages[currentPage - 1] ? options.pages[currentPage - 1].htmlContent : ''

                    // var pageItem = createPageHtml("pages[" + pagesCount + "]", currentPage, title, "", "", htmlContent);
                    var pageItem = $("#pages-container").find("#" + creatingPage)
                    // debugger

                    // console.log(pageItem[0])
                    pageItem.find('.page-img').empty().append($(canvas))

                    pageItem.find('.page-img').width($(canvas).width())

                    // pageItem.appendTo(pagesContainer).click(function(e) {
                    //     expandPage($(this).attr("id"))
                    // })

                    if (creatingPage < pdf.pdfInfo.numPages) {
                        creatingPage++
                        loadPageFromPdf(pdf)
                    }
                })

            })
        }

        function createEmptyPages(pdf) {
            var numPages = pdf.pdfInfo.numPages
            var pagesContainer = $("#pages-container");

            pdf.getPage(1).then(function(page) {
                var v = page.getViewport(1)

                for (var i = 1; i <= numPages; i++) {
                    var title = options.pages && options.pages[i - 1] ? options.pages[i - 1].title : ''
                    var htmlContent = options.pages && options.pages[i - 1] ? options.pages[i - 1].htmlContent : ''
                    var pageItem = createPageHtml("pages[" + (i - 1) + "]", i, title, "", "", htmlContent);
                    pageItem.find('.page-img').css('width', 80 * v.width / v.height + 'px')
                    pageItem.find('.page-img').empty()
                    pageItem.appendTo(pagesContainer).click(function(e) {
                        expandPage($(this).attr("id"))
                    })

                }

            })

        }

    });
})(jQuery);

function stripslashes(str) {
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +      fixed by: Mick@el
    // +   improved by: marrtins
    // +   bugfixed by: Onno Marsman
    // +   improved by: rezna
    // +   input by: Rick Waldron
    // +   reimplemented by: Brett Zamir (http://brett-zamir.me)
    // +   input by: Brant Messenger (http://www.brantmessenger.com/)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: stripslashes('Kevin\'s code');
    // *     returns 1: "Kevin's code"
    // *     example 2: stripslashes('Kevin\\\'s code');
    // *     returns 2: "Kevin\'s code"
    return (str + '').replace(/\\(.?)/g, function(s, n1) {
        switch (n1) {
            case '\\':
                return '\\';
            case '0':
                return '\u0000';
            case '':
                return '';
            default:
                return n1;
        }
    });
}