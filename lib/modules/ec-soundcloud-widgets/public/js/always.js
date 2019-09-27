apos.define('ec-soundcloud-widgets', {
    extend: 'apostrophe-widgets',
    construct: function(self, options) {
        self.play = function ($widget, data, options) {
            $.get('/modules/ec-soundcloud-widgets/soundcloud?api_key='+data.api_key+'&client_id='+encodeURIComponent(data.api_user), async function (results) {
                // TRACK INFORMATION API CALL
                $.get("https://api.soundcloud.com/users/"+data.client_id+"/tracks?client_id="+encodeURIComponent(data.api_key) , async function (tracks_result) {
                    $widget.find('#data-list').val('');
                    createTable(tracks_result, data); // render table
                    renderContent(tracks_result, data); // render content area
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
                console.log('render content area');

                var location = window.location.href;

                container = $widget.find('#data-content');
                container.empty();

                var content = document.createElement('span');
                if(!location.includes('?track')){ // render featured tracks
                    // todo get next and previous tracks
                    content.innerHTML = "featured tracks";
                    // todo fix content for feature render
                }
                else{ // render single track focus
                    content.innerHTML = "single track focus";
                    // todo fix content for single track focus
                }
                container.append(content);
            }
            // create header with account information
            function createHeader(result){
                container = $widget.find('#data-user');
                container.empty();
                // todo fix styles
                var user_image = document.createElement('img');
                var user_name = document.createElement('span');
                var user_desc = document.createElement('span');
                // todo add link to title
                user_image.src = result.avatar_url; 
                user_name.innerText = result.username;
                user_desc.innerText = result.description;
                container.append(user_image, user_name, user_desc);
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
                    this.onclick = function() { trackFocus(this.id), data, result };
                });
            }
            //focus on specific track
            function trackFocus(id, data, result){
                var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?track=' + id;
                window.history.pushState({ path: newurl }, '', newurl);
                renderContent(result, data);
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

