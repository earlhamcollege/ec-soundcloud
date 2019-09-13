apos.define('ec-soundcloud-widgets', {
    extend: 'apostrophe-widgets',
    construct: function(self, options) {
        self.play = function ($widget, data, options) {
            $.get('/modules/ec-soundcloud-widgets/soundcloud?api_key='+data.api_key+'&client_id='+encodeURIComponent(data.api_user), function (results) {
                //$widget.find('[data-events-contents]').html(results).addClass('loaded').removeClass('spinner-grow');
                var id = data.client_id;

                $.get("https://api.soundcloud.com/users/"+id+"/tracks?client_id="+encodeURIComponent(data.api_key) , function (result) {
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
                        track += "<tr id='"+ result[i].id +"'>";

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
                            track += '<td>' + (time_ls[0] % 12 ) + ":" + time_ls[1];
                            if (time_ls[0] > 12){
                                track += " pm" + '</td>';
                            }
                            else{
                                track += " am" + '</td>';
                            }
                        }
                        if (prefArr.includes("views")){     // view count
                            track += '<td>' + result[i].playback_count + '</td>';
                        }

                        track += "</tr>";
                    }
                    $widget.find('#tracks').append(track);

                    $("#feature-container > div[id]").each(function(){
                        var img_url = result[this.id[this.id.length - 1]].artwork_url.replace('large','t300x300'); // get image
                        var desc = result[this.id[this.id.length - 1]].description; // get desc
                        var title = result[this.id[this.id.length - 1]].title; // get title
                        var date = result[this.id[this.id.length - 1]].created_at.split(" ")[0]; // get date
                        var time = result[this.id[this.id.length - 1]].created_at.split(" ")[1]; // get time
                        var img_div = document.createElement('div');
                        img_div.style.backgroundImage = "url('"+ img_url +"')"; 
                        img_div.className = "img_div"; 
                        this.append(img_div); // append complete image obj

                        time_ls = time.split(':');

                        var elem = document.createElement("img");
                        elem.setAttribute("src", "https://phantom-farms.com/wp-content/uploads/2018/11/http___pluspng.com_img-png_play-button-png-filename-play-button-png-237.png");
                        elem.setAttribute("height", "100%");
                        elem.setAttribute("width", "100%");
                        img_div.append(elem);

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
                        time_text.textContent = " " + (time_ls[0] % 12 ) + ":" + time_ls[1];
                        if (time_ls[0] > 12){
                            time_text.textContent += " pm";
                        }
                        else{
                            time_text.textContent += " am";
                        }
                        time_text.className = "fa fa-clock-o";

                        text_div.className = "text_div"; // create text object
                        text_div.append(title_text);
                        text_div.append(date_text);
                        text_div.append(time_text);
                        text_div.append(desc_text);
                        //text_div.append(title_text);
                        this.append(text_div); // append complete text obj
                    });
                });
                $.get("http://api.soundcloud.com/users/"+id+"?client_id="+encodeURIComponent(data.api_key) , function (result) { // assign user info
                    $widget.find('#user-image').attr("src", result.avatar_url);
                    $widget.find('#user-name').append(result.username);
                    $widget.find('#user-desc').append(result.description);
                });
                
            });
        };
    }
});
