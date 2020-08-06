Vue.component('spritePalette', {
    template: '#sprite-palette-template',
    props: ['sprites', 'clickfn'],
    data: function(){
        return{
        }
    },
    computed:{
        spriteRows: function(){
            var rowLength = 6;
            var currentRow = [];
            var rows = [];
            for(var i = 0; i < this.sprites.length; i++){
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

var colorPickerComponent = VueColor.Sketch;
colorPickerComponent.props['preserveColor'] = {}; 
colorPickerComponent.destroyed = function(){ this.preserveColor(); };

var chromePickerComponent = VueColor.Chrome;
chromePickerComponent.props['preserveColor'] = {}; 
chromePickerComponent.destroyed = function(){ this.preserveColor(); };


var app = new Vue({
    el: '#app',
    data:{
        sprites: sprites,
        input: '',
        preview: '',
        previewFull: '',
        styleTags: ['b', 'i', 's', 'u', 'sub', 'sup', 'mark'],
        color: '#FF0000',
        swatches: ['#F00','#F90','#FF0','#0F0','#00F','#800080','#FFF','#000','#9EF','#A20','#FFE','#FBF','#2B9','#FD7','#840'],
        menuStates: {
            'none': 0, 
            'dropdownSprites': 1, 
            'modalSprites': 2, 
            'dropdownColors': 3, 
            'modalColors': 4,
            'modalHelp': 5,
        },
        menuState: 0,
    },
    components:{
        'sketch-picker': colorPickerComponent,
        'chrome-picker': chromePickerComponent,
    },
    methods:{
        clickSprite: function(sprite){
            var inputElement = document.getElementById('input-text-area');
            var caretIndex = inputElement.selectionStart;
            var spriteText = '';
            if(sprite.id !== ''){
                spriteText = `<sprite=${sprite.id}>`;
            }
            else{
                spriteText = `<sprite name=${sprite.name}>`
            }
            this.input = this.input.slice(0, caretIndex) + spriteText + this.input.slice(caretIndex);
            inputElement.focus();
            setTimeout(function(){
                inputElement.selectionEnd = caretIndex + spriteText.length;
            }, 0);
        },
        clickApplyTypographyStyle: function(tag){
            var inputElement = document.getElementById('input-text-area');
            var tagText = `<${tag}>`;

            var selectionStart = inputElement.selectionStart;
            var selectionEnd = inputElement.selectionEnd;

            if(selectionStart === selectionEnd){
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);
                inputElement.focus();
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionStart + tagText.length;
                }, 0);
            }
            else{
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);                
                var tagTextEnd = `</${tag}>`
                this.input = this.input.slice(0, selectionEnd + tagText.length) + tagTextEnd + this.input.slice(selectionEnd + tagText.length);
                inputElement.focus();
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionEnd + tagText.length;
                }, 0);
            }
        },
        clickAddColor: function(short){
            var color = this.$refs.colorPicker.val;
            var hexA = Math.round(255 * color.a).toString(16);
            if(hexA.length === 1){
                hexA = '0' + hexA;
            }
            var resultColor = '';
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

            this.color = resultColor;
            var tagText = `<${resultColor}>`;

            var inputElement = document.getElementById('input-text-area');
            var selectionStart = inputElement.selectionStart;
            var selectionEnd = inputElement.selectionEnd;

            if(selectionStart === selectionEnd){
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);
                inputElement.focus();
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionStart + tagText.length;
                }, 0);
            }
            else{
                this.input = this.input.slice(0, selectionStart) + tagText + this.input.slice(selectionStart);                
                var tagTextEnd = `</color>`
                this.input = this.input.slice(0, selectionEnd + tagText.length) + tagTextEnd + this.input.slice(selectionEnd + tagText.length);
                inputElement.focus();
                setTimeout(function(){
                    inputElement.selectionStart = selectionStart + tagText.length;
                    inputElement.selectionEnd = selectionEnd + tagText.length;
                }, 0);
            }
        },        
        checkTag: function(tagStr){
            if(/<sprite(=\d+)?( name="?[a-zA-Z]+"?)?>/.test(tagStr)){
                var nameIndex = tagStr.indexOf('name=');
                var sprite;
                if(nameIndex === -1){
                    var id = tagStr.substr(8).replace('>', '');
                    if(id !== ''){
                        sprite = this.sprites.find(s => s.id == id);
                    }              
                }
                else{
                    var name = tagStr.slice(nameIndex+5).replace('>', '').replace(/"/g, '');                
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
                var match = tagStr.match(/[\dA-Za-z]+/)[0];
                if(match.length === 3 || match.length === 4 || match.length === 6 || match.length === 8){
                    var color = '#';
                    for(var i = 0; i < match.length; i++){
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
        plainTextTagTemplate: function(text, styles){
            text = text.replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;');
            text = `<span>${text}</span>`;
            if(styles){
                var orderedStyles = styles.slice().reverse();
                for(style of orderedStyles){                    
                    if(style.type === 'color'){
                        text = `<em style="color: ${style.color}">${text}</em>`;
                    }
                    else{
                        text = `<${style.html}>${text}</${style.html}>`;
                    }
                }
            }
            return text; 
        },
        spriteImageTagTemplate: function(imageRef, styles){
            var style = ''
            if(styles){
                var colorStyle = styles.slice().reverse().find(s => s.type === 'color');
                if(colorStyle !== undefined){
                    style = `style="-webkit-filter: opacity(.5) drop-shadow(0 0 0 ${colorStyle.color});filter: opacity(.5) drop-shadow(0 0 0 ${colorStyle.color})"`;
                }
            }
            return `<img src="${imageRef}" ${style} width="50" height="50" class="mx-1">`;
        },     
        parseInput: function(input){
            var resultHtml = '';
            var isTag = false;
            var tag = '';
            var plainText = '';
            var styles = [];

            for(var i = 0; i < input.length; i++){
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
                        var tagObj = this.checkTag(tag);
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
                            var reverseStyles = styles.slice().reverse();
                            var index = reverseStyles.findIndex(s => s.html === tagObj.html);
                            if(index !== -1){
                                var trueIndex = styles.length - 1 - index;
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

            return `<span>${resultHtml}</span>`;
        },
        toggleMenu(menuState){
            this.menuState === menuState ? this.menuState = this.menuStates.none : this.menuState = menuState;
        },
        preserveColor: function(){         
            var color = this.$refs.colorPicker;
            if(color !== undefined){
                this.color = color.val.hex8;
            }
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
    },
    watch:{
        input: function(){
            this.preview = this.parseInput(this.input.slice(0, 50));
            this.previewFull = this.parseInput(this.input)
        }
    },
    mounted: function(){
        var app = this;
        document.onkeyup = function(e){

        };
        document.onclick = function(e){
            if(!e.target.matches('.dropdown-button') && 
                e.target.closest('.menu-color-picker') === null && 
                !e.target.matches('.add-color-button-wrapper') &&
                !e.target.matches('.modal-button') &&
                !e.target.matches('.help-button')){
                app.menuState = app.menuStates.none;
            }
        }
    }
});