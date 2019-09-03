apos.define('ec-soundcloud-widgets', {
    extend: 'apostrophe-widgets',
    construct: function(self, options) {
        self.play = function ($widget, data, options) {
            $.get('/modules/ec-soundcloud-widgets/soundcloud?api_key='+data.api_key+'&client_id='+encodeURIComponent(data.api_user), function (results) {
                $widget.find('[data-events-contents]').html(results).addClass('loaded').removeClass('loading'); //this is an attribute into your html placeholder,if I remember correctly
                var id = '279716067'; //not sure how to get from api

                $.get("https://api.soundcloud.com/users/"+id+"/tracks?client_id="+encodeURIComponent(data.api_key) , function (result) {
                    var ep_count = result.length;
                    $widget.find('#tracks tr').not(':first').not(':last').remove();
                    var track = '';

                    console.log(data.preferences);
                    prefArr = data.preferences;


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
                        console.log(result[i]);
                        track += "<tr>";

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
            });
        };
    }
});
