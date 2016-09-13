$(document).ready(function() {
    var ytUrl = 'https:\/\/gdata.youtube.com/feeds/api/playlists/';
    var videoURL = 'http:\/\/www.youtube.com/watch?v=';

    function YTLoad(carousel) {
        var k = 0;
        var i = 0;
        $("#playlist-nav a").each(function() {
            $("#video_lists").html($("#video_lists").html() + '<ol class="videolist" id="videolist_' + $(this).attr('id') + '"></ol>')
        });
        YTSuccess(carousel, i, k);
        $("#playlist-nav a").click(function() {
            var playlistId = $(this).attr('id');
            change_marquee(playlistId)
        });
        $("#playlist-nav a").click(function() {
            var navclass = 'item_' + $(this).attr('id');
            var playlistId = $(this).attr('id');
            var destination = parseInt($('.' + navclass).eq(0).attr('jcarouselindex')) + 1;
            carousel.scroll($.jcarousel.intval(destination))
        });
        var startPlaylistId = $("#playlist-nav a").first().attr('id');
        setTimeout(function() {
            change_marquee(startPlaylistId)
        }, 500);
        $(".simplePagerNav li a").click(function() {
            if (isNaN($(this).attr('rel'))) {
                rel = parseInt($("li.currentPage a").first().attr('rel'));
                if ($(this).parent("li").parent("ul").parent(".simplePagerContainer").find("a[rel='" + rel + "']").length < 1 || $(this).parent("li").parent("ul").parent(".simplePagerContainer").find("a[rel='" + rel + "']") == undefined) {
                    rel = parseInt($("li.currentPage a").first().attr('rel'))
                }
            } else {
                var rel = $(this).attr('rel')
            }
            var multiple = rel - 1;
            var idx = parseInt(multiple) * 5;
            var playlistId = getPlaylistId($('#description_marquee').attr('class'));
            var jcidx = parseInt($('li.item_' + playlistId + '[rel=' + idx + ']').attr('jcarouselindex')) + 1;
            carousel.scroll($.jcarousel.intval(jcidx))
        })
    };

    function getPlaylistId(str) {
        var parts = str.split("_");
        var plId = parts[parts.length - 1];
        return plId
    }

    function buildVideoList(listId) {
        var vlist = $("#videolist_" + listId);
        var listsize = $("#videolist_" + listId + " li").size();
        var videolist = '<ol class="videolist">' + vlist.html() + '</ol>';
        return videolist
    }

    function carousel_page() {
        var carousel = $('#slides').data('jcarousel');
        var firstItem = $('li[jcarouselindex=' + carousel.first + ']');
        if (parseInt(firstItem.attr('rel')) % 5 === 0) {
            var playlistId = getPlaylistId($('#description_marquee').attr('class'));
            var plSize = $('#description_marquee ol.videolist li').length;
            var plIndex = $.inArray(playlistId, playlists)
        }
    }

    function change_marquee(playlistId) {
        var carousel = $('#slides').data('jcarousel');
        var navclass = 'item_' + playlistId;
        var vlist = $("#videolist_" + playlistId);
        var videolist = buildVideoList(playlistId);
        var descTxt = $('#desc_' + playlistId).html();
        $("#description_marquee").removeClass().addClass('marquee_' + playlistId).html(descTxt + videolist);
        $('#description_marquee ol.videolist').quickPager({
            pageSize: '5'
        });
        var destination = parseInt($('.' + navclass).eq(0).attr('jcarouselindex')) + 1;
        carousel.scroll($.jcarousel.intval(destination));
        $("a.vid_link").click(function() {
            $.fancybox({
                'padding': 0,
                'autoScale': false,
                'transitionIn': 'none',
                'transitionOut': 'none',
                'title': this.title,
                'width': 680,
                'height': 495,
                'href': this.href.replace(new RegExp("watch\\?v=", "i"), 'embed/') + '?autoplay=1&amp;rel=0',
                'type': 'iframe',
                'swf': {
                    'wmode': 'opaque',
                    'allowfullscreen': 'true'
                }
            });
            return false
        });
        $(".simplePagerNav li a").click(function() {
            if (isNaN($(this).attr('rel'))) {
                rel = parseInt($("li.currentPage a").first().attr('rel'));
                if ($(this).parent("li").parent("ul").parent(".simplePagerContainer").find("a[rel='" + rel + "']").length < 1 || $(this).parent("li").parent("ul").parent(".simplePagerContainer").find("a[rel='" + rel + "']") == undefined) {
                    rel = parseInt($("li.currentPage a").first().attr('rel'))
                }
            } else {
                var rel = $(this).attr('rel')
            }
            var multiple = rel - 1;
            var idx = parseInt(multiple) * 5;
            var playlistId = getPlaylistId($('#description_marquee').attr('class'));
            var jcidx = parseInt($('li.item_' + playlistId + '[rel=' + idx + ']').attr('jcarouselindex')) + 1;
            carousel.scroll($.jcarousel.intval(jcidx))
        })
    }

    function YTSuccess(carousel, i, k) {
        if (playlists[i] != undefined) {
            $.ajax({
                url: ytUrl + playlists[i] + '?alt=json-in-script&callback=?',
                dataType: 'json',
                success: function(data) {
                    var n = 0;
                    var playlistTitle = data.feed.title.$t;
                    var playlistId = data.feed.yt$playlistId.$t;
                    $.each(data.feed.entry, function(j, item) {
                        var description = item.content.$t;
                        description = description.replace(/(\r\n)/gm, "<br />");
                        var feedTitle = item.title.$t;
                        var feedURL = item.link[1].href;
                        var fragments = feedURL.split("/");
                        var videoID = fragments[fragments.length - 2];
                        var url = videoURL + videoID;
                        var seconds = item.media$group.yt$duration.seconds;
                        var minutes = Math.floor(seconds / 60);
                        var seconds = seconds - minutes * 60;
                        if (seconds < 10) {
                            seconds = '0' + seconds
                        }
                        var duration = minutes + ':' + seconds;
                        var thumb = "http:\/\/wayback.archive-it.org\/2236\/20160712140228\/http:\/\/img.youtube.com/vi/" + videoID + "/default.jpg";
                        playlistId = playlistId.replace(/^PL/, "");
                        playlistId = playlistId.replace(/^SP/, "");
                        carousel.add(k, '<li rel="' + j + '" class="item_' + playlistId + '"><a id="vid_' + k + '" class="vid_link" href="' + url + '" alt="' + feedTitle + '" title="' + feedTitle + '"><img alt="' + feedTitle + '" src="' + thumb + '" /></a><div class="item_desc" rel= "' + playlistId + '" id="desc_' + k + '"><h2>' + feedTitle + ' (' + duration + ')</h2><p>' + description + '</p></div></li>');
                        $("div#video_lists ol#videolist_" + playlistId).append('<li><a id="marqueelink_' + k + '" class="vid_link marquee_link" href="' + url + '" alt="' + feedTitle + '" title="' + feedTitle + '">' + feedTitle + ' (' + duration + ')</a>');
                        n++;
                        k++
                    });
                    carousel.size(k + 1);
                    $('div#desc_' + playlists[i] + ' p:last').append(' (' + n + ' videos)')
                },
                complete: function() {
                    if (i < playlists.length) {
                        YTSuccess(carousel, i + 1, k)
                    }
                }
            })
        }
    }
    $("#slides").jcarousel({
        setupCallback: YTLoad,
        scroll: 1,
        itemFirstInCallback: {
            onBeforeAnimation: function(carousel) {
                var firstItem = $('li[jcarouselindex=' + (carousel.first - 1) + ']');
                var num = (parseInt(firstItem.attr('rel')));
                var pageClass = $('a#marqueelink_' + (parseInt(carousel.first) - 1)).parent('li').attr('class');
                if (pageClass != undefined) {
                    var pageNum = parseInt(pageClass.replace("simplePagerPage", ""))
                }
                if ((num % 5 === 0) && parseInt(pageNum) <= parseInt($('#maxpag').val())) {
                    var playlistId = getPlaylistId($('#description_marquee').attr('class'));
                    $('#description_marquee ol.videolist li').hide();
                    $('ol.videolist li.' + pageClass).fadeIn();
                    $("li.currentPage").removeClass("currentPage");
                    $("li.simplePageNav" + pageNum).addClass("currentPage");
                    $("#crnt").val(pageNum)
                } else {
                    var plIndex = parseInt($.inArray(playlistId, playlists));
                    if (playlists[plIndex + 1] != undefined) {}
                }
            }
        }
    })
});