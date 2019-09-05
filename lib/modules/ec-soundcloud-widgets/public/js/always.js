apos.define('ec-soundcloud-widgets', {
    extend: 'apostrophe-widgets',
    construct: function(self, options) {
        self.play = function ($widget, data, options) {
            $.get('/modules/ec-soundcloud-widgets/soundcloud?api_key='+data.api_key+'&client_id='+encodeURIComponent(data.api_user), function (results) {
                $widget.find('[data-events-contents]').html(results).addClass('loaded').removeClass('loading');
                var id = data.client_id;
                console.log(data);

                $.get("https://api.soundcloud.com/users/"+id+"/tracks?client_id="+encodeURIComponent(data.api_key) , function (result) {
                    var ep_count = result.length;
                    $widget.find('#tracks tr').not(':first').not(':last').remove();
                    var track = '';
                    prefArr = data.preferences;
                    console.log(result);


                    // CREATE TABLE HEADERS //
                    track += "<tr>";
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
                            track += '<td>' + date_info[1] + '</td>';
                        }
                        if (prefArr.includes("views")){     // view count
                            track += '<td>' + result[i].playback_count + '</td>';
                        }

                        track += "</tr>";
                    }
                    $widget.find('#tracks').append(track);
                });
                $.get("http://api.soundcloud.com/users/"+id+"?client_id="+encodeURIComponent(data.api_key) , function (result) { // assign user info
                    console.log(result)
                    $widget.find('#user-image').attr("src", result.avatar_url);
                    $widget.find('#user-name').append(result.username);
                    $widget.find('#user-desc').append(result.description);
                });
            });
        };
    }
});
