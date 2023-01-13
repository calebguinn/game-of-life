"use strict"
function Board(){
  var canvas_offset_x = 0,
      canvas_offset_y = 0,
      canvas,
      context,
      background_canvas,
      background_context,
      foreground_context,
      offscreen_canvas,
      screen_left, 
      screen_top, 
      screen_right, 
      screen_bottom,
      board = this;

  this.width = 0;
  this.height = 0;

  this.init = init;
  this.redraw = redraw;
  this.redraw_background = redraw_background;
  this.move = move;
  this.zoom = zoom;
  this.zoom_centered = zoom_centered;
  this.set_size = set_size;
  this.draw_cell = draw_cell;
  this.center_view = center_view;
  this.zoom_to = zoom_to;
  this.pixel_to_cell = pixel_to_cell;

  function init(dom_parent){
    canvas = document.createElement("canvas");
    
    if(!canvas.getContext) {
      return false;
    }

    board.canvas = background_canvas = document.createElement("canvas");
    offscreen_canvas = document.createElement("canvas");
    
    context = offscreen_canvas.getContext("2d");
    background_context = background_canvas.getContext("2d");

    background_canvas.style.position = "absolute"; 
    background_canvas.style.top = background_canvas.style.left = "0px";

    foreground_context = canvas.getContext("2d");

    dom_parent.appendChild(canvas);
    dom_parent.appendChild(background_canvas);
  }

  function set_size(width, height){
    if(width !== canvas.width || height !== canvas.height){
      offscreen_canvas.width = background_canvas.width = canvas.width = width;
      offscreen_canvas.height = background_canvas.height = canvas.height = height;
      
      context.fillStyle = board.cell_color;
    }
  }

  function draw_node(node, left, top){
      if(node.population === 0){
          return;
      }
      
      var offset = pow2(node.level - 1),
          offset2 = offset * 2;
      
      if( 
          left + offset2 < screen_left ||
          top + offset2 < screen_top ||
          left > screen_right ||
          top > screen_bottom
      ) {
          return;
      }

      if(node.level === 0){
        if(node.population){
          context.fillRect(
            canvas_offset_x + left * board.cell_width,
            canvas_offset_y + top * board.cell_width,
            board.cell_width,
            board.cell_width
          );
        }
      }
      else if(offset2 * board.cell_width <= 1){
        if(node.population){
          context.fillRect(
            canvas_offset_x + left * board.cell_width | 0,
            canvas_offset_y + top * board.cell_width | 0,
            1,
            1
          );
        }
      }
      else
      {
        draw_node(node.nw, left, top);
        draw_node(node.ne, left + offset, top);
        draw_node(node.sw, left, top + offset);
        draw_node(node.se, left + offset, top + offset);
      }
  }

  function redraw_part(node, x, y, width, height){
    screen_left = Math.floor((x - canvas_offset_x) / board.cell_width);
    screen_top = Math.floor((y - canvas_offset_y) / board.cell_width);
    screen_right = Math.ceil((x - canvas_offset_x + width) / board.cell_width); 
    screen_bottom = Math.ceil((y - canvas_offset_y + height) / board.cell_width);

    context.fillStyle = board.background_color;
    context.fillRect(x, y, width, height);
    context.fillStyle = board.cell_color;

    var offset = pow2(node.level - 1);
    
    draw_node(node, -offset, -offset);

    foreground_context.drawImage(offscreen_canvas, x, y, width, height, x, y, width, height);
  }

  function redraw(node){
      redraw_part(node, 0, 0, canvas.width, canvas.height);
  }

  function redraw_background(){
    var border_width = board.border_width * board.cell_width | 0;

    background_context.clearRect(0, 0, canvas.width, canvas.height);

    if(border_width === 0) {
      return;
    }
    
    background_context.fillStyle = board.border_color;
    
    var x = canvas_offset_x % board.cell_width - border_width;
    for(; x < canvas.width; x += board.cell_width){
      background_context.fillRect(x, 0, border_width, canvas.height);
    }
    
    var y = canvas_offset_y % board.cell_width - border_width;
    for(; y < canvas.height; y += board.cell_width){
      background_context.fillRect(0, y, canvas.width, border_width);
    }
    
    background_context.fillStyle = board.cell_color;
  }

  function zoom(out, center_x, center_y){
    if(out){
      canvas_offset_x -= Math.round((canvas_offset_x - center_x) / 2);
      canvas_offset_y -= Math.round((canvas_offset_y - center_y) / 2);
      
      board.cell_width /= 2;
    }
    else{
      canvas_offset_x += Math.round(canvas_offset_x - center_x);
      canvas_offset_y += Math.round(canvas_offset_y - center_y);
      
      board.cell_width *= 2;
    }
  }

  function zoom_centered(out){
    zoom(out, canvas.width >> 1, canvas.height >> 1);
  }

  function zoom_to(level){
    while(board.cell_width > level){
        zoom_centered(true);
    }

    while(board.cell_width * 2 < level){
        zoom_centered(false);
    }
  }

  function center_view(){
    canvas_offset_x = canvas.width >> 1;
    canvas_offset_y = canvas.height >> 1;
  }

  function move(node, dx, dy){
    canvas_offset_x += dx;
    canvas_offset_y += dy;

    foreground_context.drawImage(canvas, dx, dy);

    if(dx < 0) {
      redraw_part(node, canvas.width + dx, 0, -dx, canvas.height);
    }
    else if(dx > 0){
      redraw_part(node, 0, 0, dx, canvas.height);
    }

    if(dy < 0){
      redraw_part(node, 0, canvas.height + dy, canvas.width, -dy);
    }
    else if(dy > 0){
      redraw_part(node, 0, 0, canvas.width, dy);
    }

    board.redraw_background();
  }

  function draw_cell(x, y, set){
    var cell_x = x * board.cell_width + canvas_offset_x,
        cell_y = y * board.cell_width + canvas_offset_y;

    if(set) {
      foreground_context.fillStyle = board.cell_color;
    }
    else {
      foreground_context.fillStyle = board.background_color;
    }

    foreground_context.fillRect(cell_x, cell_y, board.cell_width, board.cell_width);
  }

  function pixel_to_cell(x, y){
    return {
      x : Math.floor((x - canvas_offset_x + board.border_width / 2) / board.cell_width),
      y : Math.floor((y - canvas_offset_y + board.border_width / 2) / board.cell_width)
    };
  }
}