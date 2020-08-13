// Sprite palette component
// props:
// sprites - array of sprites (in data.js)
// clickfn - callback function on sprite button click
// computed:
// spriteRows - arranges sprites in rows and returns array of rows of sprites, representing rows on palette
Vue.component('spritePalette', {
    template: '#sprite-palette-template',
    props: ['sprites', 'clickfn'],
    data: function(){
        return{
        }
    },
    computed:{
        spriteRows: function(){
            let rowLength = 6;
            let currentRow = [];
            let rows = [];
            for(let i = 0; i < this.sprites.length; i++){
                if(i > 0 && i % rowLength === 0){
                    rows.push(currentRow);
                    currentRow = [];
                }
                currentRow.push(this.sprites[i]);                
            }
            if(currentRow.length > 0){
                rows.push(currentRow);
            }
            return rows;
        },
    }
});

let colorPickerComponent = VueColor.Sketch;
let chromePickerComponent = VueColor.Chrome;

new Vue({
    el: '#app',
    data:{
        // array of sprites (from data.js)
        sprites: sprites,
        // user input, model of #input-text-area
        input: '',
        // preview html
        preview: '',
        // full preview html
        previewFull: '',
        // default color of single color picker
        color: {
            hex: '#FF0000',
            rgba: { r: 255, g: 0, b: 0, a: 1 },
            a: 1,
        },
        // preset colors for single color picker
        swatches: ['#F00','#F90','#FF0','#0F0','#00F','#800080','#FFF','#000','#9EF','#A20','#FFE','#FBF','#2B9','#FD7','#840', '#76D'],
        // menu states
        menuStates: {
            'none': 0, 
            'dropdownSprites': 1, 
            'modalSprites': 2, 
            'dropdownColors': 3, 
            'modalColors': 4,
            'modalHelp': 5,
            'dropdownGradient': 6,
            'modalGradient': 7,
        },
        // represents currently opened menu (dropdown or modal)
        menuState: 0,
        // default start color of gradient color picker
        gradientStart: {
            hex: '#FF0000',
            rgba: { r: 255, g: 0, b: 0, a: 1 },
            a: 1,
        },
        // default end color of gradient color picker
        gradientEnd: {
            hex: '#0000FF',
            rgba: { r: 0, g: 0, b: 255, a: 1 },
            a: 1,
        },
    },
    components:{
        'sketch-picker': colorPickerComponent,
        'chrome-picker': chromePickerComponent,
    },
    methods:{
        // callback function on sprite button click
        clickSprite: function(sprite){
            let inputElement = document.getElementById('input-text-area');
            let caretIndex = inputElement.selectionStart;
            let spriteText = '';
            if(sprite.id !== ''){
                spriteText = `<sprite=${sprite.id}>`;
            }
            else{
                spriteText = `<sprite name=${sprite.name}>`
            }
            this.input = this.input.slice(0, caretIndex) + spriteText + this.input.slice(caretIndex);
            setTimeout(function(){
                inputElement.selectionEnd = caretIndex + spriteText.length;
            }, 0);
        },
        // callback function on typography format button click
        clickApplyTypographyStyle: function(tag){
            let inputElement = document.getElementById('input-text-area');
            let tagText = `<${tag}>`;

            let selectionStart = inputElement.selectionStart;
            let selectionEnd = inputElement.selectionEnd;

            if(selectionStart === selectionEnd){
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionStart + tagText.length;
                }, 0);
            }
            else{
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);                
                let tagTextEnd = `</${tag}>`
                this.input = this.input.slice(0, selectionEnd + tagText.length) + tagTextEnd + this.input.slice(selectionEnd + tagText.length);
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionEnd + tagText.length;
                }, 0);
            }
        },
        // callback function on add single color button click (short or full hex)
        clickAddColor: function(short){
            let color = this.color;
            let hexA = Math.round(255 * color.a).toString(16);
            if(hexA.length === 1){
                hexA = '0' + hexA;
            }
            let resultColor = '';
            if(short){
                resultColor = `#${Math.round(color.rgba.r / 17).toString(16)}${Math.round(color.rgba.g / 17).toString(16)}${Math.round(color.rgba.b / 17).toString(16)}`;
                if(color.a !== 1){
                    resultColor += Math.round(('0x' + hexA) / 17).toString(16);
                }
            }
            else{
                resultColor = color.hex;            
                if(color.a !== 1){
                    resultColor += hexA;
                }
            }

            let tagText = `<${resultColor}>`;

            let inputElement = document.getElementById('input-text-area');
            let selectionStart = inputElement.selectionStart;
            let selectionEnd = inputElement.selectionEnd;

            if(selectionStart === selectionEnd){
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionStart + tagText.length;
                }, 0);
            }
            else{
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);                
                let tagTextEnd = `</color>`
                this.input = this.input.slice(0, selectionEnd + tagText.length) + tagTextEnd + this.input.slice(selectionEnd + tagText.length);
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionEnd + tagText.length;
                }, 0);
            }
        },  
        // callback function on apply gradient button click  
        clickAddGradient: function(){            
            let inputElement = document.getElementById('input-text-area');
            let selectionStart = inputElement.selectionStart;
            let selectionEnd = inputElement.selectionEnd;
            let text = this.input.slice(selectionStart, selectionEnd);
            
            if(selectionStart === selectionEnd){
                text = this.input;
                selectionStart = 0;
                selectionEnd = text.length;
            }
            let removeTagsResult = this.removeTags(text);
            let textToColor = removeTagsResult.text.replace(/ /g, '');

            if(textToColor.length < 2){
                return;
            }
            let startColor = [this.gradientStart.rgba.r, this.gradientStart.rgba.g, this.gradientStart.rgba.b];
            let endColor = [this.gradientEnd.rgba.r, this.gradientEnd.rgba.g, this.gradientEnd.rgba.b];

            let colors = [];
            for(let i = 0; i < textToColor.length; i++){
                
                let currColor = [];
                for(let j = 0; j < 3; j ++){
                    currColor[j] = Math.round(startColor[j] + (i / (textToColor.length - 1)) * (endColor[j] - startColor[j]));                    
                }
                colors.push(`<${this.rgbToShortHex(currColor)}>`);
            }
            colors = colors.slice().reverse();

            let slices = removeTagsResult.slices;
            let coloredString = '';

            for(let i = 0; i < text.length; i++){
                let notColored = true;
                if(text[i] === ' '){
                    coloredString += text[i];
                    continue;
                }
                for(let j = 0; j < slices.length; j++){
                    if(i >= slices[j][0] && i < slices[j][1]){
                        coloredString += colors.pop() + text[i];
                        notColored = false;
                        break;
                    }
                }
                if(notColored){
                    coloredString += text[i];
                }
            }

            this.input = this.input.slice(0, selectionStart) + coloredString + this.input.slice(selectionEnd);
        }, 
        // removes valid tags (using 'checkTag' function) from text
        //
        // returns object {text, slices}
        // text - new string with all valid tags removes
        // slices - array of pairs of indexes, that indicate starts and ends of non tag text in original string 
        removeTags: function(text){
            let isTag = false;
            let tag = '';
            let slices = [];
            let start = 0;
            let end = 0;
            let result = '';
            for(let i = 0; i < text.length; i++){
                if(text[i] === '<'){
                    isTag = true;  
                    tag += text[i];
                    end = i;               
                }
                else if(text[i] === '>' && isTag){
                    tag += text[i];
                    isTag = false;
                    if(this.checkTag(tag).type !== 'plain'){
                        slices.push([start, end]);
                        start = i + 1;
                    }
                    tag = '';
                }
                else{
                    if(isTag){
                        tag += text[i];
                    }
                }
            }

            slices.push([start, text.length]);            

            for(slice of slices){
                result += text.slice(slice[0], slice[1]);
            }
            return {text: result, slices: slices};
        },
        // rgb - array of length 3, representing color in rgb
        //
        // returns short hex color string (#f00)
        rgbToShortHex: function (rgb){
            if(!rgb.push && rgb.length !== 0){
                return;
            }        
            let hex = '#';        
            for(let i = 0; i < rgb.length; i++){
                let res = Math.round(Number(rgb[i]) / 17).toString(16);                
                hex += res; 
            }        
            return hex;
        },
        // tagStr - string representing tag, found in input(<b>)
        //
        // returns object {type, html, color?}
        // type can be: plain, sprite, style, closing
        // html - html tag name, or tagStr if type is 'plain'
        // color - (optional) color, found in tag
        checkTag: function(tagStr){
            if(/<sprite(=\d+)?( name="?[a-zA-Z]+"?)?>/.test(tagStr)){
                let nameIndex = tagStr.indexOf('name=');
                let sprite;
                if(nameIndex === -1){
                    let id = tagStr.substr(8).replace('>', '');
                    if(id !== ''){
                        sprite = this.sprites.find(s => s.id == id);
                    }              
                }
                else{
                    let name = tagStr.slice(nameIndex+5).replace('>', '').replace(/"/g, '');
                    sprite = this.sprites.find(s => s.name === name);
                }
                if(sprite === undefined){
                    return { type: 'plain', html: tagStr };
                }
                else{
                    return { type: 'sprite', html: sprite.image };
                }
            }
            else if(/<(b|i|u|s|mark|sub|sup)( (?! )\S*)*>/.test(tagStr)){
                return { type: 'style', html: /sub|sup|b|i|u|s|mark/.exec(tagStr)[0] };
            }
            else if(/<\/(b|i|u|s|mark|sub|sup|a|color)( (?! )\S*)*>/.test(tagStr)){
                return { type: 'closing', html: /sub|sup|b|i|u|s|mark|color/.exec(tagStr)[0] };
            }
            else if(/<#.+>/.test(tagStr) ||
                    /<color="#.+">/.test(tagStr)){
                let match = tagStr.match(/[\dA-Za-z]+/)[0];
                if(match.length === 3 || match.length === 4 || match.length === 6 || match.length === 8){
                    let color = '#';
                    for(let i = 0; i < match.length; i++){
                        if(/[^\dA-Fa-f]/.test(match[i])){
                            color += 'F';
                        }
                        else{
                            color += match[i];
                        }
                    }
                    return {type: 'color', html: 'color', color: color};
                }
                return {type: 'plain', html: tagStr };
                
            }
            else if (/<color="?red|orange|black|white|green|yellow|purple|blue"?>/.test(tagStr)){
                return {type: 'color', html: 'color', color: /red|orange|black|white|green|yellow|purple|blue/.exec(tagStr)[0] };
            }
            else{
                return {type: 'plain', html: tagStr };
            }
        },
        // text - plaint text to convert to html to preview
        // styles - array of styles to apply to text
        //
        // returns html string of text with styles applied to it
        plainTextTagTemplate: function(text, styles){
            text = text.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;');
            if(styles){
                let orderedStyles = styles.slice().reverse();
                for(style of orderedStyles){                    
                    if(style.type === 'color'){
                        text = `<em style="color: ${style.color}">${text}</em>`;
                    }
                    else{
                        text = `<${style.html}>${text}</${style.html}>`;
                    }
                }
            }
            return `<div>${text}</div>`;
        },
        // imageRef - link to image
        // styles - array of styles to apply to sprite
        //
        // returns html string of sprite with styles applied to it
        spriteImageTagTemplate: function(imageRef, styles){
            let colorStyle = '';
            let textStyle = '';
            let marked = false;

            if(styles){
                let orderedStyles = styles;
                for (style of orderedStyles){
                    if(style.type === 'color'){
                        colorStyle = `-webkit-filter: opacity(.5) drop-shadow(0 0 0 ${style.color});
                                      filter: opacity(.5) drop-shadow(0 0 0 ${style.color});`;
                    }
                }

                if(orderedStyles.some(s => s.html === 'u')){
                    textStyle += `<div class="sprite-style-underlined">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>`;                    
                }  
                
                if(orderedStyles.some(s => s.html === 's')){
                    textStyle += `<div class="sprite-style-strike">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>`;                    
                }
                
                marked = orderedStyles.some(s => s.html === 'mark');                        
            }

            let scaleStyle = '';
            // not relevant, images do not scale in sub/sup tags
            // if(styles){
            //     let orderedStyles = styles.slice().reverse();
            //     let scaleString = ''
            //     for (style of orderedStyles){
            //         if(style.html === 'sub' || style.html === 'sup'){ 
            //             scaleString += ' * 0.75'
            //         }
            //     }
            //     if(scaleString !== ''){
            //         scaleStyle = `height:calc(50px${scaleString});width:calc(50px${scaleString});`
            //     }
            // }

            let imgHtml = `<img class="sprite-preview" src="${imageRef}" style="${colorStyle}${scaleStyle}" width="50" height="50">`;

            return `<div class="sprite-preview-wrapper d-flex ${marked ? 'sprite-preview-mark' : ''}" style="${scaleStyle}">${textStyle}${imgHtml}</div>`;
        }, 
        // parse input string, returns html string to preview  
        parseInput: function(input){
            let resultHtml = '';
            let isTag = false;
            let tag = '';
            let plainText = '';
            let styles = [];

            for(let i = 0; i < input.length; i++){
                if(input[i] === '<'){
                    if(isTag){
                        resultHtml += this.plainTextTagTemplate(tag, styles);
                        tag = '';
                    }
                    else if(plainText !== ''){
                        resultHtml += this.plainTextTagTemplate(plainText, styles);
                        plainText = '';
                    }

                    isTag = true;
                    tag += input[i];
                }   
                else if(input[i] === '>'){
                    if(isTag){
                        tag += input[i];
                        let tagObj = this.checkTag(tag);
                        if(tagObj.type === 'plain'){
                            resultHtml += this.plainTextTagTemplate(tagObj.html,styles);
                        }
                        else if (tagObj.type === 'sprite'){
                            resultHtml += this.spriteImageTagTemplate(tagObj.html, styles);
                        }
                        else if(tagObj.type === 'color'){
                            styles.push(tagObj);
                        }
                        else if(tagObj.type === 'closing'){ 
                            let reverseStyles = styles.slice().reverse();
                            let index = reverseStyles.findIndex(s => s.html === tagObj.html);
                            if(index !== -1){
                                let trueIndex = styles.length - 1 - index;
                                styles.splice(trueIndex, 1);
                            }
                        }
                        else if(tagObj.type === 'style'){
                            styles.push(tagObj);
                        }
                            
                        tag = ''
                        isTag = false;
                    }
                    else{
                        plainText += input[i];
                    }
                }   
                else{
                    if(isTag){
                        tag += input[i];
                    }
                    else{
                        plainText += input[i];
                    }
                }      
            }

            if(plainText != ''){
                resultHtml += this.plainTextTagTemplate(plainText, styles);
            }
            else if(tag != ''){
                resultHtml += this.plainTextTagTemplate(tag, styles);
            }

            return `<div class="d-flex align-items-center">${resultHtml}</div>`;
        },
        // opens menu
        toggleMenu(menuState){
            this.menuState === menuState ? this.menuState = this.menuStates.none : this.menuState = menuState;
        },
        // copy input to clipboard
        copyInput: function(){
            let input = document.getElementById("input-text-area");
            let selStart = input.selectionStart;
            let selEnd = input.selectionEnd;
            if(selStart !== selEnd){
                input.setSelectionRange(selStart, selEnd);
            }
            else{
                input.setSelectionRange(0, this.input.length);
            }
            input.focus();
            document.execCommand("copy");
            input.selectionStart = selStart;
            input.selectionEnd = selEnd;
            document.getElementById('clipboard-confirm').classList.add('show');
            setTimeout(function(){
                document.getElementById('clipboard-confirm').classList.remove('show');
            }, 2000);
        },
        dismissConfirm: function(){
            document.getElementById('clipboard-confirm').classList.remove('show');
        }
    },
    computed:{
        showDropdownSprites: function(){
            return this.menuState === this.menuStates.dropdownSprites;
        },
        showModalSprites: function(){
            return this.menuState === this.menuStates.modalSprites;
        },
        showDropdownColors: function(){
            return this.menuState === this.menuStates.dropdownColors;
        },
        showModalColors: function(){
            return this.menuState === this.menuStates.modalColors;
        },
        showModalHelp: function(){
            return this.menuState === this.menuStates.modalHelp;
        },
        showDropdownGradient: function(){
            return this.menuState === this.menuStates.dropdownGradient;
        },
        showModalGradient: function(){
            return this.menuState === this.menuStates.modalGradient;
        },
        spritesOrderByTitle: function(){
            return this.sprites.sort((a,b) => {
                if(a.title > b.title){
                    return 1;
                }
                if(a.title < b.title){
                    return -1;
                }
                return 0;                
            })
        }
    },
    watch:{
        input: function(){
            this.preview = this.parseInput(this.input.slice(0, 50));
            this.previewFull = this.parseInput(this.input)
        }
    },
    mounted: function(){
        let app = this;
        document.onkeyup = function(e){

        };
        document.onclick = function(e){
            if(!e.target.matches('.skip-menu-state') && 
                e.target.closest('.menu-color-picker') === null &&
                e.target.closest('.gradient-color-pickers') === null){
                app.menuState = app.menuStates.none;
            }
        }
    }
});