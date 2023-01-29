"use strict";
(function(){
  var initial_title = document.title;
  var initial_description = "";

  if(!document.addEventListener){
    return;
  }

  var onstop,
      last_mouse_x,
      last_mouse_y,
      mouse_set,
      running = false,
      max_fps,
      loaded = false,
      game = new Game(),
      board = new Board(),
      patterns_loaded = false; 

  var nextFrame =
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      setTimeout;

  window.onload = function(){
    if(loaded){
      return;
    }

    loaded = true;

    initial_description = document.querySelector("meta[name=description]").content;

    if(!board.init(document.body)){
      set_text($("notice").getElementsByTagName("h4")[0],
        "Canvas-less browsers are not supported. I'm sorry for that.");
      return;
    }

    init_ui();

    board.set_size(window.innerWidth, document.body.offsetHeight);
    reset_settings();

    var query = location.search.substr(1).split("&"),
        param,
        parameters = {};

    for(var i = 0; i < query.length; i++){
        param = query[i].split("=");

        parameters[param[0]] = param[1];
    }

    if(parameters["step"] && /^\d+$/.test(parameters["step"])){
        var step_parameter = Math.round(Math.log(Number(parameters["step"])) / Math.LN2);

        game.set_step(step_parameter);
    }

    if(parameters["noui"] === "1"){
        var elements = [
            "statusbar", "about_button", "examples_menu",
            "import_button", "settings_button", "zoomout_button",
            "zoomin_button", "clear_button", "supernext_button",
            "next_button", "reset_button"
        ];

        for(var i = 0; i < elements.length; i++){
            $(elements[i]).style.display = "none";
        }
    }

    if(parameters["fps"] && /^\d+$/.test(parameters["fps"])){
        max_fps = +parameters["fps"];
    }

    function init_ui(){
      hide_element($("notice"));
      hide_overlay();

      var style_element = document.createElement("style");
      document.head.appendChild(style_element);

      window.onresize = debounce(function(){
        board.set_size(window.innerWidth, document.body.offsetHeight);

        requestAnimationFrame(lazy_redraw.bind(0, game.root));
      }, 500);

      $("start_button").onclick = function(){
        if(running){
          stop();
        } else {
          run();
        }
      };

      $("next_button").onclick = function(){
        if(!running){
          step(true);
        }
      };

      $("clear_button").onclick = function(){
        stop(function(){
          set_title();
          set_query("");

          game.clear_pattern();

          board.center_view();
          board.redraw(game.root);
        });
      };

      $("reset_button").onclick = function(){
        if(game.rewind_state){
          stop(function(){
            game.restore_rewind_state();

            fit_pattern();
            board.redraw(game.root);
          });
        }
      };

      board.canvas.onmousedown = function(e){
          if(e.which === 3 || e.which === 2){
            if(board.cell_width >= 1){
              var coords = board.pixel_to_cell(e.clientX, e.clientY);

              mouse_set = !game.get_bit(coords.x, coords.y);

              window.addEventListener("mousemove", do_field_draw, true);
              do_field_draw(e);
            }
          } else if (e.which === 1){
            last_mouse_x = e.clientX;
            last_mouse_y = e.clientY;

            window.addEventListener("mousemove", do_field_move, true);

            (function redraw(){
              if(last_mouse_x !== null){
                requestAnimationFrame(redraw);
              }

              lazy_redraw(game.root);
            })();
          }
          return false;
      };

      var scaling = false;
      var last_distance = 0;

      function distance(touches){
        console.assert(touches.length >= 2);

        return Math.sqrt(
          (touches[0].clientX-touches[1].clientX) * (touches[0].clientX-touches[1].clientX) +
          (touches[0].clientY-touches[1].clientY) * (touches[0].clientY-touches[1].clientY));
      }

      board.canvas.addEventListener("touchstart", function(e){
        if(e.touches.length === 2){
          scaling = true;
          last_distance = distance(e.touches);
          e.preventDefault();
        } else if(e.touches.length === 1) {
          var ev = {
            which: 1,
            clientX: e.changedTouches[0].clientX,
            clientY: e.changedTouches[0].clientY,
          };

          board.canvas.onmousedown(ev);
          e.preventDefault();
        }
      }, false);

      board.canvas.addEventListener("touchmove", function(e){
        if(scaling){
          let new_distance = distance(e.touches);
          let changed = false;
          const MIN_DISTANCE = 50;

          while(last_distance - new_distance > MIN_DISTANCE){
            last_distance -= MIN_DISTANCE;
            board.zoom_centered(true);
            changed = true;
          }

          while(last_distance - new_distance < -MIN_DISTANCE){
            last_distance += MIN_DISTANCE;
            board.zoom_centered(false);
            changed = true;
          }

          if(changed){
            lazy_redraw(game.root);
          }
        }else{
          var ev = {
            clientX: e.changedTouches[0].clientX,
            clientY: e.changedTouches[0].clientY,
          };
          do_field_move(ev);
          e.preventDefault();
        }
      }, false);

      board.canvas.addEventListener("touchend", function(e){
        window.onmouseup(e);
        e.preventDefault();
        scaling = false;
      }, false);

      board.canvas.addEventListener("touchcancel", function(e){
        window.onmouseup(e);
        e.preventDefault();
        scaling = false;
      }, false);

      window.onmouseup = function(e){
        last_mouse_x = null;
        last_mouse_y = null;

        window.removeEventListener("mousemove", do_field_draw, true);
        window.removeEventListener("mousemove", do_field_move, true);
      };

      board.canvas.oncontextmenu = function(e){
        return false;
      };

      window.onkeydown = function(e){
        var chr = e.which,
            do_redraw = false,
            target = e.target.nodeName;

        if(target === "INPUT" || target === "TEXTAREA"){
          return true;
        }

        if(e.ctrlKey || e.shiftKey || e.altKey){
          return true;
        }

        if(chr === 37 || chr === 65){
          board.move(15, 0);
          do_redraw = true;
        }else if(chr === 38 || chr === 87){
          board.move(0, 15);
          do_redraw = true;
        }else if(chr === 39 || chr === 68){
          board.move(-15, 0);
          do_redraw = true;
        }else if(chr === 40 || chr === 83){
          board.move(0, -15);
          do_redraw = true;
        }else if(chr === 27){
          hide_overlay();
          return false;
        }else if(chr === 13){
          $("start_button").onclick();
          return false;
        }else if(chr === 32){
          $("next_button").onclick();
          return false;
        }else if(chr === 9){
          $("supernext_button").onclick();
          return false;
        }else if(chr === 189 || chr === 173 || chr === 109){
          board.zoom_centered(true);
          do_redraw = true;
        }else if(chr === 187 || chr === 61){
          board.zoom_centered(false);
          do_redraw = true;
        }else if(chr === 8){
          $("reset_button").onclick();
          return false;
        }else if(chr === 219 || chr === 221){
          var step = game.step;
          if(chr === 219)
            step--;
          else
            step++;

          if(step >= 0){
            game.set_step(step);
          }
          return false;
        }

        if(do_redraw){
          lazy_redraw(game.root);
          return false;
        }
        return true;
      };

      $("about_close").onclick = function(){
        hide_overlay();
      };

      $("about_button").onclick = function(){
        show_overlay("about");
      };

      $("controls_close").onclick = function(){
        hide_overlay();
      }

      $("controls_button").onclick = function(){
        show_overlay("controls");
      }

      $("patterns_close").onclick = function(){
        hide_overlay();
      }

      $("patterns_button").onclick = function(){
        if(patterns_loaded){
          show_overlay("patterns");
          return;
        }

        patterns_loaded = true;

        request_url("//127.0.0.1:5501/patterns/list", function(text){
          var patterns = text.split("\n"),
              list = $("patterns-list");

          show_overlay("patterns");
          patterns.forEach(function(pattern){
            var name = pattern.split(" ")[0],
                name_element = document.createElement("div");
            
            set_text(name_element, name);
            list.appendChild(name_element);

            name_element.onclick = function(){
              request_url(find_rle(name), function(text){

              })
            }
          })
        })
      }

    }
  };

  document.addEventListener("DOMContentLoaded", window.onload, false);

  function debounce(func, timeout){
    var timeout_id;

    return function(){
      var me = this,
          args = arguments;

      clearTimeout(timeout_id);

      timeout_id = setTimeout(function(){
        func.apply(me, Array.prototype.slice.call(args));
      }, timeout);
    };
  }

  function do_field_move(e) {
    if(last_mouse_x !== null){
      let dx = Math.round(e.clientX - last_mouse_x);
      let dy = Math.round(e.clientY - last_mouse_y);

      board.move(dx, dy);

      last_mouse_x += dx;
      last_mouse_y += dy;
    }
  }

  function do_field_draw(e){
    var coords = board.pixel_to_cell(e.clientX, e.clientY);

    if(coords.x !== last_mouse_x || coords.y !== last_mouse_y){
      game.set_bit(coords.x, coords.y, mouse_set);
      board.draw_cell(coords.x, coords.y, mouse_set);
      last_mouse_x = coords.x;
      last_mouse_y = coords.y;
    }
  }

  function fit_pattern(){
    var bounds = game.get_root_bounds();
    board.fit_bounds(bounds);
  }

  function hide_overlay(){
    hide_element($("overlay"));
    document.body.style.overflow = "hidden";
  }

  function hide_element(node){
    node.style.display = "none";
  }

  function request_url(url, onready, onerror){
    var http = new XMLHttpRequest();

    http.onreadystatechange = function(){
      if(http.readyState === 4){
        if(http.status === 200){
          onready(http.responseText, url);
        } else {
          if(onerror) {
            onerror(http.responseText, http.status);
          }
        }
      }
    };

    http.open("get", url, true);
    http.send("");

    return {
      cancel : function() {
        http.abort();
      }
    };
  }

  function lazy_redraw(node){
    if(!running || max_fps < 15){
      board.redraw(node);
    }
  }

  function reset_settings(){
    board.background_color = "#202023";
    board.cell_color = "#ffffff";

    board.border_width = 0.25;
    board.cell_width = 2;

    game.rule_b = 1 << 3;
    game.rule_s = 1 << 2 | 1 << 3;
    game.set_step(0);

    max_fps = 20;

    board.center_view();
  }

  function run(){
    var n = 0,
        start,
        last_frame,
        frame_time = 1000 / max_fps,
        interval,
        per_frame = frame_time;

    set_text($("start_button"), "Stop");

    running = true;

    if(game.generation === 0){
      game.save_rewind_state();
    }

    interval = setInterval(function(){}, 666);

    start = Date.now();
    last_frame = start - per_frame;

    function update(){
      if(!running){
        clearInterval(interval);
        if(onstop) {
          onstop();
        }
        return;
      }

      var time = Date.now();

      if(per_frame * n < (time - start)){
        game.next_generation(true);
        board.redraw(game.root);

        n++;
        frame_time += (-last_frame - frame_time + (last_frame = time)) / 15;

        if(frame_time < .7 * per_frame){
          n = 1;
          start = Date.now();
        }
      }
      nextFrame(update);
    }
    update();
  }

  function find_rle(id){
    id = id + ".rle";
    return "//127.0.0.1:5500/examples/" + id;
  }

  function step(is_single){
    var time = Date.now();

    if(game.generation === 0){
      game.save_rewind_state();
    }

    game.next_generation(is_single);
    board.redraw(game.root);
  }

  function stop(callback){
    if(running){
      running = false;
      set_text($("start_button"), "Start");

      onstop = callback;
    } else {
      if(callback) {
        callback();
      }
    }
  }

  function show_overlay(overlay_id) {
    show_element($("overlay"));
    document.body.style.overflow = "auto";

    var overlays = $("overlay").children;

    for(var i = 0; i < overlays.length; i++){
      var child = overlays[i];

      if(child.id === overlay_id){
        show_element(child);
      }else{
        hide_element(child);
      }
    }
  }

  function set_text(obj, text){
    obj.textContent = String(text);
  }

  function set_query(filename){
    if(!window.history.replaceState){
      return;
    }

    if(filename){
      window.history.replaceState(null, "", "?pattern=" + filename);
    } else {
      window.history.replaceState(null, "", "/game-of-life/");
    }
  }

  function set_title(title){
    if(title){
      document.title = title + " - " + initial_title;
    }else{
      document.title = initial_title;
    }
  }

  function show_element(node){
    node.style.display = "block";
  }

  function $(id){
    return document.getElementById(id);
  }
})();

