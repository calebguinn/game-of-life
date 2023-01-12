"use strict"; 
function pow2(x){
  return Math.pow(2, x);
}

(function() {
    var onstop,
        last_mouse_x,
        last_mouse_y,
        running = false,
        rewind_state,
        max_fps,
        loaded = false,
        life = new Game(),
        drawer = new Board();

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


        if(drawer.init(document.body)){
            set_text($("notice").getElementsByTagName("h4")[0], 
                "Canvas-less browsers are not supported. I'm sorry for that.");
            return;
        }

        $("about_close").style.display = "inline";

        hide_element($("notice"));
        hide_element($("overlay"));

        show_element($("control-bar"));

        var style_element = document.createElement("style");
        document.head.appendChild(style_element);

        window.onresize = function(){
            drawer.set_size(window.innerWidth, window.innerHeight);
            
            drawer.redraw(life.root);
            drawer.redraw_background();
        }
        
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
            stop(function() {
                //set_text($("pattern_name"), "");
                set_query("");

                life.clear_pattern();

                drawer.center_view();
                drawer.redraw(life.root);
                drawer.redraw_background();
            });
        };
        
        $("reset_button").onclick = function() {
            if(rewind_state){
                stop(function(){
                    life.root = rewind_state;
                    life.generation = 0;
            
                    drawer.redraw(life.root);
                });
            }
        }
        
        drawer.canvas.onmousedown = function(e){
            if(e.which === 3 || e.which === 2){
                var coords = drawer.pixel_to_cell(e.clientX, e.clientY),
                    mouse_set = !life.get_bit(coords.x, coords.y);
                
                document.onmousemove = do_field_draw.bind(this, mouse_set);
                do_field_draw(mouse_set, e);
            } else if (e.which === 1){
                last_mouse_x = e.clientX;
                last_mouse_y = e.clientY;
                
                document.onmousemove = do_field_move;
            }
            
            return false;
        };
        
        document.onmouseup = function(e) {
            document.onmousemove = null;
        }
        
        window.onmousemove = function(e) {
            var coords = drawer.pixel_to_cell(e.clientX, e.clientY);
        }
        
        drawer.canvas.oncontextmenu = function(e) {
            return false;
        };
        
        drawer.canvas.onmousewheel = function(e){
            drawer.zoom((e.wheelDelta || -e.detail) < 0, e.clientX, e.clientY);

            drawer.redraw(life.root);
            drawer.redraw_background();
            return false;
        }
        
        drawer.canvas.addEventListener("DOMMouseScroll", drawer.canvas.onmousewheel, false); 

        window.onkeydown = function(e) {
            var chr = e.which,
                do_redraw = false,
                target = e.target.nodeName;

            if(target === "INPUT" || target === "TEXTAREA") {
                return true;
            }

            if(e.ctrlKey || e.shiftKey || e.altKey) {
                return true;
            }
            
            if(chr === 37 || chr === 72) {
                drawer.move(life.root, 15, 0);
                return false;
            } else if(chr === 38 || chr === 75) {
                drawer.move(life.root, 0, 15);
                return false;
            } else if(chr === 39 || chr === 76) {
                drawer.move(life.root, -15, 0);
                return false;
            } else if(chr === 40 || chr === 74) {
                drawer.move(life.root, 0, -15);
                return false;
            } else if(chr === 27) {
                // escape
                hide_element($("overlay"));
                return false;
            } else if(chr === 13) {
                $("start_button").onclick();
                return false;
            } else if(chr === 32) {
                $("next_button").onclick();
                return false;
            } else if(chr === 189 || chr === 173 || chr === 109) {
                drawer.zoom_centered(true);
                do_redraw = true;
            } else if(chr === 187 || chr === 61) {
                drawer.zoom_centered(false);
                do_redraw = true;
            }

            if(do_redraw) {
                drawer.redraw(life.root);
                drawer.redraw_background();

                return false;
            }

            return true;
        };

        $("about_close").onclick = function(){
            hide_element($("overlay"));
        }

        $("about_button").onclick = function(){
            show_overlay("about");
        };

        drawer.set_size(window.innerWidth, window.innerHeight);

        life.clear_pattern();
        reset_settings();
    }

    document.addEventListener("DOMContentLoaded", window.onload, false);

    function stop(callback) {
        if(running) {
            running = false;
            set_text($("start_button"), "Start");

            onstop = callback;
        } else {
            if(callback) {
                callback();
            }
        }
    }

    function reset_settings() {
        drawer.background_color = "#202023";
        drawer.border_color = "#3d3d42";
        drawer.cell_color = "#ffffff";

        drawer.border_width = 0.2;
        drawer.cell_width = 2;

        life.rule_b = 1 << 3;
        life.rule_s = 1 << 2 | 1 << 3;
        life.set_step(0);

        max_fps = 30;

        drawer.center_view();
    }

    function run() {
        var n = 0,
            start,
            last_frame,
            frame_time = 1000 / max_fps,
            interval,
            per_frame = frame_time;
        
        set_text($("start_button"), "Stop");
        
        running = true;
        
        if(life.generation === 0) {
            rewind_state = life.root;
        }
    
        
        start = Date.now();
        last_frame = start - per_frame;
        
        function update() {
            if(!running) {

                if(onstop) {
                    onstop();
                }
                return;
            }

            var time = Date.now();

            if(per_frame * n < (time - start)) {
                life.next_generation(true);
                drawer.redraw(life.root);
                
                n++;
                frame_time += (-last_frame - frame_time + (last_frame = time)) / 15;

                if(frame_time < .7 * per_frame) {
                    n = 1;
                    start = Date.now();
                }
            }
            
            nextFrame(update);
        }

        update();
    }

    function step(is_single) {
        var time;
        
        if(life.generation === 0) {
            rewind_state = life.root;
        }
        
        time = Date.now();

        life.next_generation(is_single);
        drawer.redraw(life.root);

        time = Date.now() - time;
    }

    function show_overlay(overlay_id) {
        show_element($("overlay"));

        var overlays = $("overlay").children;

        for(var i = 0; i < overlays.length; i++) {
            var child = overlays[i];

            if(child.id === overlay_id) {
                show_element(child);
            } else {
                hide_element(child);
            }
        }
    }

    function set_text(obj, text) {
        obj.textContent = String(text);
    }


    function do_field_move(e) {
        var dx = e.clientX - last_mouse_x,
            dy = e.clientY - last_mouse_y;

        drawer.move(life.root, dx, dy);

        last_mouse_x = e.clientX;
        last_mouse_y = e.clientY;
    }

    function do_field_draw(mouse_set, e) {
        var coords = drawer.pixel_to_cell(e.clientX, e.clientY);

        // don't draw the same pixel twice
        if(coords.x !== last_mouse_x || coords.y !== last_mouse_y) {
            life.set_bit(coords.x, coords.y, mouse_set);

            drawer.draw_cell(coords.x, coords.y, mouse_set);
            last_mouse_x = coords.x;
            last_mouse_y = coords.y;
        }
    }

    function $(id) {
        return document.getElementById(id);
    }

    function set_query(filename) {
        if(!window.history.replaceState) {
            return;
        }

        if(filename) {
            window.history.replaceState(null, "", "?pattern=" + filename);
        } else {
            window.history.replaceState(null, "", "/life/");
        }
    }

    function hide_element(node) {
        node.style.display = "none";
    }

    function show_element(node) {
        node.style.display = "block";
    }

})();