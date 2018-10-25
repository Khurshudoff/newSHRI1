// import _ from 'lodash';
import './style.css';
import './style.sass';
import 'hamburgers/dist/hamburgers.css'

var json = require('./events.json');
var events = json.events;

import $ from "jquery";
const Hls = require('hls.js');


const hamb = document.getElementsByClassName('hamburger')[0];
hamb.addEventListener('click', function(){
    hamb.classList.toggle('is-active');
    
    const menuItem = document.getElementsByClassName('menu')[0] && document.getElementsByClassName('menu')[0];

    if(hamb.classList.contains('is-active')){
        menuItem && menuItem.setAttribute('style', 'display: block')
    } else {
        menuItem && menuItem.setAttribute('style', 'display: none')
    }
});


function importAll(r : any) {
    let images : any = {};
    r.keys().map((item : any, index : any) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('./images', false, /\.(pdf|png|jpe?g|svg)$/));

interface dataObject extends Object {
    type?: string
    values?: any
    temperature?: Number
    humidity?: Number
    albumcover?: string 
    artist?: string
    track?: any
    volume?: Number
    buttons?: Array<string>
    image?: string
}

interface eventObject extends Object {
    type : string
    size : string
    title: string
    source: string 
    time: string
    description: string
    icon: string
    data?: dataObject

}

function parser() {
    const card_wrapper = document.getElementsByClassName('card_wrapper')[0];
    events.forEach(function(event : eventObject){
        let card = document.createElement('div');

        card.classList.add('card');
        card.classList.add(event.size);
        if(event.type === 'critical')
            card.classList.add('critical');

        card.innerHTML += '<a class="card_close_img" href="#">' +
            '<img src="images/close_img.svg" alt="close_img">' +
            '</a>\n';

        // card_top

        let card_top = document.createElement('div');

        card_top.classList.add('card_top-info');

        card_top.innerHTML += '<img src="images/' +
            event.icon +
            '.svg" alt="card_logo" class="card_logo">';

        card_top.innerHTML += '<h3 class="card_title"><span>' +
            event.title +
            '</span></h3>';

        card_top.innerHTML += '<span class="card_source">' +
            event.source +
            '</span>';

        card_top.innerHTML += '<span class="card_time">' +
            event.time +
            '</span>\n';

        card.appendChild(card_top);

        // card_data

        let card_data = document.createElement('div');
        card_data.classList.add('card_data');

        if(event.description != null){
            card_data.innerHTML += '<span class="card_desription">' +
                event.description +
                '</span>'
        }
        if(event.data != null){
            // first image
            if(event.data.type != null){
                if(event.data.type === 'graph'){
                    card_data.innerHTML += '<img class="card_img" src="images/grafik.png" alt="grafik">\n'
                }
            }

            // temp and wetness
            if(event.data.temperature != null) {
                card_data.innerHTML += '<div><span class="card_data_temp">\n' +
                    'Температура: <span class="bold">' +
                    event.data.temperature +
                    'C</span>\n' +
                    '</span>' +
                    '<span class="card_data_wetness">\n' +
                    'Влажность: <span class="bold">' +
                    event.data.humidity +
                    '%</span>\n' +
                    '</span></div>'
            }

            // image
            if(event.data.image != null){
                card_data.innerHTML += '<img class="card_img" src="images/image.jpg" alt="pylesos">' +
                    '<span class="zoom">Приближение: 78%</span><span class="brightness">Яркость: 58%</span>'
            }

            //buttons
            if(event.data.buttons != null){
                card_data.innerHTML += '<div class="card_data_button-block">\n' +
                    '                    <button class="card_data_button">\n' +
                    event.data.buttons[0] +
                    '                    </button>\n' +
                    '                    <button class="card_data_button">\n' +
                    event.data.buttons[1] +
                    '                    </button>\n' +
                    '                </div>'
            }

            //music
            if(event.data.albumcover != null){

                const card_data_music = document.createElement('div');
                card_data_music.classList.add('card_data_music');

                card_data_music.innerHTML += '<img class="card_data_albumcover" src="' +
                    event.data.albumcover +
                    '" alt="asd">\n';

                card_data_music.innerHTML += '<span class="card_data_artist">\n' +
                    event.data.artist +
                    ' -\n <span class="card_data_track_name">' +
                    event.data.track.name +
                    '</span>\n </span>';

                card_data_music.innerHTML += '<input class="card_data_track_input" type="range" name="length" min="0" max="' +
                    (parseInt(event.data.track.length[0]) + parseInt(event.data.track.length[2]+event.data.track.length[3])) +
                    '">\n <span class="card_data_track_time">' +
                    event.data.track.length +
                    '</span>';

                card_data_music.innerHTML += '<div class="card_data_controls">\n' +
                    '                        <span class="prev"><img src="images/Prev.svg" alt="prev_button"></span>\n' +
                    '                        <span class="next"><img src="images/Prev.svg" alt="next_button"></span>\n' +
                    '                    </div>';

                card_data_music.innerHTML += '<input class="card_data_volume" type="range" name="length" min="0" max="100">\n' +
                    '                    <span class="card_data_volume-perc">' +
                    event.data.volume +
                    '%</span>'

                card_data.appendChild(card_data_music);
            }
        }

        if(card_data.innerHTML !== ''){
            card.appendChild(card_data);
        }

        card.innerHTML += '<a class="card_open_img" href="#"><img src="images/right_arrow.svg" alt="open_img"></a>\n';

        card_wrapper.appendChild(card)
    })
}

parser();

const nav_items : Array<JQuery> = [$('#nav_events'), $('#nav_summary'), $('#nav_devices'), $('#nav_scripts'), $('#nav_video')];
const video_items = [$('#video-1'), $('#video-2'), $('#video-3'), $('#video-4')];

$('#nav_video').on('click', function(event : Event){
    event.preventDefault();

    nav_items.forEach((elem) => {
        elem.removeClass('active');
    });
    $('#nav_video').addClass('active');

    $('#events_block').css('display', 'none');
    $('#video_block').css('display', 'grid');
});

$('#nav_events').on('click', function(event : Event){
    event.preventDefault();

    nav_items.forEach((elem) => {
        elem.removeClass('active');
    });
    $('#nav_events').addClass('active');

    $('#video_block').css('display', 'none');
    $('#events_block').css('display', 'block');

    console.log('asd');
});

let audioContextArray : any = {}
let mediaSourceDict: any = {};

function initVideo(video : HTMLVideoElement , url : String) {
    if (Hls.isSupported()) {

        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play();
        });

        const myWindow : any = window

        const AudioContext = new (myWindow.AudioContext || myWindow.webkitAudioContext)();

        audioContextArray[video.id] = AudioContext;

        if (AudioContext) {
            const source = AudioContext.createMediaElementSource(video);

            mediaSourceDict[video.id] = source;

        }

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        video.addEventListener('loadedmetadata', function () {
            video.play();
        });
    }
}

initVideo(
    document.getElementById('video-1') as HTMLVideoElement,
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
);

initVideo(
    document.getElementById('video-2') as HTMLVideoElement,
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
);

initVideo(
    document.getElementById('video-3') as HTMLVideoElement,
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
);

initVideo(
    document.getElementById('video-4') as HTMLVideoElement,
    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
);

function zoomOnClick(event :  any){
    if(event.target.style.transform.split(',')[0].split('(')[1] !== '2'){

        $(event.target).prop('muted', false);

        video_items.forEach(video => {
            video.css('pointer-events', 'none');
            video.css('opacity', '0');
        });

        event.target.style.pointerEvents = 'auto';
        event.target.style.opacity = '1';

        if((event.target.getBoundingClientRect().left - $('#video_block').offset()!.left) > 100 && event.target.offsetTop > 100 ){
            event.target.style.transform = 'matrix(2,0,0,2,' +
                - event.target.getBoundingClientRect().width / 2 + ',' +
                - event.target.getBoundingClientRect().height / 2 + ')';

        } else if((event.target.getBoundingClientRect().left - $('#video_block').offset()!.left) > 100 && event.target.offsetTop < 100 ){
            event.target.style.transform = 'matrix(2,0,0,2,' +
                - event.target.getBoundingClientRect().width / 2 + ',' +
                + event.target.getBoundingClientRect().height / 2 + ')';

        } else if((event.target.getBoundingClientRect().left - $('#video_block').offset()!.left) < 100 && event.target.offsetTop > 100 ){
            event.target.style.transform = 'matrix(2,0,0,2,' +
                + event.target.getBoundingClientRect().width / 2 + ',' +
                - event.target.getBoundingClientRect().height / 2 + ')';

        } else if((event.target.getBoundingClientRect().left - $('#video_block').offset()!.left) < 100 && event.target.offsetTop < 100 ){
            event.target.style.transform = 'matrix(2,0,0,2,' +
                + event.target.getBoundingClientRect().width / 2 + ',' +
                + event.target.getBoundingClientRect().height / 2 + ')';

        }

        const AudioContext = audioContextArray[event.target.id];

        if (AudioContext) {
            const analyser = AudioContext.createAnalyser();

            const source =  mediaSourceDict[event.target.id];
            const gainNode = AudioContext.createGain();

            source.connect(analyser);

            analyser.fftSize = 32;
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);

            source.connect(gainNode);
            gainNode.connect(AudioContext.destination);

            // Get a canvas defined with ID "oscilloscope"
            const canvas = document.getElementById("oscilloscope") as HTMLCanvasElement;
            canvas.style.display = 'block';
            const canvasCtx = canvas.getContext("2d");

            function draw() {

                requestAnimationFrame(draw);

                analyser.getByteFrequencyData(dataArray);

                const volume = Math.max(...dataArray)/256;

                canvasCtx!.fillStyle = "rgb(200, 200, 200)";
                canvasCtx!.fillRect(0, 0, canvas.width, canvas.height);

                canvasCtx!.lineWidth = 50;
                canvasCtx!.strokeStyle = "rgb(0, 0, 0)";

                canvasCtx!.beginPath();

                const sliceWidth = canvas.width * 1.0 / bufferLength;
                let x = 0;

                canvasCtx!.moveTo(canvas.width / 2, canvas.height);

                canvasCtx!.lineTo(canvas.width / 2, canvas.height - canvas.height * volume);

                canvasCtx!.stroke();
            }

            draw();
        } else {
            alert('Ваш браузер не поддерживает Web Audio API');
        }
    }
}

$('#all_cameras_button').on('click', function(){
    video_items.forEach(video => {
        video.css('transform', 'none');
        video.css('pointer-events', 'auto');
        video.css('opacity', '1');
        video.prop('muted', true);
        document.getElementById("oscilloscope")!.style.display = 'none'
    })
});

video_items.forEach(item => {
    item.on('click', zoomOnClick);
});

$("#video1_controls").find(".brightness").on('input', function(){
    $("#video1_controls").find('.brightness_value').text($(this).val() as string);

    const brightness =  $("#video1_controls").find('.brightness_value').text();
    const contrast = $("#video1_controls").find('.contrast_value').text();

    $("#video-1").css('filter', 'brightness(' + brightness + ') ' +
                                'contrast(' + contrast + ')');
});

$("#video1_controls").find(".contrast").on('input', function(){
    $("#video1_controls").find('.contrast_value').text($(this).val()  as string);

    const brightness =  $("#video1_controls").find('.brightness_value').text();
    const contrast = $("#video1_controls").find('.contrast_value').text();

    $("#video-1").css('filter', 'brightness(' + brightness + ') ' +
        'contrast(' + contrast + ')');
});

$("#video2_controls").find(".brightness").on('input', function(){
    $("#video2_controls").find('.brightness_value').text($(this).val()  as string);

    const brightness =  $("#video2_controls").find('.brightness_value').text();
    const contrast = $("#video2_controls").find('.contrast_value').text();

    $("#video-2").css('filter', 'brightness(' + brightness + ') ' +
        'contrast(' + contrast + ')');
});

$("#video2_controls").find(".contrast").on('input', function(){
    $("#video2_controls").find('.contrast_value').text($(this).val()  as string);

    const brightness =  $("#video2_controls").find('.brightness_value').text();
    const contrast = $("#video2_controls").find('.contrast_value').text();

    $("#video-2").css('filter', 'brightness(' + brightness + ') ' +
        'contrast(' + contrast + ')');
});

$("#video3_controls").find(".brightness").on('input', function(){
    $("#video3_controls").find('.brightness_value').text($(this).val()  as string);

    const brightness =  $("#video3_controls").find('.brightness_value').text();
    const contrast = $("#video3_controls").find('.contrast_value').text();

    $("#video-3").css('filter', 'brightness(' + brightness + ') ' +
        'contrast(' + contrast + ')');
});

$("#video3_controls").find(".contrast").on('input', function(){
    $("#video3_controls").find('.contrast_value').text($(this).val() as string);

    const brightness =  $("#video3_controls").find('.brightness_value').text();
    const contrast = $("#video3_controls").find('.contrast_value').text();

    $("#video-3").css('filter', 'brightness(' + brightness + ') ' +
        'contrast(' + contrast + ')');
});

$("#video4_controls").find(".brightness").on('input', function(){
    $("#video4_controls").find('.brightness_value').text($(this).val() as string);

    const brightness =  $("#video4_controls").find('.brightness_value').text();
    const contrast = $("#video4_controls").find('.contrast_value').text();

    $("#video-4").css('filter', 'brightness(' + brightness + ') ' +
        'contrast(' + contrast + ')');
});

$("#video4_controls").find(".contrast").on('input', function(){
    $("#video4_controls").find('.contrast_value').text($(this).val() as string);

    const brightness =  $("#video4_controls").find('.brightness_value').text();
    const contrast = $("#video4_controls").find('.contrast_value').text();

    $("#video-4").css('filter', 'brightness(' + brightness + ') ' +
        'contrast(' + contrast + ')');
});