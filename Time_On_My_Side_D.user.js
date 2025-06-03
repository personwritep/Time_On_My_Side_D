// ==UserScript==
// @name        Time On My Side D
// @namespace        http://tampermonkey.net/
// @version        1.1
// @description        HOME・編集画面のデジタル時刻表示
// @author        Ameba Blog User
// @match        https://www.ameba.jp/home
// @match        https://blog.ameba.jp/ucs/entry/srventry*
// @exclude        https://blog.ameba.jp/ucs/entry/srventrylist.do*
// @exclude        https://blog.ameba.jp/ucs/entry/srventryinsertend.do
// @exclude        https://blog.ameba.jp/ucs/entry/srventryupdateend.do
// @exclude        https://blog.ameba.jp/ucs/entry/srventryinsertdraft.do
// @exclude        https://blog.ameba.jp/ucs/entry/srventryupdatedraft.do
// @exclude        https://blog.ameba.jp/ucs/entry/srventryouterpreview.do
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @noframes
// @grant        none
// @updateURL        https://github.com/personwritep/Time_On_My_Side/raw/main/Time_On_My_Side_D.user.js
// @downloadURL        https://github.com/personwritep/Time_On_My_Side/raw/main/Time_On_My_Side_D.user.js
// ==/UserScript==


main();

function main(){
    let w_type=0; // 配置タイプ
    let w_size=0;
    let x_p=0;
    let y_p=0;


    let w_cookie_type=get_cookie('time_d_type');
    if(w_cookie_type){ // Cookieの更新
        w_type=w_cookie_type;
        document.cookie='time_d_type='+w_type+'; Max-Age=2592000'; }


    let w_cookie_pos=get_cookie('time_d_pos');
    if(w_cookie_pos!=0 && w_cookie_pos.split(':')[0]){
        x_p=w_cookie_pos.split(':')[0]; }
    if(w_cookie_pos!=0 && w_cookie_pos.split(':')[1]){
        y_p=w_cookie_pos.split(':')[1]; }
    if(x_p!=0 && y_p!=0){ // Cookieの更新
        if(w_type==0 && y_p<0){
            y_p=0; }
        if(w_type==1 && y_p<30){
            y_p=30; }
        document.cookie='time_d_pos='+x_p+':'+y_p+'; Max-Age=2592000'; }


    let w_cookie_siz=get_cookie('time_d_siz');
    if(w_cookie_siz){ // Cookieの更新
        w_size=w_cookie_siz;
        document.cookie='time_d_siz='+w_size+'; Max-Age=2592000'; }



    let wd_inner=
        '<span id="w_icon"></span>'+
        '<span id="time_disp"></span>'+
        '<style>'+
        '#d_watch { position: fixed; z-index: 10; '+
        'font: bold 16px Meiryo; color: #0292a5; background: #fff; '+
        'height: 27px; padding: 1px 0 0 6px; box-sizing: border-box; '+
        'border: 1px solid #ccc; border-radius: 3px; width: 240px; } '+
        '#w_icon { display: inline-block; width: 28px; vertical-align: 1px; }';

    let base=document.querySelector('body');
    let watch=document.createElement('div');
    watch.setAttribute('id', 'd_watch');
    watch.style.left='calc(50% - '+x_p+'px)';
    watch.setAttribute('draggable', 'true');
    watch.innerHTML=wd_inner;
    if(!base.querySelector('#d_watch')){
        base.appendChild(watch); }

    let w_icon=document.querySelector('#w_icon');
    if(w_type==0){
        watch.style.top=y_p+'px';
        w_icon.textContent='⏰'; }
    else if(w_type==1){
        watch.style.top='calc(100vh - '+y_p+'px)';
        w_icon.textContent='⏱'; }

    let time_d=setInterval(disp_watch, 1000);

    function disp_watch(){
        let d_watch=document.querySelector('#d_watch');
        let time_disp=document.querySelector('#time_disp');
        let now=new Date();
        get_d(now);

        function get_d(time){
            let Year=time.getFullYear();
            let Month=getdouble(time.getMonth()+1);
            let Date=getdouble(time.getDate());
            let Hour=getdouble(time.getHours());
            let Min=getdouble(time.getMinutes());
            let Sec =getdouble(time.getSeconds());

            function getdouble(number){
                return ("0" + number).slice(-2); }

            if(w_size==0){
                d_watch.style.width='240px';
                time_disp.innerHTML=
                    Year+"."+Month+"."+Date+"　"+Hour+":"+Min+":"+Sec; }
            else if(w_size==1){
                d_watch.style.width='190px';
                time_disp.innerHTML=
                    Month+"."+Date+"　"+Hour+":"+Min+":"+Sec; }
            else if(w_size==2){
                d_watch.style.width='122px';
                time_disp.innerHTML=
                    Hour+":"+Min+":"+Sec; }}}


    w_icon.onclick=function(event){
        event.stopImmediatePropagation();
        drage=0;
        if(event.ctrlKey){
            let x=event.clientX-shiftX;
            let y=event.clientY-shiftY;
            if(w_type==0){
                w_type=1;
                let ch=window.innerHeight;
                y=ch-y;
                d_watch.style.top='calc(100vh - '+ y+'px)';
                w_icon.textContent='⏱'; }
            else{
                w_type=0;
                d_watch.style.top=y+'px';
                w_icon.textContent='⏰'; }
            document.cookie=
                'time_d_pos='+(document.body.offsetWidth/2-x)+':'+y+'; Max-Age=2592000';
            document.cookie='time_d_type='+w_type+'; Max-Age=2592000'; }
        else{
            if(w_size==0){
                w_size=1; }
            else if(w_size==1){
                w_size=2; }
            else if(w_size==2){
                w_size=0; }
            document.cookie='time_d_siz='+w_size+'; Max-Age=2592000'; }}


    let target=document.querySelector('body'); // 監視 target
    let monitor=new MutationObserver(hide);
    monitor.observe(target, {childList: true});

    function hide(){
        let js_container=document.querySelector('#js-container');
        if(js_container){
            let d_watch=document.querySelector('#d_watch');
            if(js_container.classList.contains('is-invisible--absolute')==true){
                d_watch.style.display='none'; }
            else{
                d_watch.style.display='block'; }}}


    let d_watch=document.querySelector('#d_watch');
    let drage=0; // ドラッグ処理中の管理
    let shiftX; // ホールド箇所による位置ズレ補正
    let shiftY; // ホールド箇所による位置ズレ補正


    d_watch.onmousedown=function(event){
        drage=1;
        shiftX=event.clientX-d_watch.getBoundingClientRect().left;
        shiftY=event.clientY-d_watch.getBoundingClientRect().top; }

    d_watch.onmouseup=function(event){
        drage=0; }

    let body_area=document.querySelector('body');
    body_area.ondragover=function(){ return false; } // HOMEでドラッグ可能にする

    document.addEventListener("drop", function(event){
        event.preventDefault();
        toMove(event); }, false); // ドロップ時に位置を取得して配置修正

    function toMove(event){
        if(drage==1){
            drage=0;
            let x=event.clientX-shiftX;
            let y=event.clientY-shiftY;
            if(w_type==0){
                d_watch.style.top=y+'px'; }
            if(w_type==1){
                let ch=window.innerHeight;
                y=ch-y;
                d_watch.style.top='calc(100vh - '+ y+'px)'; }
            d_watch.style.left='calc(50% - '+(document.body.offsetWidth/2-x)+'px)';
            document.cookie=
                'time_d_pos='+(document.body.offsetWidth/2-x)+':'+y+'; Max-Age=2592000'; }}


    function get_cookie(name){
        let cookie_req=document.cookie.split('; ').find(row=>row.startsWith(name));
        if(cookie_req){
            if(cookie_req.split('=')[1]==null){
                return 0; }
            else{
                return cookie_req.split('=')[1]; }}
        if(!cookie_req){
            return 0; }}

} // main()
