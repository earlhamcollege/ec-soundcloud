apos.define('ec-soundcloud-widgets', {
    extend: 'apostrophe-widgets',
    construct: function(self, options) {
        self.play = function ($widget, data, options) {
            $.get('/modules/ec-soundcloud-widgets/soundcloud?api_key='+data.api_key+'&client_id='+encodeURIComponent(data.api_user), async function (results) {

                // TRACK INFORMATION API CALL
                $.get("https://api.soundcloud.com/users/"+data.client_id+"/tracks?client_id="+encodeURIComponent(data.api_key) , async function (tracks_result) {
                    console.table(tracks_result);
                    $widget.find('#data-list').val('');
                    createTable(tracks_result, data); // render table
                    renderContent(tracks_result, data); // render content area

                    jQuery(document).ready(function($) {
                        if (window.history && window.history.pushState) {
                            $(window).on('popstate', function() {
                                renderContent(tracks_result,data);
                            });
                        }
                    });
                });

                // ACCOUNT INFORMATION API CALL
                $.get("http://api.soundcloud.com/users/"+data.client_id+"?client_id="+encodeURIComponent(data.api_key) , async function (account_result) {
                    $widget.find('#data-user').val('');
                    createHeader(account_result) // render header
                });
            }); 
            console.log('render complete');

            // Render the content area of the widget
            function renderContent(tracks, data){

                var location = window.location.href;

                if(!location.includes('?track')){
                    //no track in url
                    renderFeature(tracks, data);
                }else{
                    //track in url
                    renderFocus(tracks, data);
                }
            }
            // Render the option that NO specific track is selected, show recent episodes.
            function renderFeature(tracks, data){
                console.info('render feature tracks');

                var location = window.location.href;
                container = $widget.find('#data-content');
                container.empty();

                var feature_container = document.createElement("div");
                feature_container.id = 'feature-container';
                
                for(x = 0; x < data.feature_count; x++){
                    var feature = document.createElement("div");
                    feature.className = 'feature-block'
                    console.log(tracks);
                    console.log(tracks[x].id);
                    feature.onclick = function() { trackFocus(tracks[x].id, tracks, data)};
                    var img_url = tracks[x].artwork_url.replace('large','t300x300'); // get image

                    var desc = tracks[x].description; // get desc
                    var title = tracks[x].title; // get title
                    var date = tracks[x].created_at.split(" ")[0]; // get date
                    var time = tracks[x].created_at.split(" ")[1]; // get time
                    var img_div = document.createElement('div');
                    img_div.style.backgroundImage = "url('"+ img_url +"')"; 
                    img_div.className = "img_div";  
                    feature.append(img_div); // append complete image obj

                    time_ls = time.split(':');

                    img_div.innerHTML = '<i class="fa fa-play-circle"></i>';

                    var text_div = document.createElement('div'); // make description
                    var desc_text = document.createElement('span');
                    desc_text.textContent = desc.substring(0, 200);

                    if (desc.length > 200){ desc_text.textContent += '...'; }

                    var title_text = document.createElement('span'); // make title
                    title_text.innerHTML = "<strong>" + title + "</strong>";

                    var date_text = document.createElement('span'); // make date
                    date_text.textContent = " " + date;
                    date_text.className = "fa fa-calendar";

                    var time_text = document.createElement('span'); // make time
                    time_text.textContent = " " + (time_ls[0]) + ":" + time_ls[1];
                    time_text.className = "fa fa-clock-o";

                    text_div.className = "text_div"; // create text object
                    text_div.append(title_text);
                    text_div.append(date_text);
                    text_div.append(time_text);
                    text_div.append(desc_text);
                    feature.append(text_div); // append complete text obj

                    feature_container.append(feature);
                }
                container.append(feature_container);
            }
            // Render the option that a specific track is selected, show details.
            function renderFocus(tracks, data){
                console.info('render single track');

                var location = window.location.href;
                container = $widget.find('#data-content');
                container.empty();

                var text_div = document.createElement('div'); // make info container
                text_div.id = 'track-info';

                var name_span = document.createElement('span');
                name_span.id = 'track-name';
                var desc_span = document.createElement('span');
                desc_span.id = 'track-desc';

                text_div.append(name_span);
                text_div.innerHTML += '</br>';
                text_div.append(desc_span)
                container.append(text_div);

                player = document.createElement('iframe');
                player.id = 'track-player';
                player.width = '100%';
                player.height = '166';
                player.scrolling = 'no';
                player.frameborder='no';
                player.allow='autoplay';
                player.src = '';
                
                container.append(player);

                var track_id = location.split("track=");   


                $.get("https://api.soundcloud.com/tracks/"+ track_id[1] +"?client_id="+encodeURIComponent(data.api_key), async function (result) {
                    //$widget.find('#track-image')[0].setAttribute('src',result.artwork_url.replace('large','t300x300'));
                    ep_num = null;
                    for (x=0;x<tracks.length;x++){
                        if (tracks[x].id == result.id){
                            ep_num = tracks.length  - (x);
                        }
                    }
                    $widget.find('#track-name')[0].textContent = "Episode " + ep_num + ": " + result.title;
                    $widget.find('#track-desc')[0].textContent = result.description;
                    $widget.find('#track-player')[0].setAttribute('src',"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + result.id + "&color=" + data.player_color.split('#')[1] + "&auto_play=" + data.player_autoplay + "&hide_related=false" + "&show_comments=" + data.player_comments + "&show_user=true" + "&show_reposts=false" + "&show_teaser=true");
                    $widget.find('#track-player')[0].id = track_id[1];
                });
            }
            // create header with account information
            function createHeader(result){
                container = $widget.find('#data-user');

                container.onclick = function(){
                    if ('track' in window.location){
                        console.log('return to features');
                        window.location = window.location.split('/?track')[0];
                    }   
                }
                container.empty();
                // todo fix styles
                var user_image = document.createElement('img');
                user_image.id = 'user-image';
                var user_name = document.createElement('span');
                user_name.id = 'user-name';
                var user_desc = document.createElement('span');
                user_desc.id = 'user-desc';

                var spacer = document.createElement('br');
                // todo add link to title
                user_image.src = result.avatar_url; 
                user_name.innerText = result.username;
                user_desc.innerText = result.description;
                container.append(user_image, user_name);
                container.append(spacer,user_desc);
            }
            // create table of track information
            function createTable(result, data){
                container = $widget.find('#data-list');
                container.empty();
                var ep_count = result.length;
                $widget.find('#tracks tr').not(':first').not(':last').remove();
                var track = '';
                prefArr = data.preferences;

                // CREATE TABLE HEADERS //
                track += "<tr id='table-header'>";
                if (prefArr.includes("count")){     // episode count
                    track += '<td><strong>' + "Episode" + '</strong></td>';
                }
                if (prefArr.includes("title")){     // title
                    track += '<td><strong>' + "Title" + '</strong></td>';
                }
                if (prefArr.includes("date")){      // date
                    track += '<td><strong>' + "Date" + '</strong></td>';
                }
                if (prefArr.includes("time")){      // time
                    track += '<td><strong>' + "Time" + '</strong></td>';
                }
                if (prefArr.includes("views")){     // view count
                    track += '<td><strong>' + "View Count" + '</strong></td>';
                }
                track += "</tr>";

                // POPULATE TRACK INFORMATION //
                for(var i = 0; i < ep_count; i++){      
                    var date_info = result[i].created_at.split(" ");
                    var time_ls = date_info[1].split(':');
                    track += "<tr class='click_track' id='"+ result[i].id +"'>";

                    if (prefArr.includes("count")){     // episode count
                        track += '<td>#' + (ep_count-i) + '</td>';
                    }
                    if (prefArr.includes("title")){     // title
                        track += '<td>' + result[i].title + '</td>';
                    }
                    if (prefArr.includes("date")){      // date
                        track += '<td>' + date_info[0] + '</td>';
                    }
                    if (prefArr.includes("time")){      // time
                        track += '<td>' + (time_ls[0]) + ":" + time_ls[1] + '</td>';
                    }
                    if (prefArr.includes("views")){     // view count   
                        track += '<td>' + result[i].playback_count + '</td>';
                    }

                    track += "</tr>";
                }
                $widget.find('#data-list').append(track);
                $("#data-list > tr[id]").each(function(){
                    this.onclick = function() { trackFocus(this.id, result, data); };
                });
            }
            //focus on specific track
            function trackFocus(id, tracks, data){
                console.info('focus ' + id);
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?track=' + id;
                window.history.pushState({ path: newurl }, '', newurl);
                renderContent(tracks,data);
            };
            //find next track
            function findNext(id, ls){
                for(x=0; x< ls.length; x++){
                    if (ls[x].id == id){
                        if (ls[x-1]){
                            return ls[x-1].id
                        }
                        else{
                            return null
                        }
                    }
                }
                return null
            };
            //find previous track
            function findPrev(id, ls){
                for(x=0; x< ls.length; x++){
                    if (ls[x].id == id){
                        if (ls[x+1]){
                            return ls[x+1].id
                        }
                        else{
                            return null
                        }
                    }
                }
                return null
            };
        };
    }
});
function returnToFeatures(){
    console.log('return to features');
    current_location = window.location.href;
    new_location = current_location.split('/?track')[0];
    window.location = new_location;
    
}

